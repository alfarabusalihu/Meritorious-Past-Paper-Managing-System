import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t bg-secondary text-secondary-foreground">
            <div className="container py-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                        <div className="p-1.5 bg-primary rounded-lg text-primary-foreground">
                            <span className="font-black text-lg px-1">M</span>
                        </div>
                        <span className="font-extrabold text-xl tracking-tight">MPPMS</span>
                    </div>
                    <p className="text-sm text-secondary-foreground/60 max-w-xs leading-relaxed">
                        The ultimate Meritorious Past Paper Management System for students and educators.
                    </p>
                </div>

                <div className="flex flex-col items-center md:items-end gap-6">
                    <div className="flex items-center gap-6">
                        <a href="https://twitter.com/" className="p-2.5 bg-white/5 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                            <Twitter className="h-5 w-5" />
                        </a>
                        <a href="https://www.instagram.com/" className="p-2.5 bg-white/5 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                            <Instagram className="h-5 w-5" />
                        </a>
                        <a href="https://www.facebook.com/" className="p-2.5 bg-white/5 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                            <Facebook className="h-5 w-5" />
                        </a>
                    </div>

                    <p className="text-[12px] text-secondary-foreground/40 font-medium uppercase tracking-[0.2em]">
                        © {new Date().getFullYear()} MPPMS. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
