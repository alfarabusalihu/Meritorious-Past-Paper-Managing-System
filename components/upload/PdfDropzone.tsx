"use client";

import { useState, useCallback } from 'react';
import { Upload, File, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/cn';
import { UI_CONSTANTS } from '@/constants/ui';

interface PdfDropzoneProps {
    onFileSelect: (file: File | null) => void;
    selectedFile: File | null;
}

export default function PdfDropzone({ onFileSelect, selectedFile }: PdfDropzoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateFile = (file: File) => {
        if (file.type !== 'application/pdf') {
            setError('Only PDF files are allowed');
            return false;
        }
        if (file.size > UI_CONSTANTS.MAX_FILE_SIZE_MB * 1024 * 1024) {
            setError(`File size must be less than ${UI_CONSTANTS.MAX_FILE_SIZE_MB}MB`);
            return false;
        }
        setError(null);
        return true;
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && validateFile(file)) {
            onFileSelect(file);
        }
    }, [onFileSelect]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && validateFile(file)) {
            onFileSelect(file);
        }
    };

    const removeFile = () => {
        onFileSelect(null);
        setError(null);
    };

    return (
        <div className="space-y-4">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "relative group border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center text-center space-y-4 cursor-pointer",
                    isDragging ? "border-primary bg-primary/5 scale-[0.99]" : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50",
                    selectedFile && "border-green-500 bg-green-50/10",
                    error && "border-destructive bg-destructive/5"
                )}
            >
                <input
                    type="file"
                    accept=".pdf"
                    className={cn(
                        "absolute inset-0 opacity-0 cursor-pointer",
                        selectedFile && "pointer-events-none"
                    )}
                    onChange={handleFileChange}
                />

                {selectedFile ? (
                    <div className="relative z-20 flex flex-col items-center space-y-4">
                        <div className="p-4 bg-green-500/10 rounded-full">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-bold text-lg">{selectedFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeFile();
                            }}
                            className="flex items-center gap-2 px-6 py-2.5 bg-destructive text-destructive-foreground rounded-full text-sm font-black uppercase tracking-widest shadow-lg hover:bg-destructive/90 hover:scale-105 active:scale-95 transition-all pointer-events-auto"
                        >
                            <X className="h-4 w-4" />
                            <span>Remove File</span>
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
                            <Upload className="h-10 w-10 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-bold text-lg">Click or drag PDF to upload</p>
                            <p className="text-sm text-muted-foreground">
                                Maximum file size: {UI_CONSTANTS.MAX_FILE_SIZE_MB}MB
                            </p>
                        </div>
                    </>
                )}

                {error && (
                    <div className="flex items-center gap-2 text-destructive text-sm font-medium">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
