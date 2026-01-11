"use client";

import { X, Download } from 'lucide-react';
import { Paper } from '@/types/paper';
import { useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface PdfModalProps {
    paper: Paper | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function PdfModal({ paper, isOpen, onClose }: PdfModalProps) {
    useEffect(() => {
        if (isOpen && paper) {
            fetch('/api/stats/increment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'downloads' }),
            }).catch(err => console.error('Failed to increment download count:', err));
        }
    }, [isOpen, paper]);

    if (!paper) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-7xl w-[95vw] h-[90vh] p-0 gap-0 overflow-hidden flex flex-col bg-background border-white/10 sm:rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
                {/* 
                   Radix Dialog requires a Title for accessibility. 
                   We use sr-only to hide it visually but keep it for screen readers.
                */}
                <DialogTitle className="sr-only">{paper.paperName}</DialogTitle>
                <DialogDescription className="sr-only">Preview of {paper.paperName} ({paper.year})</DialogDescription>


                {/* Custom Header */}
                <div className="flex items-center justify-between px-6 md:px-10 py-5 md:py-6 border-b bg-card/50 backdrop-blur shadow-sm shrink-0 z-10">
                    <div className="space-y-1">
                        <h3 className="font-extrabold text-xl md:text-2xl leading-none tracking-tight line-clamp-1">{paper.paperName}</h3>
                        <div className="flex items-center gap-2 text-sm font-bold text-primary italic">
                            <span>{paper.subject}</span>
                            <span className="opacity-30">•</span>
                            <span className="text-muted-foreground not-italic">{paper.year}</span>
                            <span className="opacity-30">•</span>
                            <span className="text-secondary/70 uppercase tracking-widest text-[10px] bg-secondary/5 px-2 py-0.5 rounded">{paper.category}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="p-2.5 hover:bg-destructive hover:text-destructive-foreground rounded-full transition-all duration-300"
                            title="Close"
                        >
                            <X className="h-6 w-6" />
                            <span className="sr-only">Close</span>
                        </button>
                    </div>
                </div>

                {/* Iframe content */}
                <div className="flex-grow bg-secondary/5 relative w-full h-full">
                    <iframe
                        src={paper.pdfUrl}
                        className="w-full h-full border-none shadow-inner"
                        title={`PDF Preview: ${paper.paperName}`}
                        loading="lazy"
                    />
                </div>

                {/* Footer Info */}
                <div className="px-10 py-3 bg-muted/30 border-t flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-widest shrink-0">
                    <span>MPPMS High Performance Viewer</span>
                    <div className="flex items-center gap-4">
                        <span>{paper.part}</span>
                        <span className="opacity-30">|</span>
                        <span>ID: {paper.paperId}</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

