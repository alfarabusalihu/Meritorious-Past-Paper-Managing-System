import { ShieldAlert } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface NotificationListProps {
    notifications: any[];
}

export default function NotificationList({ notifications }: NotificationListProps) {
    return (
        <div className="bg-card border rounded-xl shadow-sm p-6 space-y-6 max-h-[600px] overflow-y-auto">
            <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Notifications</h2>
            </div>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <p className="text-muted-foreground text-sm italic">No recent notifications.</p>
                ) : (
                    notifications.map((notif) => (
                        <div key={notif.id} className="p-4 rounded-xl bg-muted/30 border space-y-2">
                            <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${notif.type === 'PAPER_ADDED' ? 'bg-green-100 text-green-700' :
                                    notif.type === 'PAPER_DELETED' ? 'bg-red-100 text-red-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                    {notif.type.replace('PAPER_', '')}
                                </span>
                                <span className="text-xs text-muted-foreground">{formatDate(notif.created_at)}</span>
                            </div>
                            <p className="text-sm font-medium leading-relaxed">
                                {notif.message}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
