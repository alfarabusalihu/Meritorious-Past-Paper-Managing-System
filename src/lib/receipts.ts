import jsPDF from 'jspdf';
import { Contribution } from './firebase/schema';

export const generateReceipt = (contribution: Contribution) => {
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16
    });

    // Brand Colors
    const primaryColor = '#0f172a'; // Deep Navy

    // Header Background
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 40, 'F');

    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Merit O/L Series Donation Receipt", 20, 25);

    // Organization Info (Right aligned)
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Meritorious Past Paper Management System", 190, 15, { align: 'right' });
    doc.text("Official Contribution", 190, 20, { align: 'right' });
    doc.text(new Date().toLocaleDateString(), 190, 25, { align: 'right' });

    // Footer Text
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text("VERIFIED CONTRIBUTION", 190, 35, { align: 'right' });

    // Receipt Body
    let y = 60;
    doc.setTextColor(0, 0, 0);

    // Thank You Note
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`Official Receipt of Appreciation`, 20, y);
    y += 10;
    doc.setFontSize(14);
    doc.setTextColor(59, 130, 246); // Blue
    doc.text(`Thank you, ${contribution.donorName}!`, 20, y);

    y += 12;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    const splitText = doc.splitTextToSize(
        "This receipt acknowledges your generous support. Your contribution helps maintain the infrastructure, hosting, and expansion of our past paper archive for students worldwide. We truly appreciate your investment in education.",
        170
    );
    doc.text(splitText, 20, y);
    y += (splitText.length * 6) + 10;

    // Transaction Details Box
    doc.setFillColor(248, 250, 252); // Light gray bg
    doc.setDrawColor(226, 232, 240); // Border color
    doc.roundedRect(20, y, 170, 75, 4, 4, 'FD');

    y += 15;
    const addLine = (label: string, value: string) => {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(100, 100, 100);
        doc.text(label, 30, y);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text(value, 180, y, { align: 'right' });
        y += 12;
    };

    addLine("Receipt ID", contribution.receiptId || contribution.id || "N/A");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const date = (contribution.timestamp as any).toDate ? (contribution.timestamp as any).toDate() : new Date(contribution.timestamp as any);
    addLine("Date Processed", date.toLocaleDateString() + " " + date.toLocaleTimeString());
    addLine("Contribution Purpose", "Educational Platform Support");
    addLine("Donor Email", contribution.email || "N/A");

    // Divider
    y += 2;
    doc.setDrawColor(200, 200, 200);
    doc.line(30, y, 180, y);
    y += 10;

    // Total Amount
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42); // Navy
    doc.text("Donation Amount", 30, y + 1);
    doc.setTextColor(59, 130, 246); // Blue
    doc.setFontSize(18);
    doc.text(`$${contribution.amount.toFixed(2)} ${contribution.currency.toUpperCase()}`, 180, y + 1, { align: 'right' });

    // Verified Stamp Design
    y += 40;
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.rect(140, y - 10, 40, 20);
    doc.setFontSize(10);
    doc.setTextColor(59, 130, 246);
    doc.text("OFFICIALLY", 160, y, { align: 'center' });
    doc.text("VERIFIED", 160, y + 5, { align: 'center' });

    // Organization Footer
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("This is an electronically generated receipt. No signature is required.", 105, 280, { align: 'center' });
    doc.text("Merit O/L Series Team - Empowering Future Success", 105, 285, { align: 'center' });

    // Save
    doc.save(`MeritOLSeries_Receipt_${contribution.receiptId || 'Contribution'}.pdf`);
};
