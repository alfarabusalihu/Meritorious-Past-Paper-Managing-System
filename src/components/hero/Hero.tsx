import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

export function Hero() {
    const { t } = useLanguage()

    return (
        <section className="relative min-h-[85vh] md:min-h-screen flex items-center py-12 md:py-0 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-grid-black -z-10 opacity-[0.05]" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background -z-10" />

            {/* Animated Blobs */}
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10 animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/10 blur-[130px] rounded-full -z-10" />
            <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full -z-10" />

            <div className="section-container">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-full text-primary text-sm font-bold uppercase tracking-wider"
                    >
                        <Sparkles className="h-4 w-4" />
                        <span>{t('hero.eyebrow')}</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4 px-2"
                    >
                        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-secondary leading-tight md:leading-[1.1]">
                            {t('hero.title.main')} <span className="text-primary italic relative whitespace-nowrap">
                                {t('hero.title.highlight')}
                                <div className="absolute -bottom-2 left-0 w-full h-1 bg-primary/20 rounded-full" />
                            </span><br className="hidden md:block" />
                            {t('hero.title.sub')}
                        </h1>
                        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                            {t('hero.description')}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                    >
                        <button
                            onClick={() => document.getElementById('papers-section')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-2 group"
                        >
                            <span>{t('hero.cta.primary')}</span>
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <Link
                            to="/add-paper"
                            className="w-full sm:w-auto px-8 py-4 bg-secondary text-secondary-foreground rounded-2xl font-bold shadow-lg hover:shadow-secondary/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
                        >
                            <BookOpen className="h-5 w-5" />
                            <span>{t('hero.cta.secondary')}</span>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
