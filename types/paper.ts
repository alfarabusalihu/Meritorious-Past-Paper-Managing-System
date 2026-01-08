export type PaperCategory = 'PAPER' | 'SCHEME';
export type PaperPart = 'Part 1' | 'Part 2';

export interface Paper {
    paperId: string;
    paperName: string;
    subject: string;
    year: number;
    category: PaperCategory;
    part: PaperPart;
    language: string;
    addedBy: string;
    addedDate: string;
    pdfUrl: string;
}
