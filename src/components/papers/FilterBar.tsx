import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { X, ChevronDown, Plus, Check } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { useFilters } from '../../context/FilterContext'
import { AnimatePresence, motion } from 'framer-motion'

interface FilterBarProps {
    onFilterChange: (filters: { searchQuery: string, subject: string, year: string, language: string }) => void
    showAddButton?: boolean
}

interface CustomSelectProps {
    value: string;
    onChange: (val: string) => void;
    options: string[];
    placeholder: string;
    isTamil?: boolean;
}

function CustomSelect({ value, onChange, options, placeholder, isTamil }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative flex-1" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls="filter-options"
                className={`w-full h-12 px-5 bg-muted/30 border border-muted-foreground/10 rounded-2xl flex items-center justify-between gap-2 hover:bg-muted/50 hover:border-primary/30 transition-all group ${isTamil ? 'text-[11px]' : 'text-sm'
                    } ${value ? 'text-secondary font-bold' : 'text-muted-foreground font-medium'}`}
            >
                <span className="truncate">{value || placeholder}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'text-muted-foreground'}`} aria-hidden="true" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        id="filter-options"
                        role="listbox"
                        className="absolute top-14 left-0 w-full bg-white border border-muted rounded-2xl shadow-2xl p-2 z-[60] max-h-[300px] overflow-y-auto custom-scrollbar"
                    >
                        <button
                            onClick={() => { onChange(''); setIsOpen(false); }}
                            role="option"
                            aria-selected={!value}
                            className={`w-full text-left px-4 py-3 rounded-xl hover:bg-muted transition-colors flex items-center justify-between text-sm ${!value ? 'text-primary font-bold bg-primary/5' : 'text-muted-foreground font-medium'}`}
                        >
                            <span>{placeholder}</span>
                            {!value && <Check size={14} aria-hidden="true" />}
                        </button>
                        {options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => { onChange(opt); setIsOpen(false); }}
                                role="option"
                                aria-selected={value === opt}
                                className={`w-full text-left px-4 py-3 rounded-xl hover:bg-muted transition-colors flex items-center justify-between text-sm ${value === opt ? 'text-primary font-bold bg-primary/5' : 'text-secondary font-medium'}`}
                            >
                                <span className="truncate">{opt}</span>
                                {value === opt && <Check size={14} aria-hidden="true" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function FilterBar({ onFilterChange, showAddButton = false }: FilterBarProps) {
    const { t, language: currentLanguage } = useLanguage()
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

    const sortedYears = (filters?.years || []).slice().sort((a, b) => parseInt(b) - parseInt(a));
    const sortedSubjects = (filters?.subjects || []).slice().sort();

    return (
        <div className="w-full space-y-6 mt-6">
            {showAddButton && (
                <div className="flex justify-end">
                    <Link
                        to="/add-paper"
                        className="flex items-center gap-2 px-6 h-14 bg-primary text-primary-foreground rounded-2xl font-black text-[clamp(0.7rem,3vw,0.875rem)] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all sm:whitespace-nowrap text-center text-balance overflow-hidden grow sm:grow-0"
                    >
                        <Plus size={18} strokeWidth={3} className="shrink-0" />
                        <span>{t('addPaper.title.add')} {t('addPaper.title.highlight')}</span>
                    </Link>
                </div>
            )}

            <div
                className="bg-card border border-muted rounded-[2.5rem] p-6 lg:p-8 shadow-2xl shadow-black/5"
                role="search"
                aria-label="Filter papers"
            >
                <div className="flex flex-col lg:flex-row gap-6 items-center">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 flex-1 w-full">
                        <CustomSelect
                            value={subject}
                            onChange={setSubject}
                            options={sortedSubjects}
                            placeholder={t('filters.placeholders.subject')}
                            isTamil={currentLanguage === 'ta'}
                        />
                        <CustomSelect
                            value={year}
                            onChange={setYear}
                            options={sortedYears}
                            placeholder={t('filters.placeholders.year')}
                            isTamil={currentLanguage === 'ta'}
                        />
                        <CustomSelect
                            value={language}
                            onChange={setLanguage}
                            options={filters?.languages || []}
                            placeholder={t('filters.placeholders.medium')}
                            isTamil={currentLanguage === 'ta'}
                        />
                    </div>

                    {/* Clear Filter Button - Only shows when filters are active */}
                    {(subject || year || language) && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full lg:w-auto"
                        >
                            <button
                                onClick={resetFilters}
                                type="button"
                                className="h-12 px-8 flex items-center justify-center gap-3 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-2xl transition-all font-black text-sm w-full lg:w-fit whitespace-nowrap shadow-lg shadow-rose-200/20"
                                title={t('filters.reset')}
                            >
                                <X className="h-4 w-4" />
                                {t('filters.reset').toUpperCase()}
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}
