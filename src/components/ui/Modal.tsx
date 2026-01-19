import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    className?: string
}

export const Modal = ({ isOpen, onClose, title, children, className }: ModalProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return

        if (isOpen) {
            if (!dialog.open) dialog.showModal()
        } else {
            if (dialog.open) dialog.close()
        }
    }, [isOpen])

    // Handle escape key and backdrop click
    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return

        const handleCancel = (e: Event) => {
            e.preventDefault()
            onClose()
        }

        const handleClick = (e: MouseEvent) => {
            const rect = dialog.getBoundingClientRect()
            if (
                e.clientX < rect.left ||
                e.clientX > rect.right ||
                e.clientY < rect.top ||
                e.clientY > rect.bottom
            ) {
                onClose()
            }
        }

        dialog.addEventListener('cancel', handleCancel)
        dialog.addEventListener('click', handleClick)
        return () => {
            dialog.removeEventListener('cancel', handleCancel)
            dialog.removeEventListener('click', handleClick)
        }
    }, [onClose])

    return (
        <dialog
            ref={dialogRef}
            className={cn(
                "fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm transition-all duration-300 pointer-events-none group-data-[open]:pointer-events-auto",
                className
            )}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-card w-full max-w-5xl max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden border border-muted relative group-data-[open]:animate-in group-data-[open]:zoom-in-95 group-data-[open]:duration-300">
                <div className="flex items-center justify-between p-4 border-b border-muted">
                    {title && <h3 className="text-lg font-black text-foreground px-2">{title}</h3>}
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">{children}</div>
            </div>
        </dialog>
    )
}
