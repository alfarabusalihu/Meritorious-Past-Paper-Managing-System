import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, FileText, Download } from 'lucide-react'
import { statsApi } from '../../lib/firebase/stats'
import { papersApi } from '../../lib/firebase/papers'
import { clsx } from 'clsx'

export function VisitorStats() {
    const [stats, setStats] = useState({
        visitors: 0,
        papers: 0,
        downloads: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Optimize: Fetch global stats and papers list (just for length)
                // In a true large-scale app, we'd also have a 'totalPapers' counter.
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
        { label: 'Total Visitors', value: stats.visitors, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Papers Available', value: stats.papers, icon: FileText, color: 'text-amber-500', bg: 'bg-amber-50' },
        { label: 'Total Downloads', value: stats.downloads, icon: Download, color: 'text-rose-500', bg: 'bg-rose-50' },
    ]

    return (
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
                        <h4 className="text-4xl font-bold text-foreground">
                            {loading ? '...' : stat.value.toLocaleString()}
                        </h4>
                        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                    </div>
                </motion.div>
            ))}
        </section>
    )
}
