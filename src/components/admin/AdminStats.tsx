import { ShieldCheck, Plus, Settings, Trash2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { useNavigate } from 'react-router-dom'

interface AdminStatsProps {
    totalPapers: number;
    onManageSystem: () => void;
    onAddPaper: () => void;
    isSuperAdmin?: boolean;
}

export function AdminStats({ totalPapers, onManageSystem, onAddPaper, isSuperAdmin }: AdminStatsProps) {
    const navigate = useNavigate();
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="col-span-1 sm:col-span-2 bg-gradient-to-br from-secondary to-secondary/90 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-secondary/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/10 transition-colors duration-700" />
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                            <ShieldCheck className="text-primary w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold tracking-tight">System Status</h2>
                    </div>
                    <div>
                        <p className="text-4xl font-black">{totalPapers}</p>
                        <p className="text-sm font-bold uppercase tracking-widest text-primary/80">Total Papers Indexed</p>
                    </div>
                    <div className="flex flex-wrap gap-3 pt-2">
                        <Button
                            onClick={onAddPaper}
                            className="bg-white text-secondary hover:bg-white/90 font-bold rounded-xl px-6"
                        >
                            <Plus size={18} className="mr-2" />
                            Add New
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={onManageSystem}
                            className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold rounded-xl px-6"
                        >
                            <Settings size={18} className="mr-2" />
                            System
                        </Button>
                        {isSuperAdmin && (
                            <Button
                                variant="secondary"
                                onClick={() => navigate('/admin/trash')}
                                className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold rounded-xl px-6"
                            >
                                <Trash2 size={18} className="mr-2" />
                                Recycle Bin
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-muted shadow-xl shadow-muted/20 flex flex-col justify-center gap-2 group hover:border-primary/30 transition-all duration-500">
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Admin Mode</p>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-2xl font-black text-secondary">Active</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-muted shadow-xl shadow-muted/20 flex flex-col justify-center gap-2 group hover:border-primary/30 transition-all duration-500">
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Data Health</p>
                <p className="text-2xl font-black text-secondary">Optimum</p>
            </div>
        </div>
    )
}
