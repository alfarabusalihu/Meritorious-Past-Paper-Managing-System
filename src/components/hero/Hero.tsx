import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { Helmet } from 'react-helmet-async'

export function Hero() {
    const { t } = useLanguage()

    return (
        <>
            <Helmet>
                <title>{`${t('hero.title')} | Merit O/L Series`}</title>
                <meta name="description" content={t('about.initiative.descriptionPart2')} />
            </Helmet>
            <section
                className="relative min-h-[60vh] md:min-h-[90vh] flex items-center pt-8 pb-16 md:py-0 overflow-hidden bg-[#0A001F]"
            >
                {/* Radiant Background Mix - Restored Depth with Black */}
                <div className="absolute inset-0 overflow-hidden -z-10">
                    <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_60%_30%,#2D0066_0%,#13005A_40%,#000000_100%)] opacity-80" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[100%] h-[100%] bg-[radial-gradient(circle_at_70%_70%,#13005A_0%,#0A001F_50%,#000000_100%)] opacity-60" />
                </div>

                {/* Subtle Texture Overlay */}
                <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />

                <div className="section-container relative z-10 w-full">
                    <div className="w-full mx-auto text-center space-y-4 sm:space-y-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 sm:gap-3 px-5 py-1.5 sm:px-6 sm:py-2 bg-white/10 border border-white/20 rounded-full text-white text-xs sm:text-xs font-black uppercase tracking-[0.2em] backdrop-blur-md shadow-2xl"
                        >
                            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400 animate-pulse" />
                            <span>MERITORIOUS' 19</span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex flex-col items-center justify-center w-full relative space-y-3 sm:space-y-8"
                        >
                            <h1 className="text-[clamp(1.5rem,6vw,4.5rem)] font-black tracking-[0.12em] sm:tracking-[0.16em] text-white leading-none uppercase whitespace-nowrap mr-[-0.12em] sm:mr-[-0.16em] select-none mb-4">
                                Merit <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 tracking-normal">O/L</span> Series
                            </h1>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="text-xs sm:text-sm md:text-lg lg:text-xl text-white/60 font-medium max-w-2xl lg:max-w-4xl mx-auto px-6 leading-relaxed text-balance"
                            >
                                {t('about.initiative.descriptionPart2')}
                            </motion.p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 sm:pt-6"
                        >
                            <button
                                onClick={() => {
                                    const element = document.getElementById('papers-section');
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                                aria-label={t('hero.cta.primary')}
                                className="w-fit min-w-[180px] sm:min-w-[200px] sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#0A001F] rounded-[2rem] font-black text-sm sm:text-base shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 sm:gap-4 group mx-auto text-balance text-center"
                            >
                                <span className="leading-tight">{t('hero.cta.primary')}</span>
                                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform shrink-0" aria-hidden="true" />
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* Hard Edge transition to next component */}
                <div className="absolute bottom-0 left-0 w-full h-px bg-white/10" />
            </section>
        </>
    )
}
