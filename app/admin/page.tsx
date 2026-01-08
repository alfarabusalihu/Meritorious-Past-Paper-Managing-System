import { getProfiles, getNotifications } from '@/lib/users';
import UserTable from '@/components/admin/UserTable';
import NotificationList from '@/components/admin/NotificationList';

export default async function AdminDashboard() {
    // In a real app, you would verify admin session here using cookies() or headers()
    // For this migration, we are focusing on the structural change to Server Components

    const [users, notifications] = await Promise.all([
        getProfiles(),
        getNotifications()
    ]);

    return (
        <div className="min-h-screen container py-10 space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-secondary">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage users and system settings.</p>
                </div>
            </div>

            <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
                {/* Notifications Section */}
                <div className="lg:col-span-1">
                    <NotificationList notifications={notifications} />
                </div>

                {/* User Management Section */}
                <div className="lg:col-span-2">
                    <UserTable initialUsers={users} />
                </div>
            </div>
        </div>
    );
}
