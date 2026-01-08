"use client";

import { Paper } from '@/types/paper';
import { useState, useEffect } from 'react';
import PdfModal from '@/components/modal/PdfModal';
import { useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

interface ClientPageActionsProps {
    papers: Paper[];
}

export default function ClientPageActions({ papers }: ClientPageActionsProps) {
    const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    // Support opening modal via URL
    useEffect(() => {
        const viewId = searchParams.get('view');
        if (viewId) {
            const paper = papers.find(p => p.paperId === viewId);
            if (paper) {
                setSelectedPaper(paper);
            }
        } else {
            setSelectedPaper(null);
        }
    }, [searchParams, papers]);

    const handleClose = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('view');
        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        <PdfModal
            paper={selectedPaper}
            isOpen={!!selectedPaper}
            onClose={handleClose}
        />
    );
}
