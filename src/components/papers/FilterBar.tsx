import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { X, ChevronDown, Plus } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { useFilters } from '../../context/FilterContext'

interface FilterBarProps {
    onFilterChange: (filters: { searchQuery: string, subject: string, year: string, language: string }) => void
    showAddButton?: boolean
}

export function FilterBar({ onFilterChange, showAddButton = false }: FilterBarProps) {
    const { t } = useLanguage()
    const { filters } = useFilters()
    const [subject, setSubject] = useState('')
    const [year, setYear] = useState('')
    const [language, setLanguage] = useState('')

    // Real-time filtering
    useEffect(() => {
        onFilterChange({ searchQuery: '', subject, year, language })
    }, [subject, year, language, onFilterChange])

    const resetFilters = () => {
        setSubject('')
        setYear('')
        setLanguage('')
    }

    return (
        <div className="w-full space-y-6 mt-6">
            {showAddButton && (
                <div className="flex justify-end">
                    <Link
                        to="/add-paper"
                        className="flex items-center gap-2 px-6 h-14 bg-primary text-primary-foreground rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
                    >
                        <Plus size={18} />
                        Add Paper
                    </Link>
                </div>
            )}

            <div className="bg-card border border-muted rounded-[2rem] p-6 lg:p-8 shadow-xl shadow-black/5">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 w-full">
                        {/* Subject Filter */}
                        <div className="relative group">
                            <select
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full h-10 pl-4 pr-10 bg-background border border-input rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-bold text-xs sm:text-sm appearance-none cursor-pointer truncate"
                            >
                                <option value="">{t('filters.placeholders.subject')}</option>
                                {(filters?.subjects || []).slice().sort().map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none group-focus-within:rotate-180 transition-transform" />
                        </div>

                        {/* Year Filter */}
                        <div className="relative group">
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="w-full h-10 pl-4 pr-10 bg-background border border-input rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-bold text-xs sm:text-sm appearance-none cursor-pointer truncate"
                            >
                                <option value="">{t('filters.placeholders.year')}</option>
                                {(filters?.years || []).slice().sort((a, b) => parseInt(b) - parseInt(a)).map((y) => (
                                    <option key={y} value={y} className="truncate">
                                        {y}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none group-focus-within:rotate-180 transition-transform" />
                        </div>

                        {/* Language Filter */}
                        <div className="relative group">
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full h-10 pl-4 pr-10 bg-background border border-input rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-bold text-xs sm:text-sm appearance-none cursor-pointer truncate"
                            >
                                <option value="">Languages</option>
                                {(filters?.languages || []).map(l => (
                                    <option key={l} value={l}>{l}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none group-focus-within:rotate-180 transition-transform" />
                        </div>
                    </div>

                    {/* Clear Filter Button - Only shows when filters are active */}
                    {(subject || year || language) && (
                        <div className="w-full lg:w-auto animate-in fade-in slide-in-from-right-4 duration-300">
                            <button
                                onClick={resetFilters}
                                type="button"
                                className="h-12 px-6 flex items-center justify-center gap-2 bg-destructive/5 text-destructive hover:bg-destructive/10 rounded-xl transition-all font-bold text-sm w-full"
                                title={t('filters.reset')}
                            >
                                <X className="h-5 w-5" />
                                {t('filters.reset')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
