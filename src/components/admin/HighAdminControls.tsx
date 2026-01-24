import { useState, useEffect } from 'react'
import { configsApi, FilterConfig, SocialConfig } from '../../lib/firebase/configs'
import { Alert } from '../ui/Alert'
import { ConfigManager } from './tabs/ConfigManager'
import { useLanguage } from '../../context/LanguageContext'

export function HighAdminControls() {
    const { t } = useLanguage()
    const [socials, setSocials] = useState<SocialConfig | null>(null)
    const [filterTexts, setFilterTexts] = useState<Record<string, string>>({
        subjects: '',
        languages: '',
        years: ''
    })
    const [loading, setLoading] = useState(false)
    const [savingFilters, setSavingFilters] = useState(false)
    const [savingSocials, setSavingSocials] = useState(false)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            const [f, s] = await Promise.all([
                configsApi.getFilters(),
                configsApi.getSocials()
            ])
            setFilterTexts({
                subjects: f.subjects.join(', '),
                languages: f.languages.join(', '),
                years: f.years.join(', ')
            })
            setSocials(s)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateFilterList = (key: string, value: string) => {
        setFilterTexts(prev => ({ ...prev, [key]: value }))
    }

    const handleSaveFilters = async () => {
        setSavingFilters(true)
        try {
            const updatedFilters: FilterConfig = {
                subjects: filterTexts.subjects.split(',').map(s => s.trim()).filter(Boolean),
                languages: filterTexts.languages.split(',').map(s => s.trim()).filter(Boolean),
                years: filterTexts.years.split(',').map(s => s.trim()).filter(Boolean)
            }
            await configsApi.updateFilters(updatedFilters)
            setSnackbar({ open: true, message: t('admin.controls.success.filters'), severity: 'success' })
        } catch {
            setSnackbar({ open: true, message: t('admin.controls.error.filters'), severity: 'error' })
        } finally {
            setSavingFilters(false)
        }
    }

    const handleSaveSocials = async () => {
        if (!socials) return
        setSavingSocials(true)
        try {
            await configsApi.updateSocials(socials)
            setSnackbar({ open: true, message: t('admin.controls.success.socials'), severity: 'success' })
        } catch {
            setSnackbar({ open: true, message: t('admin.controls.error.socials'), severity: 'error' })
        } finally {
            setSavingSocials(false)
        }
    }

    // Removed handleSaveDonationConfig

    if (loading) {
        return (
            <div className="p-20 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="mt-4 font-bold text-muted-foreground">{t('admin.controls.loading')}</p>
            </div>
        )
    }

    return (
        <div className="bg-white min-h-[500px]">
            <div className="p-6">
                <ConfigManager
                    filterTexts={filterTexts}
                    socials={socials}
                    savingFilters={savingFilters}
                    savingSocials={savingSocials}
                    onUpdateFilterList={handleUpdateFilterList}
                    onUpdateSocials={setSocials}
                    onSaveFilters={handleSaveFilters}
                    onSaveSocials={handleSaveSocials}
                    onSnackbar={(m, s) => setSnackbar({ open: true, message: m, severity: s })}
                />
            </div>

            {snackbar.open && (
                <div className="fixed bottom-8 right-8 z-[110] w-full max-w-md px-4 animate-in slide-in-from-bottom-4">
                    <Alert
                        severity={snackbar.severity}
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                    >
                        {snackbar.message}
                    </Alert>
                </div>
            )}
        </div>
    )
}
