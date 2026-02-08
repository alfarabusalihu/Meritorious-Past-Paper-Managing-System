import { useState } from 'react'
import { Paper } from '../lib/firebase/schema'
import { papersApi } from '../lib/firebase/papers'
import { useAuth } from '../context/AuthContext'

interface UsePaperViewerReturn {
    selectedPaper: Paper | null
    selectedUrl: string | null
    handleViewPaper: (paper: Paper, url: string) => void
    handleClose: () => void
}

export function usePaperViewer(): UsePaperViewerReturn {
    const { user } = useAuth()
    const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)
    const [selectedUrl, setSelectedUrl] = useState<string | null>(null)

    const handleViewPaper = (paper: Paper, url: string) => {
        setSelectedPaper(paper)
        setSelectedUrl(url)

        // Increment download count if user is present
        if (user?.uid && paper.id) {
            papersApi.incrementDownloadCount(paper.id, user.uid)
        }
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
