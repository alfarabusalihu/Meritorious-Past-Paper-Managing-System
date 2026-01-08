"use client";

import { FileX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
    onReset: () => void;
}

export default function EmptyState({ onReset }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-6">
            <div className="p-6 bg-muted rounded-full">
                <FileX className="h-12 w-12 text-muted-foreground" />
            </div>

            <div className="space-y-2">
                <h3 className="text-2xl font-bold">No papers found</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                    We couldn't find any papers matching your current filter criteria.
                    Try adjusting the filters or resetting them.
                </p>
            </div>

            <button
                onClick={onReset}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors"
            >
                <RotateCcw className="h-4 w-4" />
                Reset Filters
            </button>
        </div>
    );
}
