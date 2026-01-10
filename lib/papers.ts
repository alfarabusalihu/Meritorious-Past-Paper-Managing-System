import sql from './db';
import { Paper } from '@/types/paper';

export async function getPapers(filters: {
    subject?: string;
    year?: string;
    category?: string;
    part?: string;
    language?: string;
    search?: string;
} = {}) {
    try {
        let query = sql`SELECT * FROM papers WHERE 1=1`;

        if (filters.subject) {
            query = sql`${query} AND subject = ${filters.subject}`;
        }
        if (filters.year) {
            query = sql`${query} AND year = ${parseInt(filters.year)}`;
        }
        if (filters.category) {
            query = sql`${query} AND category = ${filters.category}`;
        }
        if (filters.part) {
            query = sql`${query} AND part = ${filters.part}`;
        }
        if (filters.language) {
            query = sql`${query} AND language = ${filters.language}`;
        }
        if (filters.search) {
            const searchPattern = `%${filters.search.toLowerCase()}%`;
            query = sql`${query} AND (LOWER(paper_name) LIKE ${searchPattern} OR LOWER(subject) LIKE ${searchPattern})`;
        }

        query = sql`${query} ORDER BY added_date DESC`;

        const papers = await query;

        return papers.map(p => ({
            paperId: p.paper_id,
            paperName: p.paper_name,
            subject: p.subject,
            year: p.year,
            category: p.category,
            part: p.part,
            language: p.language,
            addedBy: p.added_by,
            addedDate: p.added_date,
            pdfUrl: p.pdf_url,
            contentHash: p.content_hash
        })) as Paper[];
    } catch (error) {
        console.error('Database Error (getPapers):', error);
        throw new Error('Failed to fetch papers');
    }
}
