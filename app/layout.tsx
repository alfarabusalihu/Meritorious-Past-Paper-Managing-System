import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/global.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from '@/context/LanguageContext';
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: 'MPPMS - Meritorious Past Paper Management System',
    description: 'A professional platform to manage and access academic past papers.',
    openGraph: {
        title: 'MPPMS - Meritorious Past Paper Management System',
        description: 'A professional platform to manage and access academic past papers.',
        url: 'https://mppms.com',
        siteName: 'MPPMS',
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'MPPMS - Meritorious Past Paper Management System',
        description: 'A professional platform to manage and access academic past papers.',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary`}>
                <AuthProvider>
                    <LanguageProvider>
                        <Header />
                        <main className="flex-grow">
                            {children}
                        </main>
                        <Footer />
                        <Toaster />
                    </LanguageProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
