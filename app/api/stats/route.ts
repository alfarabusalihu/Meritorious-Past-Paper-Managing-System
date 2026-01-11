import { NextResponse } from 'next/server';
import { getSystemStats } from '@/lib/stats';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const stats = await getSystemStats();
        return NextResponse.json(stats);
    } catch (error) {
        console.error('Stats fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
    }
}
