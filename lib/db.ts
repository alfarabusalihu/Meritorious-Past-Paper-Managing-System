import postgres from 'postgres';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in environment variables');
}

const sql = postgres(process.env.DATABASE_URL, {
    /* options */
    ssl: 'require',
    prepare: false, // Essential for Supabase Transaction Pooler (port 6543)
});

export default sql;
