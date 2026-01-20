import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { Button } from '../ui/Button'
import { AlertTriangle } from 'lucide-react'

interface DeletePaperDialogProps {
    open: boolean;
    paperTitle?: string;
    loading: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function DeletePaperDialog({ open, paperTitle, loading, onClose, onConfirm }: DeletePaperDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { borderRadius: '2rem', p: 2 }
            }}
        >
            <DialogTitle sx={{ fontWeight: 900, display: 'flex', itemsCenter: 'center', gap: 2 }}>
                <div className="p-2 bg-destructive/10 text-destructive rounded-xl">
                    <AlertTriangle size={24} />
                </div>
                Confirm Deletion
            </DialogTitle>
            <DialogContent>
                <p className="text-muted-foreground font-medium">
                    Are you sure you want to delete <strong className="text-foreground">"{paperTitle}"</strong>?
                    This action is permanent and cannot be undone.
                </p>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 2 }}>
                <Button
                    variant="ghost"
                    onClick={onClose}
                    className="flex-1 font-bold rounded-xl"
                >
                    Cancel
                </Button>
                <Button
                    variant="danger"
                    onClick={onConfirm}
                    isLoading={loading}
                    className="flex-1 font-bold rounded-xl h-12"
                >
                    Delete Paper
                </Button>
            </DialogActions>
        </Dialog>
    )
}
