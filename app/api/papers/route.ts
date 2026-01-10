import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getPapers } from '@/lib/papers';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const filters = {
        subject: searchParams.get('subject') || undefined,
        year: searchParams.get('year') || undefined,
        category: searchParams.get('category') || undefined,
        part: searchParams.get('part') || undefined,
        language: searchParams.get('language') || undefined,
    };

    try {
        const transformedPapers = await getPapers(filters);
        return NextResponse.json(transformedPapers);
    } catch (error) {
        console.error('API Error (GET /api/papers):', error);
        return NextResponse.json({ error: 'Failed to fetch papers' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { paperName, subject, year, category, part, language, addedBy, pdfUrl, contentHash } = body;

        if (!paperName || !subject || !year || !category || !part || !pdfUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // De-duplication check: content_hash
        if (contentHash) {
            const [existing] = await sql`SELECT paper_id FROM papers WHERE content_hash = ${contentHash}`;
            if (existing) {
                return NextResponse.json({
                    error: 'DUPLICATE_CONTENT',
                    message: 'This exact PDF file has already been uploaded.'
                }, { status: 409 });
            }
        }

        const [newPaper] = await sql`
            INSERT INTO papers (paper_name, subject, year, category, part, language, added_by, pdf_url, content_hash)
            VALUES (${paperName}, ${subject}, ${parseInt(year)}, ${category}, ${part}, ${language || 'English'}, ${addedBy || 'Anonymous'}, ${pdfUrl}, ${contentHash || null})
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
