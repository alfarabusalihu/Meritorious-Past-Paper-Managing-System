import { NextResponse } from 'next/server';
import { incrementStat } from '@/lib/stats';

export async function POST(request: Request) {
    try {
        const { type } = await request.json();

        if (type !== 'visitors' && type !== 'downloads') {
            return NextResponse.json({ error: 'Invalid stat type' }, { status: 400 });
        }

        const newValue = await incrementStat(type);
        return NextResponse.json({ success: true, value: newValue });
    } catch (error) {
        console.error('Stats increment error:', error);
        return NextResponse.json({ error: 'Failed to increment statistics' }, { status: 500 });
    }
}
