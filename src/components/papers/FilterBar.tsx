import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, X, ChevronDown } from 'lucide-react'
import { Button } from '../ui/Button'
import { useLanguage } from '../../context/LanguageContext'
import { useFilters } from '../../context/FilterContext'

interface FilterBarProps {
    onFilterChange: (filters: any) => void
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
    const { t } = useLanguage()
    const { filters } = useFilters()
    const [subject, setSubject] = useState('')
    const [year, setYear] = useState('')
    const [examType, setExamType] = useState('')
    const [part, setPart] = useState('')
    const [language, setLanguage] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        onFilterChange({ searchQuery, subject, year, examType, part, language })
    }

    const resetFilters = () => {
        setSearchQuery('')
        setSubject('')
        setYear('')
        setExamType('')
        setPart('')
        setLanguage('')
        onFilterChange({ searchQuery: '', subject: '', year: '', examType: '', part: '', language: '' })
    }

    return (
        <div className="w-full space-y-6 mt-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center justify-between w-full lg:w-auto">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-primary" />
                        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-foreground/60">
                            {t('filters.title')}
                        </h2>
                    </div>

                    <Link
                        to="/add-paper"
                        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold text-xs shadow-lg shadow-primary/20"
                    >
                        <Plus size={14} />
                        {t('addPaper.title.add')}
                    </Link>
                </div>

                <div className="flex items-center gap-4 flex-1 max-w-2xl w-full">
                    <div className="relative group flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder={t('filters.search')}
                            className="w-full h-14 pl-12 pr-4 bg-muted/30 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <Link
                        to="/add-paper"
                        className="hidden lg:flex items-center gap-2 px-6 h-14 bg-primary text-primary-foreground rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
                    >
                        <Plus size={18} />
                        {t('addPaper.title.add')} {t('addPaper.title.highlight')}
                    </Link>
                </div>
            </div>

            <div className="bg-card border border-muted rounded-[2rem] p-6 lg:p-8 shadow-xl shadow-black/5">
                <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
                    {/* Subject Filter */}
                    <div className="relative group">
                        <select
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full h-12 pl-4 pr-10 bg-muted/50 border border-transparent rounded-xl focus:bg-white focus:border-primary/30 outline-none transition-all font-bold text-xs sm:text-sm appearance-none cursor-pointer truncate"
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
                            className="w-full h-12 pl-4 pr-10 bg-muted/50 border border-transparent rounded-xl focus:bg-white focus:border-primary/30 outline-none transition-all font-bold text-xs sm:text-sm appearance-none cursor-pointer truncate"
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

                    {/* Category Filter */}
                    <div className="relative group">
                        <select
                            value={examType}
                            onChange={(e) => setExamType(e.target.value)}
                            className="w-full h-12 pl-4 pr-10 bg-muted/50 border border-transparent rounded-xl focus:bg-white focus:border-primary/30 outline-none transition-all font-bold text-xs sm:text-sm appearance-none cursor-pointer truncate"
                        >
                            <option value="">{t('filters.placeholders.category')}</option>
                            {(filters?.categories || []).map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none group-focus-within:rotate-180 transition-transform" />
                    </div>

                    {/* Part Filter */}
                    <div className="relative group">
                        <select
                            value={part}
                            onChange={(e) => setPart(e.target.value)}
                            className="w-full h-12 pl-4 pr-10 bg-muted/50 border border-transparent rounded-xl focus:bg-white focus:border-primary/30 outline-none transition-all font-bold text-xs sm:text-sm appearance-none cursor-pointer truncate"
                        >
                            <option value="">{t('filters.placeholders.part')}</option>
                            {(filters?.parts || []).map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none group-focus-within:rotate-180 transition-transform" />
                    </div>

                    {/* Language Filter */}
                    <div className="relative group">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full h-12 pl-4 pr-10 bg-muted/50 border border-transparent rounded-xl focus:bg-white focus:border-primary/30 outline-none transition-all font-bold text-xs sm:text-sm appearance-none cursor-pointer truncate"
                        >
                            <option value="">Language</option>
                            {(filters?.languages || []).map(l => (
                                <option key={l} value={l}>{l}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none group-focus-within:rotate-180 transition-transform" />
                    </div>

                    <div className="flex items-center gap-2 lg:col-span-1">
                        <Button
                            type="submit"
                            className="flex-1 h-12 rounded-xl font-bold text-sm px-4"
                        >
                            Apply
                        </Button>
                        {(subject || year || examType || part || language || searchQuery) && (
                            <button
                                onClick={resetFilters}
                                type="button"
                                className="h-12 w-12 flex items-center justify-center bg-destructive/5 text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                                title={t('filters.reset')}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}
