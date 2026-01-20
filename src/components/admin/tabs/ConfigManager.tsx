import { SocialConfig } from '../../../lib/firebase/configs'
import { statsApi } from '../../../lib/firebase/stats'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import { Save, Lock } from '@mui/icons-material'

interface ConfigManagerProps {
    filterTexts: Record<string, string>;
    socials: SocialConfig | null;
    loading: boolean;
    onUpdateFilterList: (key: string, value: string) => void;
    onUpdateSocials: (socials: SocialConfig) => void;
    onSaveFilters: () => void;
    onSaveSocials: () => void;
    onSnackbar: (message: string, severity: 'success' | 'error') => void;
}

export function ConfigManager({
    filterTexts,
    socials,
    loading,
    onUpdateFilterList,
    onUpdateSocials,
    onSaveFilters,
    onSaveSocials,
    onSnackbar
}: ConfigManagerProps) {

    const handleResetVisitors = async () => {
        if (!window.confirm("Are you sure you want to reset the visitor count to zero?")) return
        try {
            await statsApi.resetVisitors()
            onSnackbar('Visitor count reset successfully!', 'success')
        } catch {
            onSnackbar('Failed to reset visitor count', 'error')
        }
    }

    return (
        <div className="space-y-8 pb-8">
            <div>
                <h3 className="text-xl font-bold text-secondary mb-4">Global Filters</h3>
                <p className="text-sm text-muted-foreground mb-4">Comma-separated values for dropdowns.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filterTexts && Object.keys(filterTexts).map((key) => (
                        <div key={key}>
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">{key}</label>
                            <textarea
                                className="w-full rounded-xl border-muted bg-muted/10 p-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 min-h-[80px]"
                                value={filterTexts[key]}
                                onChange={(e) => onUpdateFilterList(key, e.target.value)}
                                placeholder={`Enter ${key} separated by commas...`}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-end sticky bottom-0 bg-white/80 backdrop-blur-sm p-4 -mx-4 border-t border-muted/50 mt-8">
                    <Button onClick={onSaveFilters} className="w-full sm:w-auto font-bold px-12 h-14 rounded-2xl shadow-lg" isLoading={loading}>
                        <Save sx={{ fontSize: 20, marginRight: 1 }} /> Save Filter Config
                    </Button>
                </div>
            </div>

            <div className="border-t border-muted pt-8">
                <h3 className="text-xl font-bold text-secondary mb-4">Social Links</h3>
                <div className="grid grid-cols-1 gap-4">
                    <Input label="Facebook" value={socials?.facebook || ''} onChange={e => onUpdateSocials({ ...socials!, facebook: e.target.value })} />
                    <Input label="Twitter" value={socials?.twitter || ''} onChange={e => onUpdateSocials({ ...socials!, twitter: e.target.value })} />
                    <Input label="Instagram" value={socials?.instagram || ''} onChange={e => onUpdateSocials({ ...socials!, instagram: e.target.value })} />
                </div>
                <div className="flex justify-end sticky bottom-0 bg-white/80 backdrop-blur-sm p-4 -mx-4 border-t border-muted/50 mt-8">
                    <Button onClick={onSaveSocials} className="w-full sm:w-auto font-bold px-12 h-14 rounded-2xl shadow-lg" isLoading={loading}>
                        <Save sx={{ fontSize: 20, marginRight: 1 }} /> Save Socials
                    </Button>
                </div>
            </div>

            <div className="border-t border-muted pt-8">
                <h3 className="text-xl font-bold text-secondary mb-4">System Maintenance</h3>
                <div className="p-6 bg-destructive/5 rounded-2xl border border-destructive/20 space-y-4">
                    <div>
                        <h4 className="font-bold text-destructive mb-1">Reset Analytics</h4>
                        <p className="text-sm text-muted-foreground">Clear the public visitor counter. This action cannot be undone.</p>
                    </div>
                    <Button
                        onClick={handleResetVisitors}
                        className="bg-destructive hover:bg-destructive/90 text-white font-bold px-8 h-12 rounded-xl shadow-lg shadow-destructive/20"
                        isLoading={loading}
                    >
                        <Lock sx={{ fontSize: 18, marginRight: 1 }} /> Reset Visitor Count
                    </Button>
                </div>
            </div>
        </div>
    )
}
