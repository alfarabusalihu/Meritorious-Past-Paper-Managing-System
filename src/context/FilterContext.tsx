import React, { createContext, useContext, useState, useEffect } from 'react'
import { configsApi, FilterConfig } from '../lib/firebase/configs'

interface FilterContextType {
    filters: FilterConfig | null
    loading: boolean
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: React.ReactNode }) {
    const [filters, setFilters] = useState<FilterConfig | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = configsApi.subscribeFilters((data) => {
            const currentYear = new Date().getFullYear()
            const generatedYears = Array.from(
                { length: currentYear - 2019 },
                (_, i) => (currentYear - i).toString()
            )

            setFilters({
                subjects: data.subjects || [],
                languages: data.languages || [],
                // Merge DB years with generated ones, ensuring uniqueness
                years: Array.from(new Set([...generatedYears, ...(data.years || [])]))
                    .sort((a, b) => parseInt(b) - parseInt(a))
            })
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    return (
        <FilterContext.Provider value={{ filters, loading }}>
            {children}
        </FilterContext.Provider>
    )
}

export function useFilters() {
    const context = useContext(FilterContext)
    if (context === undefined) {
        throw new Error('useFilters must be used within a FilterProvider')
    }
    return context
}
