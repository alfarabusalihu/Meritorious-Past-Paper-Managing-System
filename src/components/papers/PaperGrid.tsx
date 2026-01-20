import { useState, useEffect } from 'react'
import { papersApi } from '../../lib/firebase/papers'
import { Paper } from '../../lib/firebase/schema'
import { PaperCard } from './PaperCard'
import { FilterBar } from './FilterBar'
import { useLanguage } from '../../context/LanguageContext'
import { BookOpen, X, Download } from 'lucide-react'
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material'

export function PaperGrid() {
    const { t } = useLanguage()
    const [papers, setPapers] = useState<Paper[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)
    const [filters, setFilters] = useState({
        subject: '',
        year: '',
        examType: '',
        part: '',
        language: '',
        searchQuery: ''
    })

    const fetchPapers = async () => {
        setLoading(true)
        try {
            const data = await papersApi.getPapers({
                subject: filters.subject,
                year: filters.year ? parseInt(filters.year) : undefined,
                examType: filters.examType,
                part: filters.part,
                language: filters.language,
                searchQuery: filters.searchQuery
            })
            setPapers(data)
        } catch (error) {
            console.error('Failed to fetch papers:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPapers()
    }, [filters])

    return (
        <div className="space-y-12">
            <FilterBar onFilterChange={setFilters} />

            {loading ? (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-[400px] animate-pulse rounded-[2.5rem] bg-muted/50" />
                    ))}
                </div>
            ) : papers.length > 0 ? (
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {papers.map((paper) => (
                        <PaperCard
                            key={paper.id}
                            paper={paper}
                            onView={(p) => setSelectedPaper(p)}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 bg-muted/10 rounded-3xl border-2 border-dashed border-muted/30">
                    <div className="p-4 bg-muted rounded-full">
                        <BookOpen className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-secondary-foreground">{t('papers.empty.title')}</h3>
                        <p className="text-muted-foreground font-medium max-w-sm mx-auto">{t('papers.empty.description')}</p>
                    </div>
                </div>
            )}


            <Dialog
                open={!!selectedPaper}
                onClose={() => setSelectedPaper(null)}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '2rem',
                        bgcolor: 'var(--color-card)',
                        backgroundImage: 'none',
                        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)'
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 3,
                    pb: 1,
                    fontFamily: 'inherit',
                    fontWeight: 700,
                    color: 'var(--color-secondary)'
                }}>
                    <span className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        {selectedPaper?.title}
                    </span>
                    <div className="flex items-center gap-3">
                        {selectedPaper && (
                            <a
                                href={selectedPaper.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                            >
                                <Download size={16} />
                                Download PDF
                            </a>
                        )}
                        <IconButton
                            onClick={() => setSelectedPaper(null)}
                            size="small"
                            sx={{
                                color: 'var(--color-muted-foreground)',
                                bgcolor: 'var(--color-muted)',
                                p: 1,
                                borderRadius: '12px',
                                '&:hover': { bgcolor: 'var(--color-destructive)', color: 'white' }
                            }}
                        >
                            <X size={20} />
                        </IconButton>
                    </div>
                </DialogTitle>
                <DialogContent sx={{ p: '0 24px 24px 24px', height: '80vh' }}>
                    {selectedPaper && (
                        <iframe
                            src={selectedPaper.fileUrl}
                            className="h-full w-full rounded-2xl border border-muted shadow-inner"
                            title="PDF Viewer"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
