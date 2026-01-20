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
    doc.text("MPPMS Donation Receipt", 20, 25);

    // Organization Info (Right aligned)
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Meritorious Past Paper Management System", 190, 15, { align: 'right' });
    doc.text("Official Contribution", 190, 20, { align: 'right' });
    doc.text(new Date().toLocaleDateString(), 190, 25, { align: 'right' });

    // Receipt Body
    let y = 60;
    doc.setTextColor(0, 0, 0);

    // Thank You Note
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`Thank you, ${contribution.donorName}!`, 20, y);

    y += 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Your support helps us maintain and grow our educational resources.", 20, y);

    // Transaction Details Box
    y += 20;
    doc.setFillColor(248, 250, 252); // Light gray bg
    doc.setDrawColor(226, 232, 240); // Border color
    doc.roundedRect(20, y, 170, 70, 3, 3, 'FD');

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
    addLine("Date Paid", date.toLocaleDateString());
    addLine("Payment Method", "Stripe Secure Payment");
    addLine("Coffee Count", `${contribution.coffeeCount} Cups`);

    // Divider
    y += 2;
    doc.setDrawColor(200, 200, 200);
    doc.line(30, y, 180, y);
    y += 10;

    // Total
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42); // Navy
    doc.text("Total Amount", 30, y + 2);
    doc.setTextColor(59, 130, 246); // Blue
    doc.setFontSize(18);
    doc.text(`$${contribution.amount.toFixed(2)} ${contribution.currency.toUpperCase()}`, 180, y + 2, { align: 'right' });

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("This receipt is automatically generated and is valid for your records.", 105, 280, { align: 'center' });
    doc.text("MPPMS - Meritorious Past Paper Management System", 105, 285, { align: 'center' });

    // Save
    doc.save(`MPPMS_Receipt_${contribution.receiptId || 'Donation'}.pdf`);
};
