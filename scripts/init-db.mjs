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
        // Create profiles table for role-based access
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

        // Enable RLS on profiles if not already enabled (simple check)
        // Note: For a real app, you'd want proper RLS policies here.

        // Create papers table
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
                added_date TIMESTAMPTZ DEFAULT NOW()
            );
        `;
        console.log('Table "papers" created/verified.');

        // Create notifications table
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

        // Seed Admin User
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (adminEmail && adminPassword) {
            console.log(`Seeding admin user: ${adminEmail}`);

            // 1. Ensure pgcrypto is enabled
            await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;

            // 2. Insert into auth.users if not exists
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
                console.log('Admin user created in auth.users');
            } else {
                adminId = existingAuthUser.id;
                console.log('Admin user already exists in auth.users');
            }

            // 3. Insert into public.profiles if not exists
            const [existingProfile] = await sql`SELECT id FROM profiles WHERE id = ${adminId}`;
            if (!existingProfile) {
                await sql`
                    INSERT INTO profiles (id, email, name, role)
                    VALUES (${adminId}, ${adminEmail}, 'Admin', 'admin')
                `;
                console.log('Admin profile created in public.profiles');
            } else {
                await sql`
                    UPDATE profiles SET role = 'admin' WHERE id = ${adminId}
                `;
                console.log('Admin profile updated for admin role');
            }
        }

        // Alter table to add language if it doesn't exist
        await sql`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='papers' AND column_name='language') THEN
                    ALTER TABLE papers ADD COLUMN language TEXT NOT NULL DEFAULT 'English';
                END IF;
            END $$;
        `;

        // Check if data exists
        const existing = await sql`SELECT count(*) FROM papers`;
        if (parseInt(existing[0].count) <= 6) { // Re-seed if only original mock data exists or empty
            console.log('Cleaning and re-seeding initial data...');
            await sql`TRUNCATE TABLE papers`;

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
                },
                {
                    paper_name: 'Chemistry 2023 - Tamil',
                    subject: 'Chemistry',
                    year: 2023,
                    category: 'PAPER',
                    part: 'Part 1',
                    language: 'Tamil',
                    added_by: 'Admin',
                    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
                },
                {
                    paper_name: 'Biology 2021 - Annual',
                    subject: 'Biology',
                    year: 2021,
                    category: 'PAPER',
                    part: 'Part 2',
                    language: 'English',
                    added_by: 'Staff',
                    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
                },
                {
                    paper_name: 'Comb. Mathematics 2024',
                    subject: 'Comb. Mathematics',
                    year: 2024,
                    category: 'PAPER',
                    part: 'Part 1',
                    language: 'English',
                    added_by: 'Admin',
                    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
                },
                {
                    paper_name: 'History 2023 - Tamil',
                    subject: 'History',
                    year: 2023,
                    category: 'PAPER',
                    part: 'Part 1',
                    language: 'Tamil',
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
            console.log('Seeding completed.');
        } else {
            console.log('Table already has production data, skipping seed.');
        }

    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await sql.end();
    }
}

init();
