import { useState, useEffect } from 'react'
import { Facebook, Instagram, Twitter, Loader2 } from 'lucide-react'
import { configsApi } from '../../lib/firebase/configs'

export function Footer() {
    const [socials, setSocials] = useState<any>(null)

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
                            <div className="p-2 bg-primary rounded-xl text-primary-foreground shadow-lg shadow-primary/20">
                                <span className="font-black text-xl px-1">M</span>
                            </div>
                            <span className="font-black text-2xl tracking-tighter text-white">MPPMS</span>
                        </div>
                        <p className="text-secondary-foreground/60 text-sm font-medium max-w-sm leading-relaxed">
                            The ultimate Meritorious Past Paper Management System for students and educators. Designed for excellence and academic success.
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
                                <Loader2 className="h-5 w-5 animate-spin text-primary/30" />
                            )}
                        </div>

                        <div className="flex flex-col items-center md:items-end gap-2">
                            <p className="text-[10px] text-secondary-foreground/40 font-black uppercase tracking-[0.3em]">
                                © {new Date().getFullYear()} MPPMS Archive • Sri Lanka
                            </p>
                            <div className="h-1 w-12 bg-primary rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
