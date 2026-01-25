import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { clsx } from 'clsx'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    showCloseButton?: boolean
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = 'md',
    showCloseButton = true
}: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const maxWidthClasses = {
        sm: 'max-w-sm max-h-[90vh]',
        md: 'max-w-md max-h-[90vh]',
        lg: 'max-w-lg max-h-[90vh]',
        xl: 'max-w-5xl max-h-[90vh]',
        full: 'max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)] h-[calc(100vh-2rem)] sm:h-[calc(100vh-4rem)]'
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-secondary/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className={clsx(
                            "relative w-full bg-card rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col",
                            maxWidthClasses[maxWidth]
                        )}
                    >
                        {(title || showCloseButton) && (
                            <div className="flex items-center justify-between p-6 border-b border-muted shrink-0">
                                {title && <h3 className="text-xl font-bold text-foreground">{title}</h3>}
                                {showCloseButton && (
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                        )}
                        <div className={clsx("flex-1", maxWidth === 'full' ? "overflow-hidden flex flex-col" : "overflow-y-auto")}>
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
