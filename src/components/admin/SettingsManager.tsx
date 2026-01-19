import { useState, useEffect } from 'react'
import { Save, Loader2, Globe, Facebook, Instagram, Twitter, List, Plus, Trash2 } from 'lucide-react'
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { configsApi, FilterConfig, SocialConfig } from '../../lib/firebase/configs'
import { Snackbar, Alert } from '@mui/material'

export function SettingsManager() {
    const [configs, setConfigs] = useState<FilterConfig | null>(null)
    const [socials, setSocials] = useState<SocialConfig | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSavingFilters, setIsSavingFilters] = useState(false)
    const [isSavingSocials, setIsSavingSocials] = useState(false)
    const [feedback, setFeedback] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success'
    })

    const titles: Record<string, string> = {
        subjects: 'Academic Subjects',
        categories: 'Paper Categories',
        parts: 'Paper Parts / Components',
        languages: 'Language Options',
        years: 'Academic Years'
    }

    useEffect(() => {
        const load = async () => {
            const f = await configsApi.getFilters()
            const s = await configsApi.getSocials()
            setConfigs(f)
            setSocials(s)
            setIsLoading(false)
        }
        load()
    }, [])

    const handleSaveFilters = async () => {
        if (!configs) return
        setIsSavingFilters(true)
        try {
            await configsApi.updateFilters(configs)
            setFeedback({ open: true, message: 'Filters updated successfully!', severity: 'success' })
        } catch (error) {
            setFeedback({ open: true, message: 'Failed to update filters', severity: 'error' })
        }
        setIsSavingFilters(false)
    }

    const handleSaveSocials = async () => {
        if (!socials) return
        setIsSavingSocials(true)
        try {
            await configsApi.updateSocials(socials)
            setFeedback({ open: true, message: 'Social links updated successfully!', severity: 'success' })
        } catch (error) {
            setFeedback({ open: true, message: 'Failed to update social links', severity: 'error' })
        }
        setIsSavingSocials(false)
    }

    const addFilterItem = (type: keyof FilterConfig) => {
        if (!configs) return
        setConfigs({
            ...configs,
            [type]: [...configs[type], "New Item"]
        })
    }

    const removeFilterItem = (type: keyof FilterConfig, index: number) => {
        if (!configs) return
        const updated = configs[type].filter((_, i) => i !== index)
        setConfigs({ ...configs, [type]: updated })
    }

    const updateFilterItem = (type: keyof FilterConfig, index: number, value: string) => {
        if (!configs) return
        const updated = [...configs[type]]
        updated[index] = value
        setConfigs({ ...configs, [type]: updated })
    }

    if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Filters Card */}
            <div className="bg-card border border-muted rounded-[2.5rem] shadow-xl shadow-black/5 p-8 space-y-6">
                <div className="flex items-center justify-between gap-4 border-b border-muted pb-6">
                    <h2 className="text-xl font-black text-foreground flex items-center gap-2">
                        <List className="h-5 w-5 text-primary" />
                        Dynamic Filters
                    </h2>
                    <Button
                        size="sm"
                        className="font-black rounded-xl h-10 px-4"
                        onClick={handleSaveFilters}
                        disabled={isSavingFilters}
                    >
                        {isSavingFilters ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>

                <div className="space-y-8">
                    {(['subjects', 'categories', 'parts', 'languages', 'years'] as const).map((type) => (
                        <div key={type} className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    {titles[type] || type}
                                </h3>
                                <button onClick={() => addFilterItem(type)} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1">
                                    <Plus className="h-3 w-3" /> Add New
                                </button>
                            </div>
                            <div className="space-y-3">
                                {configs?.[type]?.map((item, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <Input
                                            value={item}
                                            onChange={(e) => updateFilterItem(type, idx, e.target.value)}
                                            className="h-11 font-bold rounded-xl bg-muted/30 border-none focus:ring-primary/20"
                                        />
                                        <button
                                            onClick={() => removeFilterItem(type, idx)}
                                            className="h-11 w-11 flex items-center justify-center text-muted-foreground hover:bg-destructive/5 hover:text-destructive rounded-xl transition-all border border-muted"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Social Links Card */}
            <div className="bg-card border border-muted rounded-[2.5rem] shadow-xl shadow-black/5 p-8 space-y-6">
                <div className="flex items-center justify-between gap-4 border-b border-muted pb-6">
                    <h2 className="text-xl font-black text-secondary-foreground flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" />
                        Platform Settings
                    </h2>
                    <Button
                        size="sm"
                        className="font-black rounded-xl h-10 px-4"
                        onClick={handleSaveSocials}
                        disabled={isSavingSocials}
                    >
                        {isSavingSocials ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>

                <div className="space-y-6">
                    {(['twitter', 'facebook', 'instagram'] as const).map(platform => (
                        <div key={platform} className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                {platform === 'twitter' && <Twitter className="h-3 w-3" />}
                                {platform === 'facebook' && <Facebook className="h-3 w-3" />}
                                {platform === 'instagram' && <Instagram className="h-3 w-3" />}
                                {platform} URL
                            </label>
                            <Input
                                value={socials?.[platform] || ''}
                                onChange={(e) => setSocials({ ...socials, [platform]: e.target.value })}
                                placeholder={`https://${platform}.com/...`}
                                className="h-12 font-bold rounded-xl bg-muted/30 border-none focus:ring-primary/20"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <Snackbar
                open={feedback.open}
                autoHideDuration={6000}
                onClose={() => setFeedback({ ...feedback, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setFeedback({ ...feedback, open: false })}
                    severity={feedback.severity}
                    sx={{ width: '100%', borderRadius: '1rem', fontWeight: 700 }}
                >
                    {feedback.message}
                </Alert>
            </Snackbar>
        </div>
    )
}
