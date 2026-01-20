import { ChevronLeft, ChevronRight } from 'lucide-react'
import { clsx } from 'clsx'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    return (
        <div className="flex items-center justify-center gap-2 mt-12 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={clsx(
                    "p-3 rounded-2xl border border-muted transition-all duration-300",
                    currentPage === 1
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:bg-primary/10 hover:border-primary/30 text-primary active:scale-90"
                )}
                aria-label="Previous page"
            >
                <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md p-1.5 rounded-[1.5rem] border border-muted shadow-sm">
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={clsx(
                            "w-11 h-11 rounded-xl font-bold text-sm transition-all duration-300",
                            currentPage === page
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                                : "hover:bg-muted text-muted-foreground hover:text-foreground active:scale-95"
                        )}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={clsx(
                    "p-3 rounded-2xl border border-muted transition-all duration-300",
                    currentPage === totalPages
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:bg-primary/10 hover:border-primary/30 text-primary active:scale-90"
                )}
                aria-label="Next page"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    )
}
