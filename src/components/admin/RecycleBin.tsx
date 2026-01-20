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
}
