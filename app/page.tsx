import Hero from '@/components/hero/Hero';
import FilterBar from '@/components/filters/FilterBar';
import PaperGrid from '@/components/papers/PaperGrid';
import { BookOpen } from 'lucide-react';
import Pagination from '@/components/pagination/Pagination';
import { getPapers } from '@/lib/papers';
import ClientPageActions from '../components/papers/ClientPageActions';

interface HomeProps {
    searchParams: {
        subject?: string;
        year?: string;
        category?: string;
        part?: string;
        language?: string;
        search?: string;
        page?: string;
    };
}

export default async function Home({ searchParams }: HomeProps) {
    const papers = await getPapers(searchParams);

    const PAPERS_PER_PAGE = 8;
    const currentPage = Number(searchParams.page) || 1;
    const startIndex = (currentPage - 1) * PAPERS_PER_PAGE;

    // In a real database scenario, getPapers should handle pagination with LIMIT/OFFSET
    // For now, mirroring the existing slice logic
    const paginatedPapers = papers.slice(startIndex, startIndex + PAPERS_PER_PAGE);
    const totalPages = Math.ceil(papers.length / PAPERS_PER_PAGE);

    return (
        <main className="min-h-screen">
            <Hero />

            <div id="papers-section" className="container py-20 px-4 sm:px-6 lg:px-8">
                <div className="space-y-12">
                    <FilterBar />

                    <div className="space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black tracking-tight text-secondary">
                                    Available Papers
                                </h2>
                            </div>
                        </div>

                        {papers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                <div className="p-4 bg-muted rounded-full">
                                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-secondary">No papers found</h3>
                                    <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
                                </div>
                            </div>
                        ) : (
                            <PaperGrid
                                papers={paginatedPapers}
                            />
                        )}

                        {totalPages > 1 && (
                            <Pagination
                                totalPages={totalPages}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Client-side actions like the PDF Modal and Edit/Delete handling */}
            <ClientPageActions papers={paginatedPapers} />
        </main>
    );
}
