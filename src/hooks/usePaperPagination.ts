import { useState, useEffect } from 'react'

interface UsePaperPaginationProps<T> {
    items: T[]
    itemsPerPage?: number
    resetTriggers?: unknown[]
}

interface UsePaperPaginationReturn<T> {
    currentPage: number
    setCurrentPage: (page: number) => void
    currentItems: T[]
    totalPages: number
    indexOfFirstItem: number
    indexOfLastItem: number
}

export function usePaperPagination<T>({
    items,
    itemsPerPage = 10,
    resetTriggers = []
}: UsePaperPaginationProps<T>): UsePaperPaginationReturn<T> {
    const [currentPage, setCurrentPage] = useState(1)

    // Reset to page 1 when filters or items change
    useEffect(() => {
        setCurrentPage(1)
    }, [...resetTriggers, items.length])

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(items.length / itemsPerPage)

    return {
        currentPage,
        setCurrentPage,
        currentItems,
        totalPages,
        indexOfFirstItem,
        indexOfLastItem
    }
}
