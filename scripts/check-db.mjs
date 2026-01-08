import postgres from 'postgres';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

async function check() {
    try {
        await sql`SELECT count(*) FROM notifications`;
        console.log('VERIFICATION SUCCESS: Table "notifications" exists.');
    } catch (e) {
        console.error('VERIFICATION FAILED: ' + e.message);
    } finally {
        await sql.end();
    }
}

check();
