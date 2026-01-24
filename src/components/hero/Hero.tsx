import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export function Hero() {
    const { t } = useLanguage()

    return (
        <section
            className="relative min-h-[90vh] md:min-h-screen flex items-center py-24 md:py-0 overflow-hidden"
            style={{
                background: 'linear-gradient(to bottom, var(--hero-1) 0%, var(--hero-2) 15%, var(--hero-3) 35%, var(--hero-4) 50%, var(--hero-5) 75%, #F1F5F9 95%, hsl(var(--background)) 100%)'
            }}
        >
            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 bg-grid-white/[0.03] -z-10" />

            {/* Radiant depth glows (keeping them subtle) */}
            <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-purple-600/10 blur-[150px] rounded-full -z-10" />
            <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full -z-10" />

            <div className="section-container relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-white/80 text-sm font-bold uppercase tracking-widest backdrop-blur-sm"
                    >
                        <Sparkles className="h-4 w-4 text-purple-400" />
                        <span>{t('hero.eyebrow')}</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4 px-2"
                    >
                        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white leading-none">
                            {t('hero.title.main')}{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 italic">
                                {t('hero.title.highlight')}
                            </span>
                            {t('hero.title.sub') && (
                                <>
                                    <br className="hidden md:block" />
                                    <span className="text-white/90 text-4xl sm:text-6xl md:text-7xl">{t('hero.title.sub')}</span>
                                </>
                            )}
                        </h1>
                        <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto font-medium leading-relaxed">
                            {t('hero.description')}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
                    >
                        <button
                            onClick={() => {
                                const element = document.getElementById('papers-section');
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            className="w-full sm:w-auto px-10 py-5 bg-white text-[#13005A] rounded-2xl font-black shadow-2xl shadow-white/10 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
                        >
                            <span>{t('hero.cta.primary')}</span>
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        {/* <Link
                            to="/contribute"
                            className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black backdrop-blur-md hover:bg-white/10 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            <span>{t('hero.cta.secondary')}</span>
                            <BookOpen className="h-5 w-5" />
                        </Link> */}
                    </motion.div>
                </div>
            </div>

            {/* Seamless bottom mask to ensure perfect blend */}
            <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none -z-10" />
        </section>
    )
}
