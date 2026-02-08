import { useLanguage } from '../../context/LanguageContext'

export function VisionSection() {
    const { t } = useLanguage()

    const cards = [
        {
            title: t('about.vision.title'),
            description: t('about.vision.description'),
            gradient: "from-purple-500/20 to-blue-500/20"
        },
        {
            title: t('about.initiative.title'),
            description: t('about.initiative.description'),
            gradient: "from-blue-500/20 to-emerald-500/20"
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cards.map((card, index) => (
                <section
                    key={index}
                    className="group relative rounded-[3rem] bg-secondary text-secondary-foreground p-10 md:p-14 space-y-6 overflow-hidden shadow-2xl shadow-secondary/10 hover:shadow-secondary/20 transition-all duration-500 flex flex-col justify-center border border-white/5"
                >
                    {/* Dynamic Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-30 -z-10 group-hover:scale-110 transition-transform duration-700`} />
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 -z-0 pointer-events-none" />

                    <div className="relative z-10 space-y-4">
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white/90">
                            {card.title}
                        </h2>
                        <p className="text-base sm:text-lg text-secondary-foreground/70 leading-relaxed font-medium text-balance">
                            {card.description}
                        </p>
                    </div>
                </section>
            ))}
        </div>
    )
}
