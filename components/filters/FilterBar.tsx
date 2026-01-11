"use client";

import { useLanguage } from '@/context/LanguageContext';
import { Search, ChevronDown, Filter as FilterIcon, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import { PART_OPTIONS, YEAR_OPTIONS } from '@/constants/filters';

export default function FilterBar() {
    const { t } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [dynamicFilters, setDynamicFilters] = useState<any>(null);

    useEffect(() => {
        fetch('/api/configs')
            .then(res => res.json())
            .then(data => setDynamicFilters(data.filters))
            .catch(err => console.error('Failed to fetch filters:', err));
    }, []);

    const filters = [
        {
            key: 'subject',
            label: 'Subject',
            options: dynamicFilters?.subjects || ['Mathematics', 'Science']
        },
        {
            key: 'year',
            label: 'Year',
            options: YEAR_OPTIONS
        },
        {
            key: 'category',
            label: 'Category',
            options: dynamicFilters?.categories || ['PAPER', 'SCHEME']
        },
        {
            key: 'part',
            label: 'Part',
            options: dynamicFilters?.parts || PART_OPTIONS
        }
    ];

    // Synchronize local search state with URL if it changes externally
    useEffect(() => {
        setSearchQuery(searchParams.get('search') || '');
    }, [searchParams]);

    const createQueryString = useCallback(
        (params: Record<string, string | null>) => {
            const newParams = new URLSearchParams(searchParams.toString());

            Object.entries(params).forEach(([key, value]) => {
                if (value === null || value === '') {
                    newParams.delete(key);
                } else {
                    newParams.set(key, value);
                }
            });

            // Always reset to page 1 when filters change
            newParams.delete('page');

            return newParams.toString();
        },
        [searchParams]
    );

    const handleFilterChange = (key: string, value: string) => {
        const query = createQueryString({ [key]: value });
        router.push(`?${query}`, { scroll: false });
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const queryString = createQueryString({ search: query });
        router.push(`?${queryString}`, { scroll: false });
    };

    const handleReset = () => {
        setSearchQuery('');
        router.push('/', { scroll: false });
    };

    const activeFiltersCount = Array.from(searchParams.keys()).filter(k => k !== 'page').length;

    const getPlaceholder = (key: string) => {
        return t(`filters.placeholders.${key}`);
    };

    return (
        <div className="w-full space-y-6 mt-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <FilterIcon className="h-4 w-4 text-primary" />
                        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-secondary/60">
                            {t('filters.title')}
                        </h2>
                    </div>
                </div>

                <div className="relative group max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder={t('filters.search')}
                        className="w-full h-14 pl-12 pr-4 bg-muted/50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-card border rounded-[2rem] p-4 lg:p-6 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                    {filters.map((filter) => (
                        <div key={filter.key} className="relative group">
                            <select
                                className="w-full h-12 pl-4 pr-10 bg-muted border border-transparent rounded-xl focus:bg-background focus:border-primary/30 outline-none transition-all font-bold text-xs sm:text-sm appearance-none cursor-pointer truncate"
                                value={searchParams.get(filter.key) || ''}
                                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                            >
                                <option value="">{getPlaceholder(filter.key)}</option>
                                {filter.options.map((opt: string) => (
                                    <option key={opt} value={opt} className="truncate">
                                        {opt}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none group-focus-within:rotate-180 transition-transform" />
                        </div>
                    ))}

                    <div className="flex items-center gap-2">
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={handleReset}
                                className="flex-1 h-12 flex items-center justify-center gap-2 px-4 bg-destructive/5 text-destructive hover:bg-destructive/10 rounded-xl font-bold text-sm transition-all"
                            >
                                <X className="h-4 w-4" />
                                <span>{t('filters.reset')}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
