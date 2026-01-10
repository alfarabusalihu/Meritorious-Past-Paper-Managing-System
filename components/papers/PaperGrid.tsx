"use client";

import { Paper } from '@/types/paper';
import PaperCard from './PaperCard';

interface PaperGridProps {
    papers: Paper[];
    onPaperClick?: (paper: Paper) => void;
}

export default function PaperGrid({ papers }: PaperGridProps) {
    if (papers.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-muted-foreground">No papers found matching your criteria.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {papers.map((paper) => (
                <PaperCard
                    key={paper.paperId}
                    paper={paper}
                />
            ))}
        </div>
    );
}
