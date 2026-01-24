import { useState } from 'react'
import { Paper } from '../lib/firebase/schema'

interface UsePaperViewerReturn {
    selectedPaper: Paper | null
    selectedUrl: string | null
    handleViewPaper: (paper: Paper, url: string) => void
    handleClose: () => void
}

export function usePaperViewer(): UsePaperViewerReturn {
    const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)
    const [selectedUrl, setSelectedUrl] = useState<string | null>(null)

    const handleViewPaper = (paper: Paper, url: string) => {
        setSelectedPaper(paper)
        setSelectedUrl(url)
    }

    const handleClose = () => {
        setSelectedPaper(null)
        setSelectedUrl(null)
    }

    return {
        selectedPaper,
        selectedUrl,
        handleViewPaper,
        handleClose
    }
}
