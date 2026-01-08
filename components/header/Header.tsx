"use client";

import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { User, LogOut, ChevronDown, Languages } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/cn';

export default function Header() {
    const { user, logout } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
    };

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ta' : 'en');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
            <div className="container flex h-20 items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href={ROUTES.HOME} className="flex items-center gap-2 group">
                        <div className="p-1.5 bg-primary rounded-lg text-primary-foreground transform transition-transform group-hover:scale-110 shadow-lg shadow-primary/20">
                            <span className="font-black text-xl px-1">M</span>
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">MPPMS</span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
                    <Link href={ROUTES.HOME} className="transition-all hover:text-primary border-b-2 border-transparent hover:border-primary py-1">{t('nav.papers')}</Link>
                    <Link href={ROUTES.ABOUT} className="transition-all hover:text-primary border-b-2 border-transparent hover:border-primary py-1">{t('nav.about')}</Link>
                </nav>

                <div className="flex items-center gap-4 relative" ref={menuRef}>
                    {/* Language Switcher */}
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-xl font-bold text-xs transition-all border border-transparent hover:border-primary/20"
                        title="Switch Language"
                    >
                        <Languages className="h-4 w-4 text-primary" />
                        <span className="uppercase">{language}</span>
                    </button>

                    {!user ? (
                        <Link
                            href={ROUTES.AUTH}
                            className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-secondary-foreground rounded-full font-bold shadow-lg hover:shadow-secondary/20 hover:scale-[1.03] active:scale-[0.98] transition-all"
                        >
                            <User className="h-4 w-4" />
                            <span className="hidden sm:inline">{t('nav.signIn')}</span>
                        </Link>
                    ) : (
                        <div className="relative">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-full font-bold shadow-lg hover:shadow-secondary/20 transition-all"
                            >
                                <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
                                    <User className="h-4 w-4 text-primary" />
                                </div>
                                <span className="hidden sm:inline">{user.name}</span>
                                <ChevronDown className={cn("h-4 w-4 transition-transform", isMenuOpen && "rotate-180")} />
                            </button>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-3 w-48 bg-card border border-muted rounded-2xl shadow-2xl py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-2 border-b border-muted mb-2">
                                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('nav.profile')}</p>
                                        <p className="text-sm font-bold truncate">{user.name}</p>
                                    </div>

                                    {/* Admin Link */}
                                    {user.role === 'admin' && (
                                        <Link
                                            href="/admin"
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold hover:bg-muted/50 transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <div className="h-4 w-4 bg-primary/20 rounded-full flex items-center justify-center">
                                                <User className="h-2.5 w-2.5 text-primary" />
                                            </div>
                                            <span>Profile / Admin</span>
                                        </Link>
                                    )}

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-destructive hover:bg-destructive/10 transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>{t('nav.logout')}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
