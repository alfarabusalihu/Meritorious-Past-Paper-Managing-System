import { Link } from 'react-router-dom'
import { School, Language, ExpandMore, Person, Shield, Dashboard, Settings, LocalCafe, LogoutRounded, Menu, Close } from '@mui/icons-material'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { useState, useRef, useEffect } from 'react'
import { auth } from '../../lib/firebase'
import { signOut as firebaseSignOut } from 'firebase/auth'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { AnimatePresence, motion } from 'framer-motion'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function Navigation() {
    const { language, setLanguage, t } = useLanguage()
    const { user, isAdmin, isSuperAdmin } = useAuth()
    const [isLangOpen, setIsLangOpen] = useState(false)
    const [isUserOpen, setIsUserOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const langRef = useRef<HTMLDivElement>(null)
    const userRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (langRef.current && !langRef.current.contains(event.target as Node)) {
                setIsLangOpen(false)
            }
            if (userRef.current && !userRef.current.contains(event.target as Node)) {
                setIsUserOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <header className="sticky top-0 z-50 w-full border-b border-muted bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
            <div className="section-container flex h-20 items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="p-1.5 bg-primary rounded-lg text-primary-foreground transform transition-transform group-hover:scale-110 shadow-lg shadow-primary/20">
                            <School sx={{ fontSize: 24 }} />
                        </div>
                        <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            MPPMS
                        </span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-secondary/70">
                    <Link to="/" className="transition-all hover:text-primary border-b-2 border-transparent hover:border-primary py-1">
                        {t('nav.papers')}
                    </Link>
                    <Link to="/about" className="transition-all hover:text-primary border-b-2 border-transparent hover:border-primary py-1">
                        {t('nav.about')}
                    </Link>
                    <Link to="/contribute" className="transition-all hover:text-primary border-b-2 border-transparent hover:border-primary py-1 flex items-center gap-2">
                        <LocalCafe sx={{ fontSize: 16 }} />
                        Donate
                    </Link>
                    {isAdmin && (
                        <Link to="/admin" className="text-primary hover:text-primary/80 transition-all flex items-center gap-2 font-bold border-b-2 border-transparent hover:border-primary py-1">
                            <Shield sx={{ fontSize: 16 }} />
                            Admin Panel
                        </Link>
                    )}
                </nav>

                <div className="flex items-center gap-4 relative">
                    {/* Language Switcher */}
                    <div className="relative hidden sm:block" ref={langRef}>
                        <button
                            onClick={() => setIsLangOpen(!isLangOpen)}
                            className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/60 rounded-xl font-bold text-xs transition-all border border-transparent hover:border-primary/20"
                        >
                            <Language sx={{ fontSize: 16 }} className="text-primary" />
                            <span className="uppercase">{language}</span>
                            <ExpandMore className={cn("h-3 w-3 transition-transform opacity-80", isLangOpen && "rotate-180")} />
                        </button>

                        {isLangOpen && (
                            <div className="absolute right-0 mt-2 w-32 bg-background border border-muted rounded-xl shadow-xl py-1 z-[100] animate-in fade-in slide-in-from-top-1 duration-200">
                                <button
                                    onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
                                    className={cn(
                                        "w-full text-left px-4 py-2 text-sm font-bold hover:bg-muted transition-colors",
                                        language === 'en' && "text-primary bg-primary/5"
                                    )}
                                >
                                    English
                                </button>
                                <button
                                    onClick={() => { setLanguage('ta'); setIsLangOpen(false); }}
                                    className={cn(
                                        "w-full text-left px-4 py-2 text-sm font-bold hover:bg-muted transition-colors",
                                        language === 'ta' && "text-primary bg-primary/5"
                                    )}
                                >
                                    தமிழ்
                                </button>
                            </div>
                        )}
                    </div>

                    {user && (
                        <div className="relative" ref={userRef}>
                            <button
                                onClick={() => setIsUserOpen(!isUserOpen)}
                                className={cn(
                                    "flex items-center gap-2 px-3 h-10 rounded-full transition-all shadow-sm",
                                    isSuperAdmin
                                        ? "bg-secondary text-secondary-foreground border-2 border-secondary-foreground/20 shadow-secondary/20"
                                        : isAdmin
                                            ? "bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20"
                                            : "bg-muted border border-muted text-foreground hover:bg-muted/80"
                                )}
                            >
                                {isSuperAdmin ? <Shield sx={{ fontSize: 20 }} /> : isAdmin ? <Shield sx={{ fontSize: 20 }} /> : <Person sx={{ fontSize: 20 }} />}
                                {isAdmin && !isSuperAdmin && (
                                    <span className="text-sm font-bold hidden sm:inline max-w-[120px] truncate">
                                        {user.displayName}
                                    </span>
                                )}
                            </button>

                            {isUserOpen && (
                                <div className="absolute right-0 mt-3 w-48 bg-background border border-muted rounded-2xl shadow-2xl py-2 z-[100] animate-in fade-in slide-in-from-top-1 duration-200 overflow-hidden">
                                    <div className="px-4 py-2 bg-muted/30 border-b border-muted mb-2">
                                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">User Session</p>
                                        <p className="text-sm font-bold text-foreground truncate">
                                            {user?.displayName || 'User'}
                                        </p>
                                    </div>
                                    {isAdmin && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setIsUserOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-foreground hover:bg-muted/50 transition-all"
                                        >
                                            <Settings sx={{ fontSize: 18 }} />
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={async () => {
                                            localStorage.removeItem('isSystemAdmin')
                                            localStorage.removeItem('adminEmail')
                                            await firebaseSignOut(auth)
                                            window.location.reload()
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-destructive hover:bg-destructive/5 transition-colors"
                                    >
                                        <LogoutRounded className="h-4 w-4" />
                                        {t('nav.logout')}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 md:hidden text-secondary hover:bg-muted rounded-xl transition-colors"
                    >
                        {isMobileMenuOpen ? <Close /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Backdrop */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-[80px] left-0 w-full bg-background border-b border-muted shadow-2xl md:hidden z-40 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 space-y-6">
                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-secondary hover:text-primary transition-colors flex items-center gap-3">
                                <Dashboard sx={{ fontSize: 20 }} className="text-primary/60" />
                                {t('nav.papers')}
                            </Link>
                            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-secondary hover:text-primary transition-colors flex items-center gap-3">
                                <Person sx={{ fontSize: 20 }} className="text-primary/60" />
                                {t('nav.about')}
                            </Link>
                            <Link to="/contribute" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-secondary hover:text-primary transition-colors flex items-center gap-3">
                                <LocalCafe sx={{ fontSize: 20 }} className="text-primary/60" />
                                Donate
                            </Link>

                            {isAdmin && (
                                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-primary flex items-center gap-3 py-4 border-t border-muted">
                                    <Shield sx={{ fontSize: 20 }} />
                                    Admin Panel
                                </Link>
                            )}

                            <div className="pt-6 border-t border-muted flex items-center justify-between">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setLanguage('en'); setIsMobileMenuOpen(false); }}
                                        className={cn("px-4 py-2 rounded-xl text-xs font-bold", language === 'en' ? "bg-primary text-white" : "bg-muted")}
                                    >
                                        EN
                                    </button>
                                    <button
                                        onClick={() => { setLanguage('ta'); setIsMobileMenuOpen(false); }}
                                        className={cn("px-4 py-2 rounded-xl text-xs font-bold", language === 'ta' ? "bg-primary text-white" : "bg-muted")}
                                    >
                                        TA
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
