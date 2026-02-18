import { Modal } from './Modal'
import { AlertCircle, HelpCircle, XCircle } from 'lucide-react'
import { Button } from './Button'

interface ConfirmationDialogProps {
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'primary' | 'warning';
    onClose: () => void;
    onConfirm: () => void;
}

export function ConfirmationDialog({
    isOpen,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'primary',
    onClose,
    onConfirm
}: ConfirmationDialogProps) {
    const Icon = variant === 'danger' ? XCircle : variant === 'warning' ? AlertCircle : HelpCircle;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            maxWidth="sm"
        >
            <div className={`p-6 space-y-6 ${variant === 'danger' ? 'bg-rose-50/30' : ''}`}>
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${variant === 'danger' ? 'bg-rose-100 text-rose-600' :
                        variant === 'warning' ? 'bg-amber-100 text-amber-600' :
                            'bg-primary/10 text-primary'
                        }`}>
                        <Icon size={24} />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-black text-lg text-secondary">{title}</h4>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="flex-1 h-12 rounded-xl font-bold border-muted-foreground/10"
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={variant === 'danger' ? 'danger' : 'primary'}
                        onClick={onConfirm}
                        className="flex-1 h-12 rounded-xl font-bold shadow-xl shadow-black/5"
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
