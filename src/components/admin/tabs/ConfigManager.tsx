import { SocialConfig } from '../../../lib/firebase/configs'
import { statsApi } from '../../../lib/firebase/stats'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import { Save, RotateCcw } from 'lucide-react'

interface ConfigManagerProps {
    filterTexts: Record<string, string>;
    socials: SocialConfig | null;
    savingFilters: boolean;
    savingSocials: boolean;
    onUpdateFilterList: (key: string, value: string) => void;
    onUpdateSocials: (socials: SocialConfig) => void;
    onSaveFilters: () => void;
    onSaveSocials: () => void;
    onSnackbar: (message: string, severity: 'success' | 'error') => void;
}

export function ConfigManager({
    filterTexts,
    socials,
    savingFilters,
    savingSocials,
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
        <div className="space-y-12 pb-8">
            <section>
                <h3 className="text-xl font-bold text-secondary mb-2">Global Filters</h3>
                <p className="text-sm text-muted-foreground mb-6 font-medium">Manage the available options for subjects, languages, and years.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filterTexts && Object.keys(filterTexts).map((key) => (
                        <div key={key} className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1 block">{key}</label>
                            <textarea
                                className="w-full rounded-2xl border-muted bg-muted/10 p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 min-h-[120px] transition-all outline-none focus:bg-white"
                                value={filterTexts[key]}
                                onChange={(e) => onUpdateFilterList(key, e.target.value)}
                                placeholder={`Enter ${key} separated by commas...`}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-end mt-8">
                    <Button onClick={onSaveFilters} className="w-full sm:w-auto font-bold px-12 h-14 rounded-2xl shadow-xl shadow-primary/20" isLoading={savingFilters}>
                        <Save className="mr-2 h-5 w-5" /> Save Filter Config
                    </Button>
                </div>
            </section>

            <section className="border-t border-muted pt-12">
                <h3 className="text-xl font-bold text-secondary mb-6">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input label="Facebook" value={socials?.facebook || ''} onChange={e => onUpdateSocials({ ...socials!, facebook: e.target.value })} className="bg-muted/10 border-none h-14 rounded-2xl" />
                    <Input label="Twitter" value={socials?.twitter || ''} onChange={e => onUpdateSocials({ ...socials!, twitter: e.target.value })} className="bg-muted/10 border-none h-14 rounded-2xl" />
                    <Input label="Instagram" value={socials?.instagram || ''} onChange={e => onUpdateSocials({ ...socials!, instagram: e.target.value })} className="bg-muted/10 border-none h-14 rounded-2xl" />
                </div>
                <div className="flex justify-end mt-8">
                    <Button onClick={onSaveSocials} className="w-full sm:w-auto font-bold px-12 h-14 rounded-2xl shadow-xl shadow-primary/20" isLoading={savingSocials}>
                        <Save className="mr-2 h-5 w-5" /> Save Socials
                    </Button>
                </div>
            </section>

            <section className="border-t border-muted pt-12">
                <h3 className="text-xl font-bold text-secondary mb-6">System Maintenance</h3>
                <div className="p-8 bg-destructive/5 rounded-[2.5rem] border border-destructive/10 space-y-6">
                    <div>
                        <h4 className="font-bold text-destructive text-lg mb-1">Reset Analytics</h4>
                        <p className="text-sm text-muted-foreground font-medium">Clear the public visitor counter. This action cannot be undone.</p>
                    </div>
                    <Button
                        onClick={handleResetVisitors}
                        className="bg-destructive hover:bg-destructive/90 text-white font-bold px-10 h-14 rounded-2xl shadow-xl shadow-destructive/20"
                        isLoading={false} // Reset isn't tied to save states
                    >
                        <RotateCcw className="mr-2 h-5 w-5" /> Reset Visitor Count
                    </Button>
                </div>
            </section>
        </div>
    )
}
