import { Link } from 'react-router-dom'
import { School, Language, ExpandMore, Person, Shield, Logout, Dashboard, Settings, LocalCafe, LogoutRounded } from '@mui/icons-material'
import { useLanguage } from '../../context/LanguageContext'
import { useState, useRef, useEffect } from 'react'
import { auth } from '../../lib/firebase'
import { onAuthStateChanged, signOut as firebaseSignOut, User as FirebaseUser } from 'firebase/auth'
import { usersApi } from '../../lib/firebase/users'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function Navigation() {
    const { language, setLanguage, t } = useLanguage()
    const [isLangOpen, setIsLangOpen] = useState(false)
    const [isUserOpen, setIsUserOpen] = useState(false)
    const langRef = useRef<HTMLDivElement>(null)
    const userRef = useRef<HTMLDivElement>(null)

    const [user, setUser] = useState<FirebaseUser | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isSystemAdmin, setIsSystemAdmin] = useState(false)

    useEffect(() => {
        const sysAdmin = localStorage.getItem('isSystemAdmin') === 'true'
        setIsSystemAdmin(sysAdmin)
        setIsAdmin(sysAdmin)

        const unsubscribe = onAuthStateChanged(auth, async (u) => {
            setUser(u)
            if (u) {
                const role = await usersApi.getUserRole(u.uid)
                setIsAdmin(role === 'admin' || sysAdmin)
            } else {
                setIsAdmin(sysAdmin)
            }
        })
        return () => unsubscribe()
    }, [])

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
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="p-1.5 bg-primary rounded-lg text-primary-foreground transform transition-transform group-hover:scale-110 shadow-lg shadow-primary/20">
                            <School sx={{ fontSize: 24 }} />
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            MPPMS
                        </span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-sm font-black uppercase tracking-widest text-secondary/70">
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
                        <Link to="/admin" className="text-primary hover:text-primary/80 transition-all flex items-center gap-2 font-black border-b-2 border-transparent hover:border-primary py-1">
                            <Shield sx={{ fontSize: 16 }} />
                            Admin Panel
                        </Link>
                    )}
                </nav>

                <div className="flex items-center gap-4 relative">
                    {/* Language Switcher */}
                    <div className="relative" ref={langRef}>
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

                    {(user || isSystemAdmin) && (
                        <div className="relative" ref={userRef}>
                            <button
                                onClick={() => setIsUserOpen(!isUserOpen)}
                                className={cn(
                                    "flex h-10 w-10 items-center justify-center rounded-full transition-all shadow-sm",
                                    isSystemAdmin
                                        ? "bg-primary text-primary-foreground border-2 border-primary-foreground/20 shadow-primary/20"
                                        : "bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20"
                                )}
                            >
                                {isSystemAdmin ? <Shield sx={{ fontSize: 20 }} /> : <Person sx={{ fontSize: 20 }} />}
                            </button>

                            {isUserOpen && (
                                <div className="absolute right-0 mt-3 w-48 bg-background border border-muted rounded-2xl shadow-2xl py-2 z-[100] animate-in fade-in slide-in-from-top-1 duration-200 overflow-hidden">
                                    <div className="px-4 py-2 bg-muted/30 border-b border-muted mb-2">
                                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">User Session</p>
                                        <p className="text-sm font-bold text-foreground truncate">
                                            {isSystemAdmin ? 'System Admin' : user?.displayName}
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
                                    <Link
                                        to="/add-paper"
                                        onClick={() => setIsUserOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all"
                                    >
                                        <Dashboard sx={{ fontSize: 18 }} />
                                        Upload Paper
                                    </Link>
                                    <button
                                        onClick={async () => {
                                            localStorage.removeItem('isSystemAdmin')
                                            localStorage.removeItem('adminEmail')
                                            await firebaseSignOut(auth)
                                            window.location.reload()
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-black text-destructive hover:bg-destructive/5 transition-colors"
                                    >
                                        <LogoutRounded className="h-4 w-4" />
                                        {t('nav.logout')}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
