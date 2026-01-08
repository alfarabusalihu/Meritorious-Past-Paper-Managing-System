import sql from './db';
import { User } from '@/types/user';

export async function getProfiles() {
    try {
        const profiles = await sql`
            SELECT * FROM profiles 
            ORDER BY created_at DESC
        `;
        return profiles as any[];
    } catch (error) {
        console.error('Database Error (getProfiles):', error);
        throw new Error('Failed to fetch profiles');
    }
}

export async function getNotifications(limit: number = 20) {
    try {
        const notifications = await sql`
            SELECT n.*, p.name as actor_name
            FROM notifications n
            LEFT JOIN profiles p ON n.actor_id = p.id
            ORDER BY n.created_at DESC
            LIMIT ${limit}
        `;
        return notifications as any[];
    } catch (error) {
        console.error('Database Error (getNotifications):', error);
        throw new Error('Failed to fetch notifications');
    }
}
