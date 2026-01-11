import sql from './db';

export async function getSystemStats() {
    const stats = await sql`SELECT id, value FROM system_stats`;
    const visitorRecord = stats.find(s => s.id === 'visitors');
    const downloadRecord = stats.find(s => s.id === 'downloads');

    const [contributorCount] = await sql`SELECT COUNT(*) FROM profiles`;

    return {
        visitors: Number(visitorRecord?.value || 0),
        downloads: Number(downloadRecord?.value || 0),
        contributors: Number(contributorCount.count || 0)
    };
}

export async function incrementStat(id: 'visitors' | 'downloads') {
    return await sql`
        UPDATE system_stats 
        SET value = value + 1, updated_at = NOW() 
        WHERE id = ${id}
        RETURNING value
    `;
}
