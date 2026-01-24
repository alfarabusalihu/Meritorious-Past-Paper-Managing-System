import { useLanguage } from '../../context/LanguageContext'

export function MissionSection() {
    const { t } = useLanguage()

    return (
        <section className="rounded-[3rem] bg-secondary text-secondary-foreground p-12 md:p-20 text-center space-y-8 relative overflow-hidden shadow-2xl shadow-secondary/20">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 -z-0" />
            <div className="relative z-10 space-y-8">
                <h2 className="text-4xl font-bold tracking-tight">{t('about.mission.title')}</h2>
                <p className="text-xl text-secondary-foreground/80 max-w-2xl mx-auto leading-relaxed font-medium">
                    {t('about.mission.description')}
                </p>
            </div>
        </section>
    )
}
