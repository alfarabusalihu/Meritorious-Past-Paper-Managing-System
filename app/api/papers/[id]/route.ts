import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

// Use standard DB connection for write operations
// In a real app, you'd verify the JWT/Session here for security

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { paperName, subject, year, category, part, language, pdfUrl, contentHash } = body;

        // De-duplication check: content_hash (exclude self)
        if (contentHash) {
            const [existing] = await sql`
                SELECT paper_id FROM papers 
                WHERE content_hash = ${contentHash} AND paper_id != ${id}
            `;
            if (existing) {
                return NextResponse.json({
                    error: 'DUPLICATE_CONTENT',
                    message: 'This exact PDF file has already been uploaded.'
                }, { status: 409 });
            }
        }

        const [updatedPaper] = await sql`
            UPDATE papers 
            SET 
                paper_name = ${paperName},
                subject = ${subject},
                year = ${parseInt(year)},
                category = ${category},
                part = ${part},
                language = ${language},
                pdf_url = COALESCE(${pdfUrl}, pdf_url),
                content_hash = COALESCE(${contentHash}, content_hash)
            WHERE paper_id = ${id}
            RETURNING *
        `;

        if (!updatedPaper) {
            return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
        }

        return NextResponse.json(updatedPaper);
    } catch (error) {
        console.error('API Error (PUT /api/papers/[id]):', error);
        return NextResponse.json({ error: 'Failed to update paper' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Note: For deletion, we should also delete the file from Supabase Storage
        // but that requires the file path which we don't store explicitly (only URL).
        // For now, we'll just delete the record.

        const [deletedPaper] = await sql`
            DELETE FROM papers 
            WHERE paper_id = ${id}
            RETURNING *
        `;

        if (!deletedPaper) {
            return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Paper deleted successfully' });
    } catch (error) {
        console.error('API Error (DELETE /api/papers/[id]):', error);
        return NextResponse.json({ error: 'Failed to delete paper' }, { status: 500 });
    }
}
