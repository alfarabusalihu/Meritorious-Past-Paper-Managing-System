import postgres from 'postgres';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
}

const sql = postgres(DATABASE_URL, { ssl: 'require' });

async function init() {
    console.log('Initializing database...');

    try {
        // 1. Enable pgcrypto
        await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;

        // 2. Create profiles table
        await sql`
            CREATE TABLE IF NOT EXISTS profiles (
                id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
                email TEXT UNIQUE NOT NULL,
                name TEXT,
                role TEXT CHECK (role IN ('admin', 'staff')) DEFAULT 'staff',
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `;
        console.log('Table "profiles" created/verified.');

        // 3. Add handle_new_user trigger
        await sql`
            CREATE OR REPLACE FUNCTION public.handle_new_user()
            RETURNS TRIGGER AS $$
            BEGIN
              INSERT INTO public.profiles (id, email, name, role)
              VALUES (
                new.id, 
                new.email, 
                COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
                'staff'
              );
              RETURN new;
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER;
        `;
        await sql`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
                    CREATE TRIGGER on_auth_user_created
                    AFTER INSERT ON auth.users
                    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
                END IF;
            END $$;
        `;
        console.log('Trigger "on_auth_user_created" verified/created.');

        // 4. Create papers table
        await sql`
            CREATE TABLE IF NOT EXISTS papers (
                paper_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                paper_name TEXT NOT NULL,
                subject TEXT NOT NULL,
                year INTEGER NOT NULL,
                category TEXT NOT NULL,
                part TEXT NOT NULL,
                language TEXT DEFAULT 'English',
                pdf_url TEXT NOT NULL,
                added_by TEXT NOT NULL,
                content_hash TEXT UNIQUE,
                added_date TIMESTAMPTZ DEFAULT NOW()
            );
        `;
        console.log('Table "papers" created/verified.');

        // 5. Create notifications table
        await sql`
            CREATE TABLE IF NOT EXISTS notifications (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                type TEXT NOT NULL,
                message TEXT NOT NULL,
                target_id UUID,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                read BOOLEAN DEFAULT FALSE,
                actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL
            );
        `;
        console.log('Table "notifications" created/verified.');

        // 6. Create system_stats table
        await sql`
            CREATE TABLE IF NOT EXISTS system_stats (
                id TEXT PRIMARY KEY,
                value BIGINT DEFAULT 0,
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
        `;
        await sql`INSERT INTO system_stats (id, value) VALUES ('visitors', 0) ON CONFLICT (id) DO NOTHING;`;
        await sql`INSERT INTO system_stats (id, value) VALUES ('downloads', 0) ON CONFLICT (id) DO NOTHING;`;
        console.log('Table "system_stats" created/verified.');

        // 7. Create site_configs table
        await sql`
            CREATE TABLE IF NOT EXISTS site_configs (
                id TEXT PRIMARY KEY,
                data JSONB NOT NULL,
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
        `;

        // Seed initial site configurations
        const initialFilters = {
            subjects: ['Mathematics', 'Science'],
            categories: ['PAPER', 'SCHEME'],
            parts: ['Part 1', 'Part 2']
        };
        const initialSocials = {
            facebook: 'https://facebook.com',
            twitter: 'https://twitter.com',
            instagram: 'https://instagram.com'
        };

        await sql`INSERT INTO site_configs (id, data) VALUES ('filters', ${JSON.stringify(initialFilters)}) ON CONFLICT (id) DO NOTHING;`;
        await sql`INSERT INTO site_configs (id, data) VALUES ('socials', ${JSON.stringify(initialSocials)}) ON CONFLICT (id) DO NOTHING;`;
        console.log('Table "site_configs" created/verified.');

        // 8. Seed Admin User
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (adminEmail && adminPassword) {
            console.log(`Seeding admin user: ${adminEmail}`);
            const [existingAuthUser] = await sql`SELECT id FROM auth.users WHERE email = ${adminEmail}`;
            let adminId;

            if (!existingAuthUser) {
                const [newAuthUser] = await sql`
                    INSERT INTO auth.users (
                        instance_id, id, aud, role, email, encrypted_password, 
                        email_confirmed_at, recovery_sent_at, last_sign_in_at, 
                        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
                        confirmation_token, email_change, email_change_token_new, recovery_token
                    )
                    VALUES (
                        '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 
                        ${adminEmail}, crypt(${adminPassword}, gen_salt('bf')), 
                        NOW(), NOW(), NOW(), 
                        '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW(), 
                        '', '', '', ''
                    )
                    RETURNING id
                `;
                adminId = newAuthUser.id;
            } else {
                adminId = existingAuthUser.id;
            }

            const [existingProfile] = await sql`SELECT id FROM profiles WHERE id = ${adminId}`;
            if (!existingProfile) {
                await sql`
                    INSERT INTO profiles (id, email, name, role)
                    VALUES (${adminId}, ${adminEmail}, 'Admin', 'admin')
                `;
            } else {
                await sql`UPDATE profiles SET role = 'admin' WHERE id = ${adminId}`;
            }
            console.log('Admin user setup complete.');
        }

        // 7. Seed initial mock data if empty
        const [existingCount] = await sql`SELECT count(*) FROM papers`;
        if (parseInt(existingCount.count) == 0) {
            console.log('Seeding initial mock data...');
            const mockPapers = [
                {
                    paper_name: 'Mathematics 2023 - Annual',
                    subject: 'Mathematics',
                    year: 2023,
                    category: 'PAPER',
                    part: 'Part 1',
                    language: 'English',
                    added_by: 'Admin',
                    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
                },
                {
                    paper_name: 'Physics 2022 - Scheme',
                    subject: 'Physics',
                    year: 2022,
                    category: 'SCHEME',
                    part: 'Part 2',
                    language: 'English',
                    added_by: 'Staff',
                    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
                }
            ];

            for (const paper of mockPapers) {
                await sql`
                    INSERT INTO papers (paper_name, subject, year, category, part, language, added_by, pdf_url)
                    VALUES (${paper.paper_name}, ${paper.subject}, ${paper.year}, ${paper.category}, ${paper.part}, ${paper.language}, ${paper.added_by}, ${paper.pdf_url})
                `;
            }
            console.log('Initial papers seeded.');
        }

    } catch (error) {
        console.error('Error during init:', error);
    } finally {
        await sql.end();
    }
}

init();
