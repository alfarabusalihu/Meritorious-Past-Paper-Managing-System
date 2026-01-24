import { motion } from 'framer-motion'
import { BookOpen, Shield, Users, Zap } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export function FeaturesGrid() {
    const { t } = useLanguage()
    const featureIcons = [BookOpen, Zap, Shield, Users]
    const features = ((t('about.features') as unknown as { title: string; description: string }[]) || []).map((f, i) => ({
        ...f,
        icon: featureIcons[i] || BookOpen
    }))

    return (
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
    )
}
