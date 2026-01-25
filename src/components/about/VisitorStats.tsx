import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, FileText, Download, Star } from 'lucide-react'
import { statsApi } from '../../lib/firebase/stats'
import { papersApi } from '../../lib/firebase/papers'
import { useLanguage } from '../../context/LanguageContext'
import { clsx } from 'clsx'

export function VisitorStats() {
    const { t, language } = useLanguage();
    const currentYear = new Date().getFullYear();
    const excellenceYears = Math.max(0, currentYear - 2020);

    const [stats, setStats] = useState({
        visitors: 0,
        papers: 0,
        downloads: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [globalStats, papers] = await Promise.all([
                    statsApi.getStats(),
                    papersApi.getPapers()
                ])

                setStats({
                    visitors: globalStats.visitors,
                    papers: papers.length,
                    downloads: globalStats.papersEngagement
                })
            } catch (error) {
                console.error('Failed to fetch stats:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const statsConfig = [
        { label: t('hero.stats.visitors') || 'Total Visitors', value: stats.visitors, icon: Users, color: 'text-primary', bg: 'bg-primary/10', hover: 'hover:border-primary/40 hover:shadow-primary/10 hover:bg-primary/5' },
        { label: t('hero.stats.papers') || 'Papers Available', value: stats.papers, icon: FileText, color: 'text-primary', bg: 'bg-primary/10', hover: 'hover:border-primary/40 hover:shadow-primary/10 hover:bg-primary/5' },
        { label: t('hero.stats.downloads') || 'Total Downloads', value: stats.downloads, icon: Download, color: 'text-primary', bg: 'bg-primary/10', hover: 'hover:border-primary/40 hover:shadow-primary/10 hover:bg-primary/5' },
        { label: `${excellenceYears} ${t('hero.stats.excellence') || 'Years of excellence'}`, value: excellenceYears, icon: Star, color: 'text-primary', bg: 'bg-primary/10', isStatic: true, hover: 'hover:border-primary/40 hover:shadow-primary/10 hover:bg-primary/5' },
    ]

    return (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {statsConfig.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={clsx(
                        "bg-primary-foreground border border-muted shadow-xl rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-8 text-center space-y-3 sm:space-y-4 hover:scale-[1.05] transition-all duration-300 group cursor-default",
                        stat.hover
                    )}
                >
                    <div className={clsx(
                        "mx-auto p-3 sm:p-4 rounded-xl sm:rounded-2xl w-fit transition-all duration-300 group-hover:scale-110",
                        stat.bg,
                        "group-hover:bg-white/40"
                    )}>
                        <stat.icon className={clsx("h-6 w-6 sm:h-8 sm:w-8", stat.color)} />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-2xl sm:text-4xl font-black text-secondary">
                            {loading && !stat.isStatic ? '...' : stat.value.toLocaleString()}
                        </h4>
                        <p className={clsx(
                            "text-[8px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-secondary/40 group-hover:text-secondary/70 transition-colors text-balance",
                            language === 'ta' && "text-[7px] sm:text-[9px]"
                        )}>
                            {stat.label}
                        </p>
                    </div>
                </motion.div>
            ))}
        </section>
    )
}
