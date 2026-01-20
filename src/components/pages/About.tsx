import { motion } from 'framer-motion'
import { BookOpen, Shield, Users, Zap, Eye, Heart, Download } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { useState, useEffect } from 'react'
import { statsApi, SystemStats } from '../../lib/firebase/stats'
import { clsx } from 'clsx'

export function About() {
    const { t } = useLanguage()
    const [stats, setStats] = useState<SystemStats>({ visitors: 0, contributors: 0, papersEngagement: 0 })

    useEffect(() => {
        statsApi.getStats().then(setStats)

        // Smart Visitor Tracking
        const trackVisit = async () => {
            const lastVisit = localStorage.getItem('last_visit_date')
            const today = new Date().toDateString()

            // Deduplicate: Only increment if they haven't visited today
            if (lastVisit !== today) {
                await statsApi.incrementVisitors()
                localStorage.setItem('last_visit_date', today)
            }
        }

        trackVisit()
    }, [])

    const featureIcons = [BookOpen, Zap, Shield, Users]
    const features = ((t('about.features') as unknown as { title: string; description: string }[]) || []).map((f, i) => ({
        ...f,
        icon: featureIcons[i] || BookOpen
    }))

    const statsConfig = [
        { label: 'Visitors', value: stats.visitors, icon: Eye, color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Contributors', value: stats.contributors, icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
        { label: 'Papers Engagement', value: stats.papersEngagement, icon: Download, color: 'text-amber-500', bg: 'bg-amber-50' },
    ]

    return (
        <div className="section-container section-spacing space-y-16 md:space-y-24">
            {/* Hero Section */}
            <section className="text-center space-y-8 max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                        {t('about.hero.title')} <br />
                        <span className="text-primary italic">{t('about.hero.highlight')}</span>
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        {t('about.hero.description')}
                    </p>
                </motion.div>
            </section>

            {/* Statistics Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {statsConfig.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card border-none shadow-xl shadow-black/5 rounded-[2.5rem] p-8 text-center space-y-4 hover:scale-[1.02] transition-transform"
                    >
                        <div className={clsx("mx-auto p-4 rounded-2xl w-fit", stat.bg)}>
                            <stat.icon className={clsx("h-8 w-8", stat.color)} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-4xl font-bold text-foreground">{stat.value.toLocaleString()}</h4>
                            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </section>

            {/* Features Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-6 p-8 rounded-[2.5rem] bg-muted/30 border border-transparent hover:border-primary/20 hover:bg-muted/50 transition-all duration-500 group"
                    >
                        <div className="shrink-0">
                            <div className="p-5 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-inner">
                                <feature.icon className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-2xl font-bold text-foreground">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed font-medium">
                                {feature.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </section>

            {/* Mission Section */}
            <section className="rounded-[3rem] bg-secondary text-secondary-foreground p-12 md:p-20 text-center space-y-8 relative overflow-hidden shadow-2xl shadow-secondary/20">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 -z-0" />
                <div className="relative z-10 space-y-8">
                    <h2 className="text-4xl font-bold tracking-tight">{t('about.mission.title')}</h2>
                    <p className="text-xl text-secondary-foreground/80 max-w-2xl mx-auto leading-relaxed font-medium">
                        {t('about.mission.description')}
                    </p>
                </div>
            </section>
        </div>
    )
}
