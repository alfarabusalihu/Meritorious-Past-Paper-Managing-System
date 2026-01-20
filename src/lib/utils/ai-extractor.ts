import * as pdfjsLib from 'pdfjs-dist';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function extractTextFromPDF(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';
    // Usually the first 2 pages are enough for metadata
    const pagesToRead = Math.min(pdf.numPages, 2);

    for (let i = 1; i <= pagesToRead; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: unknown) => (item as { str: string }).str).join(' ');
        fullText += pageText + '\n';
    }

    return fullText;
}

export async function analyzePaperWithAI(text: string) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
        Analyze the following text extracted from a past exam paper and extract the metadata in JSON format.
        Rules:
        1. Subject: Must be one of the common subjects (e.g., Mathematics, Physics, Chemistry, Biology, Information Technology, Economics, etc.).
        2. Year: A 4-digit year (e.g., 2023).
        3. Exam Type: Must be "A/L" or "O/L".
        4. Part: Must be "Part I", "Part II", or "Full Paper".
        5. Language: Must be "English", "Sinhala", or "Tamil".
        6. Title: Create a professional title (e.g., "G.C.E. A/L Physics 2023 Part I").

        Return ONLY a JSON object with these keys: title, subject, year, examType, part, language.

        Text:
        ${text.substring(0, 4000)}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(jsonText);
}
