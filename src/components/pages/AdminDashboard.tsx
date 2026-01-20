import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { papersApi } from '../../lib/firebase/papers'
import { Paper } from '../../lib/firebase/schema'
import { PaperCard } from '../papers/PaperCard'
import { FilterBar } from '../papers/FilterBar'
import { Pagination } from '../ui/Pagination'
import { Settings, X, BookOpen } from 'lucide-react'
import { AuthForm } from '../auth/AuthForm'
import { Dialog, DialogTitle, DialogContent, IconButton, useMediaQuery, useTheme } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { HighAdminControls } from '../admin/HighAdminControls'
import { AdminStats } from '../admin/AdminStats'
import { ContributorStats } from '../admin/ContributorStats'
import { DeletePaperDialog } from '../admin/DeletePaperDialog'

export function AdminDashboard() {
    const navigate = useNavigate()
    const { user, isAdmin, isSuperAdmin, loading: authLoading } = useAuth()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [allPapers, setAllPapers] = useState<Paper[]>([])
    const [filteredPapers, setFilteredPapers] = useState<Paper[]>([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({ added: 0, edited: 0 })
    const [showHighAdmin, setShowHighAdmin] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [paperToDelete, setPaperToDelete] = useState<Paper | null>(null)
    const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const [filters, setFilters] = useState({
        subject: '',
        year: '',
        examType: '',
        part: '',
        language: '',
        searchQuery: ''
    })

    useEffect(() => {
        if (!authLoading && user && isAdmin) {
            fetchAdminPapers()
        }
    }, [user, authLoading, isAdmin])

    const fetchAdminPapers = async () => {
        setLoading(true)
        try {
            const papers = await papersApi.getPapers()
            const sorted = papers.sort((a, b) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const dateA = (a.createdAt as any)?.toDate?.() || new Date(a.createdAt as any)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const dateB = (b.createdAt as any)?.toDate?.() || new Date(b.createdAt as any)
                return dateB - dateA
            })
            setAllPapers(sorted)
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

    // Apply filters locally for better performance since we have all papers
    useEffect(() => {
        let results = [...allPapers]

        if (filters.subject) results = results.filter(p => p.subject === filters.subject)
        if (filters.year) results = results.filter(p => p.year === parseInt(filters.year))
        if (filters.examType) results = results.filter(p => p.examType === filters.examType)
        if (filters.part) results = results.filter(p => p.part === filters.part)
        if (filters.language) results = results.filter(p => p.language === filters.language)
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase()
            results = results.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.subject.toLowerCase().includes(query)
            )
        }

        setFilteredPapers(results)
        setCurrentPage(1)
    }, [filters, allPapers])

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentPapers = filteredPapers.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredPapers.length / itemsPerPage)

    const handleDeleteConfirm = async () => {
        if (!paperToDelete?.id) return
        setLoading(true)
        try {
            await papersApi.deletePaper(paperToDelete.id, user?.uid || 'unknown')
            setAllPapers(prev => prev.filter(p => p.id !== paperToDelete.id))
            setStats(prev => ({ ...prev, added: prev.added - 1 }))
            setDeleteDialogOpen(false)
            setPaperToDelete(null)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    if (authLoading) return null

    if (!user || !isAdmin) {
        return (
            <div className="min-h-screen py-32 bg-background flex items-center justify-center">
                <div className="max-w-3xl w-full px-6">
                    <AuthForm />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pb-32">
            <div className="bg-white border-b border-muted py-8 md:py-12">
                <div className="section-container">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-secondary">
                                Control Center
                            </h1>
                            <p className="text-muted-foreground font-medium">Manage and organize your paper database.</p>
                        </div>
                    </div>

                    <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className={isAdmin && !isSuperAdmin ? "lg:col-span-2" : "lg:col-span-3"}>
                            <AdminStats
                                totalPapers={stats.added}
                                onManageSystem={() => setShowHighAdmin(true)}
                                onRecycleBin={() => navigate('/admin/trash')}
                                isSuperAdmin={isSuperAdmin}
                            />
                        </div>
                        {isAdmin && !isSuperAdmin && (
                            <div className="lg:col-span-1">
                                <ContributorStats />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="section-container mt-12 space-y-12">
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-secondary">Managed Papers</h2>
                        <div className="h-1 w-20 bg-primary/20 rounded-full" />
                    </div>

                    <FilterBar onFilterChange={setFilters} showAddButton={true} />

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-[400px] rounded-[2.5rem] bg-white border border-muted animate-pulse" />
                            ))}
                        </div>
                    ) : filteredPapers.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-muted">
                            <p className="text-muted-foreground font-bold">No papers found matching your filters.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {currentPapers.map((paper: Paper) => (
                                    <PaperCard
                                        key={paper.id}
                                        paper={paper}
                                        isAdmin
                                        onView={(p) => setSelectedPaper(p)}
                                        onEdit={() => navigate('/add-paper', { state: { paperToEdit: paper } })}
                                        onDelete={(p: Paper) => {
                                            setPaperToDelete(p)
                                            setDeleteDialogOpen(true)
                                        }}
                                    />
                                ))}
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    )}
                </div>

                {/* System Controls Dialog */}
                <Dialog
                    open={showHighAdmin}
                    onClose={() => setShowHighAdmin(false)}
                    maxWidth="md"
                    fullWidth
                    fullScreen={isMobile}
                    PaperProps={{
                        sx: {
                            borderRadius: isMobile ? 0 : '2.5rem',
                            overflow: 'hidden',
                            m: isMobile ? 0 : 2
                        }
                    }}
                >
                    <DialogTitle sx={{ p: 0 }}>
                        <div className="p-4 sm:p-6 bg-secondary text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Settings className="animate-pulse-slow w-5 h-5 sm:w-6 sm:h-6" />
                                <span className="font-bold text-lg sm:text-xl">System Controls {isSuperAdmin ? '(Owner)' : '(Admin)'}</span>
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
                <DeletePaperDialog
                    open={deleteDialogOpen}
                    paperTitle={paperToDelete?.title}
                    loading={loading}
                    onClose={() => setDeleteDialogOpen(false)}
                    onConfirm={handleDeleteConfirm}
                />

                {/* PDF Viewer Dialog */}
                <Dialog
                    open={!!selectedPaper}
                    onClose={() => setSelectedPaper(null)}
                    maxWidth="lg"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: '2rem',
                            bgcolor: 'var(--color-card)',
                            boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)'
                        }
                    }}
                >
                    <DialogTitle sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 3,
                        pb: 1,
                        fontWeight: 700
                    }}>
                        <span className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            Viewing: {selectedPaper?.title}
                        </span>
                        <IconButton
                            onClick={() => setSelectedPaper(null)}
                            size="small"
                        >
                            <X size={20} />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ p: '0 24px 24px 24px', height: '80vh' }}>
                        {selectedPaper && (
                            <iframe
                                src={selectedPaper.fileUrl}
                                className="h-full w-full rounded-2xl border border-muted shadow-inner"
                                title="PDF Viewer"
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
