import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../lib/firebase'
import { usersApi } from '../../lib/firebase/users'
import { papersApi } from '../../lib/firebase/papers'
import { Paper } from '../../lib/firebase/schema'
import { PaperCard } from '../papers/PaperCard'
import { Button } from '../ui/Button'
import { Add, Person, Close } from '@mui/icons-material'
import { onAuthStateChanged } from 'firebase/auth'
import { HighAdminControls } from '../admin/HighAdminControls'
import { Dialog, IconButton, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { AuthForm } from '../auth/AuthForm'
import { ShieldCheck } from 'lucide-react'

export function AdminDashboard() {
    const navigate = useNavigate()
    const [papers, setPapers] = useState<Paper[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isSystemAdmin, setIsSystemAdmin] = useState(false)
    const [stats, setStats] = useState({ added: 0, edited: 0 })
    const [showHighAdmin, setShowHighAdmin] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [paperToDelete, setPaperToDelete] = useState<Paper | null>(null)

    useEffect(() => {
        // Initialize System Admin check on mount
        const checkSystemAdmin = () => {
            const sysAdmin = localStorage.getItem('isSystemAdmin') === 'true'
            setIsSystemAdmin(sysAdmin)
        }
        checkSystemAdmin()

        const unsubscribe = onAuthStateChanged(auth, async (u) => {

            if (!u) {
                // Check if manually bypassed via local storage (legacy) - but we want strict real auth now.
                // However, our AuthForm handles the transition. If strictly no user, go to auth.
                const sysAdmin = localStorage.getItem('isSystemAdmin') === 'true'
                if (!sysAdmin) {
                    setShowLogin(true)
                    setLoading(false)
                    return
                }
            } else {
                const role = await usersApi.getUserRole(u.uid)
                if (role !== 'admin') {
                    navigate('/')
                    return
                }
            }
            setIsAdmin(true)
            fetchAdminPapers()
        })
        return () => unsubscribe()
    }, [navigate])

    const fetchAdminPapers = async () => {
        setLoading(true)
        try {
            // Fetch all papers for now to filter client side for "My Contributions" or just show all
            // In a real app, we'd paginate or filter by uploader
            const allPapers = await papersApi.getPapers({})
            // Sort by Year Descending, then Title
            const sorted = allPapers.sort((a, b) => {
                if (b.year !== a.year) return b.year - a.year
                return a.title.localeCompare(b.title)
            })
            setPapers(sorted)
            setStats({
                added: sorted.length,
                edited: 0
            })
            setShowLogin(false) // Hide login if we successfully fetched papers (implies auth)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    if (showLogin) return (
        <div className="pt-32 pb-20">
            <AuthForm />
        </div>
    )

    if (!isAdmin && !loading) return null

    return (
        <div className="min-h-screen bg-muted/5 pb-20">
            {/* Admin Header */}
            <div className="bg-secondary text-secondary-foreground pt-32 pb-20 px-4 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-primary rounded-2xl text-primary-foreground shadow-xl shadow-primary/20">
                            <ShieldCheck size={40} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight mb-2">Admin Dashboard</h1>
                            <p className="text-secondary-foreground/60 font-medium">Manage papers, users, and system configurations.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <h3 className="text-3xl font-black">{stats.added}</h3>
                            <p className="text-xs uppercase tracking-widest opacity-60 font-bold">Papers</p>
                        </div>
                        <div className="h-12 w-px bg-white/10" />
                        <div className="text-center">
                            <h3 className="text-3xl font-black">{stats.edited}</h3>
                            <p className="text-xs uppercase tracking-widest opacity-60 font-bold">Edits</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20 space-y-12">
                {/* Actions */}
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                    <Button
                        onClick={() => navigate('/add-paper')}
                        className="h-20 px-8 rounded-3xl bg-white text-secondary hover:bg-slate-50 shadow-xl shadow-black/5 flex items-center gap-4 min-w-max transition-all hover:-translate-y-1"
                    >
                        <div className="p-2 bg-primary/10 text-primary rounded-xl">
                            <Add sx={{ fontSize: 24 }} />
                        </div>
                        <div className="text-left">
                            <span className="block font-black text-lg">Add New Paper</span>
                            <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Upload PDF</span>
                        </div>
                    </Button>

                    {isSystemAdmin && (
                        <Button
                            onClick={() => setShowHighAdmin(true)}
                            className="h-20 px-8 rounded-3xl bg-white text-secondary hover:bg-slate-50 shadow-xl shadow-black/5 flex items-center gap-4 min-w-max transition-all hover:-translate-y-1"
                        >
                            <div className="p-2 bg-secondary/10 text-secondary rounded-xl">
                                <Person sx={{ fontSize: 24 }} />
                            </div>
                            <div className="text-left">
                                <span className="block font-black text-lg">System Controls</span>
                                <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">High Admin</span>
                            </div>
                        </Button>
                    )}
                </div>

                <Dialog
                    open={showHighAdmin}
                    onClose={() => setShowHighAdmin(false)}
                    maxWidth="lg"
                    fullWidth
                    scroll="paper"
                    PaperProps={{
                        sx: {
                            borderRadius: '2rem',
                            overflow: 'hidden',
                            maxHeight: '90vh'
                        }
                    }}
                >
                    <IconButton
                        onClick={() => setShowHighAdmin(false)}
                        aria-label="Close"
                        sx={{
                            position: 'absolute',
                            right: 20,
                            top: 20,
                            zIndex: 1400,
                            bgcolor: 'white',
                            boxShadow: 3,
                            '&:hover': { bgcolor: 'hsl(var(--destructive))', color: 'white' }
                        }}
                    >
                        <Close />
                    </IconButton>
                    <HighAdminControls />
                </Dialog>

                {/* Content */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-secondary">
                            My Contributions
                        </h2>
                        <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-muted text-sm font-bold text-muted-foreground">
                            Sorted by: <span className="text-primary">Newest First</span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-64 bg-white/50 animate-pulse rounded-[2rem]" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {papers.map(paper => (
                                <div key={paper.id} className="relative group">
                                    <div className="relative z-0">
                                        <PaperCard paper={paper} />
                                    </div>
                                    {/* Admin Overlay Controls */}
                                    <div
                                        className="absolute inset-0 z-10 bg-secondary/80 backdrop-blur-sm rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4"
                                        style={{ willChange: 'opacity' }}
                                    >
                                        <Button
                                            onClick={() => navigate('/add-paper', { state: { paperToEdit: paper } })}
                                            className="font-black rounded-xl bg-white text-secondary hover:bg-slate-100"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setPaperToDelete(paper)
                                                setDeleteDialogOpen(true)
                                            }}
                                            className="font-black rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: '1.5rem',
                        padding: 2
                    }
                }}
            >
                <DialogTitle className="font-black text-secondary">
                    Delete Paper?
                </DialogTitle>
                <DialogContent>
                    <p className="text-muted-foreground font-medium">
                        Are you sure you want to delete <strong className="text-foreground">{paperToDelete?.title}</strong>? This action cannot be undone.
                    </p>
                </DialogContent>
                <DialogActions className="p-4 pt-0">
                    <Button
                        variant="ghost"
                        onClick={() => setDeleteDialogOpen(false)}
                        className="font-bold"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={async () => {
                            if (paperToDelete?.id) {
                                await papersApi.deletePaper(paperToDelete.id)
                                setPapers(papers.filter(p => p.id !== paperToDelete.id))
                                setStats(prev => ({ ...prev, added: prev.added - 1 }))
                            }
                            setDeleteDialogOpen(false)
                            setPaperToDelete(null)
                        }}
                        className="font-black bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
