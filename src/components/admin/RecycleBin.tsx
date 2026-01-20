<<<<<<< HEAD
import { useEffect, useState } from 'react'
import { papersApi } from '../../lib/firebase/papers'
import { Paper } from '../../lib/firebase/schema'
import { Trash2, RotateCcw, AlertTriangle, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { useAuth } from '../../context/AuthContext'

export function RecycleBin() {
    const navigate = useNavigate()
    const { isSuperAdmin } = useAuth()
    const [deletedPapers, setDeletedPapers] = useState<Paper[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isSuperAdmin) {
            navigate('/')
            return
        }
        fetchDeletedPapers()
    }, [isSuperAdmin, navigate])

    const fetchDeletedPapers = async () => {
        setLoading(true)
        try {
            const papers = await papersApi.getDeletedPapers()
            setDeletedPapers(papers)
        } catch (error) {
            console.error('Failed to fetch deleted papers:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleRestore = async (id: string) => {
        if (!confirm('Are you sure you want to restore this paper?')) return
        try {
            await papersApi.restorePaper(id)
            setDeletedPapers(prev => prev.filter(p => p.id !== id))
        } catch (error) {
            console.error('Failed to restore paper:', error)
        }
    }

    const handlePermanentDelete = async (id: string) => {
        if (!confirm('WARNING: This will permanently delete the paper from the database. This action CANNOT be undone. Are you sure?')) return
        try {
            await papersApi.permanentDeletePaper(id)
            setDeletedPapers(prev => prev.filter(p => p.id !== id))
        } catch (error) {
            console.error('Failed to permanently delete paper:', error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen py-20 section-container">
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-muted/20 rounded-xl" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pb-32">
            <div className="bg-destructive/5 border-b border-destructive/10 py-8 md:py-12">
                <div className="section-container">
                    <div className="mb-6">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/admin')}
                            className="text-muted-foreground hover:text-foreground pl-0 gap-2"
                        >
                            <ArrowLeft size={16} />
                            Back to Dashboard
                        </Button>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl shadow-sm border border-destructive/10">
                            <Trash2 className="text-destructive h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-secondary">
                                Recycle Bin
                            </h1>
                            <p className="text-muted-foreground font-medium">Manage deleted papers. Restore or permanently remove them.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section-container mt-8">
                {deletedPapers.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-muted">
                        <Trash2 className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                        <h3 className="text-xl font-bold text-secondary">Recycle Bin is Empty</h3>
                        <p className="text-muted-foreground">No deleted papers found.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {deletedPapers.map((paper) => (
                            <div
                                key={paper.id}
                                className="bg-white p-6 rounded-2xl border border-muted shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-secondary line-clamp-1">{paper.title}</h3>
                                        <span className="px-2 py-0.5 rounded-lg bg-muted text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            {paper.subject}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                        Deleted by <span className="font-medium text-foreground">{paper.deletedBy || 'Unknown'}</span>
                                        <span className="text-muted-foreground/50">•</span>
                                        <span className="text-destructive font-medium">In Trash</span>
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <Button
                                        onClick={() => paper.id && handleRestore(paper.id)}
                                        className="flex-1 md:flex-none gap-2 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white border-emerald-200"
                                    >
                                        <RotateCcw size={18} />
                                        Restore
                                    </Button>
                                    <Button
                                        onClick={() => paper.id && handlePermanentDelete(paper.id)}
                                        className="flex-1 md:flex-none gap-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border-destructive/20"
                                    >
                                        <AlertTriangle size={18} />
                                        Delete Forever
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
=======
import { useEffect, useState } from 'react';
import { papersApi } from '../../lib/firebase/papers';
import { Paper } from '../../lib/firebase/schema';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { AlertTriangle, Trash2, RotateCcw } from 'lucide-react';

export function RecycleBin() {
    const [deletedPapers, setDeletedPapers] = useState<Paper[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);

    useEffect(() => {
        const fetchDeletedPapers = async () => {
            try {
                const papers = await papersApi.getDeletedPapers();
                setDeletedPapers(papers);
            } catch (err) {
                setError('Failed to fetch deleted papers.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDeletedPapers();
    }, []);

    const handleRestore = async (id: string) => {
        try {
            await papersApi.restorePaper(id);
            setDeletedPapers(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            setError('Failed to restore paper.');
            console.error(err);
        }
    };

    const handlePermanentDelete = async () => {
        if (!selectedPaper) return;

        try {
            await papersApi.permanentDeletePaper(selectedPaper.id);
            setDeletedPapers(prev => prev.filter(p => p.id !== selectedPaper.id));
            setDialogOpen(false);
            setSelectedPaper(null);
        } catch (err) {
            setError('Failed to permanently delete paper.');
            console.error(err);
        }
    };

    const openConfirmationDialog = (paper: Paper) => {
        setSelectedPaper(paper);
        setDialogOpen(true);
    };

    if (loading) {
        return <div className="text-center py-20">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-500">{error}</div>;
    }

    return (
        <div className="section-container py-12">
            <h1 className="text-4xl font-bold mb-8">Recycle Bin</h1>
            {deletedPapers.length === 0 ? (
                <p>The recycle bin is empty.</p>
            ) : (
                <div className="space-y-4">
                    {deletedPapers.map(paper => (
                        <div key={paper.id} className="p-4 border rounded-lg flex justify-between items-center">
                            <div>
                                <h2 className="font-bold">{paper.title}</h2>
                                <p className="text-sm text-muted-foreground">
                                    Deleted At: {paper.deletedAt?.toDate().toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => handleRestore(paper.id)}>
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Restore
                                </Button>
                                <Button variant="danger" onClick={() => openConfirmationDialog(paper)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Permanently Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                title="Confirm Permanent Deletion"
            >
                <div className="space-y-4">
                    <p>
                        Are you sure you want to permanently delete "{selectedPaper?.title}"? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button variant="danger" onClick={handlePermanentDelete}>Permanently Delete</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
>>>>>>> 3c4102b68afd1b5d7398d4527cefed125d09ad69
}
