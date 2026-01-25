import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { clsx } from 'clsx'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    showCloseButton?: boolean
    downloadUrl?: string
    downloadFileName?: string
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = 'md',
    showCloseButton = true,
    downloadUrl,
    downloadFileName
}: ModalProps) {
    const [isDownloading, setIsDownloading] = useState(false);

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

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!downloadUrl || isDownloading) return;

        setIsDownloading(true);
        try {
            // Force the browser to download the file instead of redirecting
            // This is achieved by fetching the file as a blob and triggering a local anchor click
            const response = await fetch(downloadUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = downloadFileName || 'paper.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Download failed:", error);
            // Fallback to open in new tab if blob method fails
            window.open(downloadUrl, '_blank');
        } finally {
            setIsDownloading(false);
        }
    };

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
                        {(title || showCloseButton || downloadUrl) && (
                            <div className="flex items-center justify-between p-6 border-b border-muted shrink-0">
                                {title && <h3 className="text-xl font-bold text-foreground truncate mr-4">{title}</h3>}
                                <div className="flex items-center gap-2">
                                    {downloadUrl && (
                                        <button
                                            onClick={handleDownload}
                                            disabled={isDownloading}
                                            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 lg:hidden disabled:opacity-70 disabled:cursor-not-allowed"
                                            title="Download File"
                                        >
                                            {isDownloading ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <Download size={16} />
                                            )}
                                            <span className="hidden sm:inline">
                                                {isDownloading ? 'Saving...' : 'Download'}
                                            </span>
                                        </button>
                                    )}
                                    {showCloseButton && (
                                        <button
                                            onClick={onClose}
                                            className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground"
                                        >
                                            <X size={20} />
                                        </button>
                                    )}
                                </div>
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
