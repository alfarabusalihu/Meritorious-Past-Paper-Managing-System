import { useState, useEffect } from 'react'
import { Facebook, Instagram, Twitter, Loader2 } from 'lucide-react'
import { configsApi, SocialConfig } from '../../lib/firebase/configs'
import { useLanguage } from '../../context/LanguageContext'
import { clsx } from 'clsx'

export function Footer() {
    const { t, language } = useLanguage()
    const [socials, setSocials] = useState<SocialConfig | null>(null)

    useEffect(() => {
        const unsubscribe = configsApi.subscribeSocials(setSocials)
        return () => unsubscribe()
    }, [])

    return (
        <footer className="bg-secondary text-secondary-foreground border-t border-white/5 relative z-30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <div className="h-10 w-10 bg-white/5 rounded-xl overflow-hidden border border-white/10 shadow-lg shadow-black/20">
                                <img src="/logo.jpeg" alt="Merit O/L Series Logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="font-extrabold text-lg tracking-[0.22em] uppercase text-white leading-none">
                                Merit <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">O/L</span> Series
                            </span>
                        </div>
                        <p className={clsx(
                            "text-secondary-foreground/60 text-sm font-medium max-w-sm leading-relaxed",
                            language === 'ta' && "text-[0.92em]"
                        )}>
                            {t('footer.description') || "The Meritorious Past Paper Management System for students and educators. Designed for excellence and academic success."}
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-8">
                        <div className="flex items-center gap-4">
                            {socials ? (
                                <>
                                    {socials.twitter && (
                                        <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 border border-white/10 rounded-2xl text-secondary-foreground hover:bg-primary hover:text-white transition-all duration-300">
                                            <Twitter className="h-5 w-5" />
                                        </a>
                                    )}
                                    {socials.instagram && (
                                        <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 border border-white/10 rounded-2xl text-secondary-foreground hover:bg-primary hover:text-white transition-all duration-300">
                                            <Instagram className="h-5 w-5" />
                                        </a>
                                    )}
                                    {socials.facebook && (
                                        <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 border border-white/10 rounded-2xl text-secondary-foreground hover:bg-primary hover:text-white transition-all duration-300">
                                            <Facebook className="h-5 w-5" />
                                        </a>
                                    )}
                                </>
                            ) : (
                                <Loader2 className="h-5 w-5 animate-spin text-white/30" />
                            )}
                        </div>

                        <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
                            <p className="text-[10px] text-secondary-foreground/40 font-black uppercase tracking-[0.3em] flex items-center justify-center md:justify-end gap-2">
                                <span className="text-base leading-none">©</span>
                                <span>2020-{new Date().getFullYear()} Merit O/L Series • {t('footer.rights') || "All Rights Reserved"}</span>
                            </p>
                            <div className="h-1 w-12 bg-primary rounded-full mt-1" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
