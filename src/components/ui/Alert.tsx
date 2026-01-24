import { clsx } from 'clsx'
import { AlertCircle, CheckCircle2, Info, XCircle, X } from 'lucide-react'

interface AlertProps {
    severity?: 'success' | 'error' | 'info' | 'warning'
    children: React.ReactNode
    onClose?: () => void
    className?: string
}

export function Alert({ severity = 'info', children, onClose, className }: AlertProps) {
    const styles = {
        success: "bg-emerald-50 text-emerald-800 border-emerald-100",
        error: "bg-rose-50 text-rose-800 border-rose-100",
        info: "bg-blue-50 text-blue-800 border-blue-100",
        warning: "bg-amber-50 text-amber-800 border-amber-100"
    }

    const icons = {
        success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
        error: <XCircle className="h-5 w-5 text-rose-500" />,
        info: <Info className="h-5 w-5 text-blue-500" />,
        warning: <AlertCircle className="h-5 w-5 text-amber-500" />
    }

    return (
        <div className={clsx(
            "flex items-start gap-3 p-4 rounded-2xl border font-medium text-sm",
            styles[severity],
            className
        )}>
            <div className="shrink-0 mt-0.5">
                {icons[severity]}
            </div>
            <div className="flex-1">
                {children}
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="shrink-0 p-1 hover:bg-black/5 rounded-lg transition-colors"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    )
}
