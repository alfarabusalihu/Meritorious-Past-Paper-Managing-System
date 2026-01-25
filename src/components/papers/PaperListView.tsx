import { useState, useEffect } from 'react'
import { papersApi } from '../../lib/firebase/papers'
import { Paper } from '../../lib/firebase/schema'
import { PaperCard } from './PaperCard'
import { FilterBar } from './FilterBar'
import { Pagination } from '../ui/Pagination'
import { usePaperPagination } from '../../hooks/usePaperPagination'
import { usePaperViewer } from '../../hooks/usePaperViewer'
import { useLanguage } from '../../context/LanguageContext'
import { BookOpen } from 'lucide-react'
import { Modal } from '../ui/Modal'

interface PaperListViewProps {
    isAdminMode?: boolean
    onEdit?: (paper: Paper) => void
    onDelete?: (paper: Paper) => void
    showAddButton?: boolean
    useClientSideFiltering?: boolean
    initialPapers?: Paper[]
}

export function PaperListView({
    isAdminMode = false,
    onEdit,
    onDelete,
    showAddButton = false,
    useClientSideFiltering = false,
    initialPapers = []
}: PaperListViewProps) {
    const { t } = useLanguage()
    const [allPapers, setAllPapers] = useState<Paper[]>(initialPapers)
    const [filteredPapers, setFilteredPapers] = useState<Paper[]>(initialPapers)
    const [loading, setLoading] = useState(true)

    const [filters, setFilters] = useState({
        subject: '',
        year: '',
        language: '',
        searchQuery: ''
    })

    const { selectedPaper, selectedUrl, handleViewPaper, handleClose } = usePaperViewer()

    // Fetch papers from API
    useEffect(() => {
        const fetchPapers = async () => {
            setLoading(true)
            try {
                if (useClientSideFiltering) {
                    // Admin mode: fetch all papers, then filter client-side
                    const fetchedPapers = await papersApi.getPapers()
                    const sorted = fetchedPapers.sort((a, b) => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const dateA = (a.createdAt as any)?.toDate?.() || new Date(a.createdAt as any)
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const dateB = (b.createdAt as any)?.toDate?.() || new Date(b.createdAt as any)
                        return dateB - dateA
                    })
                    setAllPapers(sorted)
                } else {
                    // Public mode: fetch with server-side filtering
                    const fetchedPapers = await papersApi.getPapers({
                        ...filters,
                        year: filters.year ? parseInt(filters.year) : undefined
                    })
                    setFilteredPapers(fetchedPapers)
                }
            } catch (error) {
                console.error('Failed to fetch papers:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchPapers()
    }, [useClientSideFiltering, ...(!useClientSideFiltering ? [filters] : [])])

    // Client-side filtering for admin mode
    useEffect(() => {
        if (useClientSideFiltering) {
            let results = [...allPapers]

            if (filters.subject) results = results.filter(p => p.subject === filters.subject)
            if (filters.year) results = results.filter(p => p.year === parseInt(filters.year))
            if (filters.language) results = results.filter(p => p.language === filters.language)
            if (filters.searchQuery) {
                const query = filters.searchQuery.toLowerCase()
                results = results.filter(p =>
                    p.title.toLowerCase().includes(query) ||
                    p.subject.toLowerCase().includes(query)
                )
            }

            setFilteredPapers(results)
        }
    }, [filters, allPapers, useClientSideFiltering])

    // Pagination
    const papersToDisplay = useClientSideFiltering ? filteredPapers : filteredPapers
    const { currentPage, setCurrentPage, currentItems, totalPages } = usePaperPagination({
        items: papersToDisplay,
        itemsPerPage: 10,
        resetTriggers: [filters]
    })

    return (
        <div className="space-y-12">
            <FilterBar onFilterChange={setFilters} showAddButton={showAddButton} />

            {loading ? (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-[400px] animate-pulse rounded-[2.5rem] bg-muted/50" />
                    ))}
                </div>
            ) : currentItems.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                        {currentItems.map((paper) => (
                            <PaperCard
                                key={paper.id}
                                paper={paper}
                                onView={handleViewPaper}
                                isSuperAdmin={isAdminMode}
                                onEdit={isAdminMode ? () => onEdit?.(paper) : undefined}
                                onDelete={isAdminMode ? () => onDelete?.(paper) : undefined}
                            />
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 bg-muted/10 rounded-3xl border-2 border-dashed border-muted/30">
                    <div className="p-4 bg-muted rounded-full">
                        <BookOpen className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-secondary-foreground">
                            {isAdminMode ? t('papers.empty.description') : t('papers.empty.title')}
                        </h3>
                        {!isAdminMode && (
                            <p className="text-muted-foreground font-medium max-w-sm mx-auto">
                                {t('papers.empty.description')}
                            </p>
                        )}
                    </div>
                </div>
            )}

            <Modal
                isOpen={!!selectedPaper && !!selectedUrl}
                onClose={handleClose}
                title={selectedPaper?.title}
                maxWidth="full"
                downloadUrl={selectedUrl || undefined}
                downloadFileName={`${selectedPaper?.title || 'paper'}.pdf`}
            >
                <div className="flex-1 w-full bg-muted/20 flex flex-col overflow-hidden">
                    {selectedUrl && (
                        <iframe
                            src={
                                typeof window !== 'undefined' && window.innerWidth < 1024
                                    ? `https://docs.google.com/viewer?url=${encodeURIComponent(selectedUrl)}&embedded=true`
                                    : selectedUrl
                            }
                            className="w-full h-full border-none shadow-inner"
                            title="PDF Viewer"
                            allow="autoplay"
                        />
                    )}
                </div>
            </Modal>
        </div>
    )
}
