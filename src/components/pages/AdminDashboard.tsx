import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { papersApi } from '../../lib/firebase/papers'
import { Paper } from '../../lib/firebase/schema'
import { Settings } from 'lucide-react'
import { AuthForm } from '../auth/AuthForm'
import { Modal } from '../ui/Modal'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { lazy, Suspense } from 'react'

const HighAdminControls = lazy(() => import('../admin/HighAdminControls').then(m => ({ default: m.HighAdminControls })))
const DeletePaperDialog = lazy(() => import('../admin/DeletePaperDialog').then(m => ({ default: m.DeletePaperDialog })))
import { PaperListView } from '../papers/PaperListView'
export function AdminDashboard() {
    const navigate = useNavigate()
    const { t } = useLanguage()
    const { user, isSuperAdmin, loading: authLoading } = useAuth()
    const [showHighAdmin, setShowHighAdmin] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [paperToDelete, setPaperToDelete] = useState<Paper | null>(null)

    const handleDeleteClick = (paper: Paper) => {
        setPaperToDelete(paper)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!paperToDelete?.id || !user?.uid) return
        try {
            await papersApi.deletePaper(paperToDelete.id)
            setDeleteDialogOpen(false)
            setPaperToDelete(null)
            // PaperListView will auto-refresh
        } catch (error) {
            console.error(error)
        }
    }

    const handleEditClick = (paper: Paper) => {
        navigate('/add-paper', { state: { paperToEdit: paper } })
    }

    if (authLoading) return null

    if (!user || !isSuperAdmin) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-background">
                <div className="max-w-md w-full">
                    <AuthForm />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pb-32">
            <div
                className="relative py-12 md:py-16 overflow-hidden bg-[#0A001F]"
            >
                {/* Radiant Background Mix - Not top-to-bottom */}
                <div className="absolute inset-0 overflow-hidden -z-10">
                    <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_30%_30%,#2D0066_0%,#13005A_40%,#000000_100%)] opacity-80" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[100%] h-[100%] bg-[radial-gradient(circle_at_70%_70%,#13005A_0%,#0A001F_50%,#000000_100%)] opacity-60" />
                </div>

                <div className="section-container relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                                {t('admin.dashboard.title')}
                            </h1>
                            <p className="text-white/60 font-medium">{t('admin.dashboard.subtitle')}</p>
                        </div>

                        <button
                            onClick={() => setShowHighAdmin(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-2xl font-bold backdrop-blur-md hover:bg-white/10 hover:scale-[1.02] transition-all shadow-lg"
                        >
                            <Settings className="h-5 w-5" />
                            <span>{t('admin.dashboard.systemConfig')}</span>
                        </button>
                    </div>
                </div>

                {/* Hard Edge transition to next component */}
                <div className="absolute bottom-0 left-0 w-full h-px bg-white/10" />
            </div>

            <div className="section-container mt-12 space-y-12">
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-secondary">{t('admin.dashboard.managedPapers')}</h2>
                        <div className="h-1 w-20 bg-primary/20 rounded-full" />
                    </div>

                    <PaperListView
                        isAdminMode={true}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                        showAddButton={true}
                        useClientSideFiltering={true}
                    />
                </div>

                <Modal
                    isOpen={showHighAdmin}
                    onClose={() => setShowHighAdmin(false)}
                    title={t('admin.controls.title')}
                    maxWidth="lg"
                >
                    <Suspense fallback={<div className="p-12 text-center text-muted-foreground">Loading system controls...</div>}>
                        <HighAdminControls />
                    </Suspense>
                </Modal>

                <Suspense fallback={null}>
                    <DeletePaperDialog
                        open={deleteDialogOpen}
                        paperTitle={paperToDelete?.title}
                        loading={false}
                        onClose={() => setDeleteDialogOpen(false)}
                        onConfirm={handleDeleteConfirm}
                    />
                </Suspense>
            </div>
        </div>
    )
}
