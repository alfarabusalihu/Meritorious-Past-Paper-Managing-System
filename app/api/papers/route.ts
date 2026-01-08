import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const subject = searchParams.get('subject');
    const year = searchParams.get('year');
    const category = searchParams.get('category');
    const part = searchParams.get('part');
    const language = searchParams.get('language');

    try {
        // Start building the query
        let query = sql`SELECT * FROM papers WHERE 1=1`;

        if (subject) {
            query = sql`${query} AND subject = ${subject}`;
        }
        if (year) {
            query = sql`${query} AND year = ${parseInt(year)}`;
        }
        if (category) {
            query = sql`${query} AND category = ${category}`;
        }
        if (part) {
            query = sql`${query} AND part = ${part}`;
        }
        if (language) {
            query = sql`${query} AND language = ${language}`;
        }

        // Add sorting
        query = sql`${query} ORDER BY added_date DESC`;

        const papers = await query;

        // Transform database fields to frontend camelCase if necessary
        const transformedPapers = papers.map(p => ({
            paperId: p.paper_id,
            paperName: p.paper_name,
            subject: p.subject,
            year: p.year,
            category: p.category,
            part: p.part,
            language: p.language, // Added language
            addedBy: p.added_by,
            addedDate: p.added_date,
            pdfUrl: p.pdf_url
        }));

        return NextResponse.json(transformedPapers);
    } catch (error) {
        console.error('API Error (GET /api/papers):', error);
        return NextResponse.json({ error: 'Failed to fetch papers' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { paperName, subject, year, category, part, language, addedBy, pdfUrl } = body; // Added language

        if (!paperName || !subject || !year || !category || !part || !pdfUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const [newPaper] = await sql`
            INSERT INTO papers (paper_name, subject, year, category, part, language, added_by, pdf_url)
            VALUES (${paperName}, ${subject}, ${parseInt(year)}, ${category}, ${part}, ${language || 'English'}, ${addedBy || 'Anonymous'}, ${pdfUrl})
            RETURNING *
        `;

        // Create Notification
        await sql`
            INSERT INTO notifications (type, message, target_id)
            VALUES (
                'PAPER_ADDED', 
                ${`New paper "${paperName}" added by ${addedBy || 'Anonymous'}.`}, 
                ${newPaper.paper_id}
            )
        `;

        const transformedPaper = {
            paperId: newPaper.paper_id,
            paperName: newPaper.paper_name,
            subject: newPaper.subject,
            year: newPaper.year,
            category: newPaper.category,
            part: newPaper.part,
            language: newPaper.language, // Added language
            addedBy: newPaper.added_by,
            addedDate: newPaper.added_date,
            pdfUrl: newPaper.pdf_url
        };

        return NextResponse.json(transformedPaper);
    } catch (error) {
        console.error('API Error (POST /api/papers):', error);
        return NextResponse.json({ error: 'Failed to add paper' }, { status: 500 });
    }
}
