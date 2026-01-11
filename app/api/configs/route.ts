import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const configs = await sql`SELECT id, data FROM site_configs`;
        const configMap = configs.reduce((acc, curr) => {
            acc[curr.id] = curr.data;
            return acc;
        }, {});
        return NextResponse.json(configMap);
    } catch (error) {
        console.error('Config fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { id, data } = await request.json();

        if (!id || !data) {
            return NextResponse.json({ error: 'Missing id or data' }, { status: 400 });
        }

        await sql`
            INSERT INTO site_configs (id, data, updated_at)
            VALUES (${id}, ${JSON.stringify(data)}, NOW())
            ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
        `;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Config update error:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
