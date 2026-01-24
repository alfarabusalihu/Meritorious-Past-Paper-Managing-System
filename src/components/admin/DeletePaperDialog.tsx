import { Modal } from '../ui/Modal'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { Button } from '../ui/Button'

interface DeletePaperDialogProps {
    open: boolean;
    paperTitle?: string;
    loading: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function DeletePaperDialog({ open, paperTitle, loading, onClose, onConfirm }: DeletePaperDialogProps) {
    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title="Delete Paper"
            maxWidth="sm"
        >
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4 p-4 bg-rose-50 rounded-2xl text-rose-800">
                    <div className="p-2 bg-rose-100 rounded-xl">
                        <AlertTriangle className="h-6 w-6 text-rose-600" />
                    </div>
                    <div>
                        <h4 className="font-bold">Confirm Deletion</h4>
                        <p className="text-sm opacity-80">This action cannot be undone.</p>
                    </div>
                </div>

                <p className="text-muted-foreground font-medium">
                    Are you sure you want to delete <span className="text-foreground font-bold">"{paperTitle}"</span>?
                </p>

                <div className="flex gap-4">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="flex-1 h-12 rounded-xl font-bold"
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={onConfirm}
                        className="flex-1 h-12 rounded-xl font-bold"
                        disabled={loading}
                    >
                        {loading ? 'Deleting...' : 'Delete Paper'}
                        {!loading && <Trash2 className="ml-2 h-4 w-4" />}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
