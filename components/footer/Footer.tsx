"use client";

import { Facebook, Instagram, Twitter, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Footer() {
    const [socials, setSocials] = useState<any>(null);

    useEffect(() => {
        fetch('/api/configs')
            .then(res => res.json())
            .then(data => setSocials(data.socials))
            .catch(err => console.error('Failed to fetch socials:', err));
    }, []);

    return (
        <footer className="border-t bg-secondary text-secondary-foreground">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
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
                        {socials ? (
                            <>
                                {socials.twitter && (
                                    <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                                        <Twitter className="h-5 w-5" />
                                    </a>
                                )}
                                {socials.instagram && (
                                    <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                                        <Instagram className="h-5 w-5" />
                                    </a>
                                )}
                                {socials.facebook && (
                                    <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                                        <Facebook className="h-5 w-5" />
                                    </a>
                                )}
                            </>
                        ) : (
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/30" />
                        )}
                    </div>

                    <p className="text-[12px] text-secondary-foreground/40 font-medium uppercase tracking-[0.2em]">
                        © {new Date().getFullYear()} MPPMS. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
