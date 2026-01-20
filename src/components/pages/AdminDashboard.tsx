import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { papersApi } from '../../lib/firebase/papers'
import { Paper } from '../../lib/firebase/schema'
import { PaperCard } from '../papers/PaperCard'
import { Button } from '../ui/Button'
import { ShieldCheck, Plus, Settings, X } from 'lucide-react'
import { AuthForm } from '../auth/AuthForm'
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { HighAdminControls } from '../admin/HighAdminControls'

export function AdminDashboard() {
    const navigate = useNavigate()
    const { user, isAdmin, isSuperAdmin, loading: authLoading } = useAuth()
    const [papers, setPapers] = useState<Paper[]>([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({ added: 0, edited: 0 })
    const [showHighAdmin, setShowHighAdmin] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [paperToDelete, setPaperToDelete] = useState<Paper | null>(null)

    useEffect(() => {
        if (!authLoading && user && isAdmin) {
            fetchAdminPapers()
        }
    }, [user, authLoading, isAdmin])

    const fetchAdminPapers = async () => {
        setLoading(true)
        try {
            const allPapers = await papersApi.getPapers()
            const sorted = allPapers.sort((a, b) => {
                const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt)
                const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt)
                return dateB - dateA
            })
            setPapers(sorted)
            setStats({
                added: sorted.length,
                edited: 0
            })
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteConfirm = async () => {
        if (!paperToDelete?.id) return
        setLoading(true)
        try {
            await papersApi.deletePaper(paperToDelete.id)
            setPapers(prev => prev.filter(p => p.id !== paperToDelete.id))
            setStats(prev => ({ ...prev, added: prev.added - 1 }))
            setDeleteDialogOpen(false)
            setPaperToDelete(null)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    if (authLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
    )

    if (!user) return (
        <div className="pb-20">
            <AuthForm />
        </div>
    )

    if (!isAdmin) return (
        <div className="min-h-screen flex items-center justify-center bg-muted/5">
            <div className="max-w-md w-full mx-4 p-8 bg-white rounded-[2.5rem] border border-muted shadow-2xl text-center space-y-6">
                <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
                    <ShieldCheck size={40} />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-secondary">Access Denied</h1>
                    <p className="text-muted-foreground font-medium">
                        You do not have administrative privileges to access this portal.
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/')}
                    variant="secondary"
                    className="w-full h-14 rounded-2xl font-bold"
                >
                    Back to Public Site
                </Button>
            </div>
        </div>
    )
    return (
        <div className="min-h-screen bg-muted/5 pb-20">
            {/* Admin Header */}
            <div className="bg-white border-b border-muted page-header-padding pb-8 md:pb-12">
                <div className="section-container">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
                        <div className="space-y-3 md:space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-primary/10 text-primary rounded-2xl">
                                <ShieldCheck size={16} className="md:w-[18px] md:h-[18px]" />
                                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Administrative Portal</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-secondary">
                                Control Center
                            </h1>
                        </div>

                        {/* Stats mini cards */}
                        <div className="flex gap-4">
                            <div className="px-4 py-3 md:px-6 md:py-4 bg-muted/30 rounded-2xl md:rounded-3xl border border-muted min-w-[120px] md:min-w-[140px]">
                                <span className="block text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Papers</span>
                                <span className="text-xl md:text-2xl font-bold text-secondary">{stats.added}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section-container mt-12">
                <div className="flex flex-wrap items-center gap-6 mb-12">
                    <Button
                        onClick={() => navigate('/add-paper')}
                        className="h-20 px-8 rounded-3xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20 flex items-center gap-4 group transition-all hover:-translate-y-1"
                    >
                        <div className="p-2 bg-white/20 rounded-xl group-hover:rotate-90 transition-transform">
                            <Plus size={28} />
                        </div>
                        <div className="text-left">
                            <span className="block font-bold text-lg">Upload New Paper</span>
                            <span className="block text-xs font-semibold opacity-70 uppercase tracking-wider">Expand the library</span>
                        </div>
                    </Button>

                    {isSuperAdmin && (
                        <Button
                            onClick={() => setShowHighAdmin(true)}
                            className="h-20 px-8 rounded-3xl bg-secondary text-secondary-foreground shadow-2xl flex items-center gap-4 group transition-all hover:-translate-y-1"
                        >
                            <div className="p-2 bg-white/10 rounded-xl group-hover:rotate-180 transition-transform duration-500">
                                <Settings size={28} />
                            </div>
                            <div className="text-left">
                                <span className="block font-bold text-lg">System Controls</span>
                                <span className="block text-xs font-semibold opacity-70 uppercase tracking-wider">Manage settings</span>
                            </div>
                        </Button>
                    )}
                </div>

                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-secondary">Managed Papers</h2>
                        <div className="h-1 w-20 bg-primary/20 rounded-full" />
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-[400px] rounded-[2.5rem] bg-white border border-muted animate-pulse" />
                            ))}
                        </div>
                    ) : papers.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-muted">
                            <p className="text-muted-foreground font-bold">No papers found in the database.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {papers.map((paper: Paper) => (
                                <PaperCard
                                    key={paper.id}
                                    paper={paper}
                                    isAdmin
                                    onEdit={() => navigate('/add-paper', { state: { paperToEdit: paper } })}
                                    onDelete={(p: Paper) => {
                                        setPaperToDelete(p)
                                        setDeleteDialogOpen(true)
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* System Controls Dialog */}
                <Dialog
                    open={showHighAdmin}
                    onClose={() => setShowHighAdmin(false)}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        sx: { borderRadius: '2.5rem', overflow: 'hidden' }
                    }}
                >
                    <DialogTitle sx={{ p: 0 }}>
                        <div className="p-6 bg-secondary text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Settings className="animate-pulse-slow" />
                                <span className="font-bold text-xl">System Controls</span>
                            </div>
                            <IconButton onClick={() => setShowHighAdmin(false)} sx={{ color: 'white' }}>
                                <X />
                            </IconButton>
                        </div>
                    </DialogTitle>
                    <DialogContent sx={{ p: 0 }}>
                        <HighAdminControls />
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation */}
                <Dialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                    PaperProps={{
                        sx: { borderRadius: '2rem', p: 1 }
                    }}
                >
                    <DialogTitle className="font-bold text-2xl pt-6 px-6">Confirm Deletion</DialogTitle>
                    <DialogContent className="px-6">
                        <p className="text-muted-foreground font-medium">
                            Are you sure you want to delete <strong className="text-foreground">{paperToDelete?.title}</strong>? This action cannot be undone.
                        </p>
                    </DialogContent>
                    <DialogActions className="p-6 pt-0">
                        <Button
                            variant="ghost"
                            onClick={() => setDeleteDialogOpen(false)}
                            className="font-bold"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteConfirm}
                            className="bg-destructive hover:bg-destructive/90 text-white font-bold px-8 rounded-xl shadow-lg shadow-destructive/20"
                            isLoading={loading}
                        >
                            Delete Permanently
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

        </div>
    )
}
