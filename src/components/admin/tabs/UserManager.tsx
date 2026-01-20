import { UserProfile } from '../../../lib/firebase/schema'
import { usersApi } from '../../../lib/firebase/users'
import { Button } from '../../ui/Button'
import { Shield, People, SwapHoriz, LockOpen, Lock } from '@mui/icons-material'

interface UserManagerProps {
    users: UserProfile[];
    currentUserUid: string;
    onUserUpdate: (uid: string, blocked: boolean) => void;
    onTransferOwnership: (targetUid: string) => void;
}

export function UserManager({ users, currentUserUid, onUserUpdate, onTransferOwnership }: UserManagerProps) {
    const handleToggleBlock = async (uid: string, blocked: boolean) => {
        await usersApi.toggleBlockUser(uid, blocked)
        onUserUpdate(uid, blocked)
    }

    return (
        <div className="space-y-4 pb-8">
            <h3 className="text-xl font-bold text-secondary mb-4">Registered Users</h3>
            <div className="grid gap-4">
                {users.map(user => (
                    <div key={user.uid} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-muted/30 border border-muted gap-4">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full flex-shrink-0 ${user.role === 'admin' ? 'bg-primary/20 text-primary' : user.role === 'super-admin' ? 'bg-secondary/20 text-secondary' : 'bg-muted text-muted-foreground'}`}>
                                {user.role === 'admin' || user.role === 'super-admin' ? <Shield /> : <People />}
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-foreground truncate">{user.displayName || 'Unknown User'}</p>
                                <p className="text-xs font-medium text-muted-foreground truncate">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0">
                            <div className="flex items-center gap-2">
                                {user.role !== 'super-admin' && (
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => onTransferOwnership(user.uid)}
                                        className="border-primary text-primary hover:bg-primary/10 h-9"
                                        title="Make Super Admin"
                                    >
                                        <SwapHoriz sx={{ fontSize: 16 }} />
                                    </Button>
                                )}
                                {user.role === 'user' && (
                                    <Button
                                        size="sm"
                                        onClick={() => handleToggleBlock(user.uid, !user.blocked)}
                                        className={`h-9 ${user.blocked ? "bg-green-500 hover:bg-green-600" : "bg-destructive hover:bg-destructive/90"}`}
                                    >
                                        {user.blocked ? <LockOpen sx={{ fontSize: 16, marginRight: 1 }} /> : <Lock sx={{ fontSize: 16, marginRight: 1 }} />}
                                        {user.blocked ? 'Unblock' : 'Block'}
                                    </Button>
                                )}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg ${user.role === 'super-admin' ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'
                                }`}>
                                {user.role}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
