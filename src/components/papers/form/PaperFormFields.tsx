import { FilterConfig } from '../../../lib/firebase/configs'
import { Input } from '../../ui/Input'
import { X } from 'lucide-react'

interface PaperFormFieldsProps {
    title: string;
    setTitle: (val: string) => void;
    subject: string;
    setSubject: (val: string) => void;
    year: string;
    setYear: (val: string) => void;
    language: string;
    setLanguage: (val: string) => void;
    dynamicFilters: FilterConfig | null;
    t: (key: string) => string;
    errors: { [key: string]: string };
}

export function PaperFormFields({
    title, setTitle,
    subject, setSubject,
    year, setYear,
    language, setLanguage,
    dynamicFilters,
    t,
    errors
}: PaperFormFieldsProps) {
    return (
        <div className="space-y-10">
            <div className="space-y-6">
                <Input
                    label={t('addPaper.form.name')}
                    placeholder={t('addPaper.form.placeholder.name')}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    error={errors.title}
                    className="h-14"
                    endIcon={title ? (
                        <button
                            type="button"
                            onClick={() => setTitle('')}
                            className="p-1 hover:bg-muted rounded-full transition-colors"
                            title="Reset Title"
                        >
                            <X size={16} />
                        </button>
                    ) : undefined}
                />

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1">{t('addPaper.form.subject')}</label>
                    <div className="relative">
                        <select
                            className={`h-14 w-full rounded-2xl border border-muted-foreground/20 bg-muted/50 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all appearance-none cursor-pointer ${errors.subject ? 'ring-2 ring-destructive/20 border-destructive/50' : ''}`}
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        >
                            <option value="">{t('addPaper.form.placeholder.subject')}</option>
                            {((dynamicFilters?.subjects as string[]) || []).slice().sort().map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    {errors.subject && <p className="text-xs text-destructive px-1">{errors.subject}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1">{t('addPaper.form.year')}</label>
                    <select
                        className={`h-14 w-full rounded-2xl border border-muted-foreground/20 bg-muted/50 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all cursor-pointer ${errors.year ? 'ring-2 ring-destructive/20 border-destructive/50' : ''}`}
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    >
                        <option value="">Select Year</option>
                        {((dynamicFilters?.years as string[]) || []).slice().sort((a, b) => parseInt(b) - parseInt(a)).map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                    {errors.year && <p className="text-xs text-destructive px-1">{errors.year}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1">Language</label>
                    <select
                        className={`h-14 w-full rounded-2xl border border-muted-foreground/20 bg-muted/50 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all cursor-pointer ${errors.language ? 'ring-2 ring-destructive/20 border-destructive/50' : ''}`}
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        <option value="">Select Language</option>
                        {((dynamicFilters?.languages as string[]) || []).map(l => (
                            <option key={l} value={l}>{l}</option>
                        ))}
                    </select>
                    {errors.language && <p className="text-xs text-destructive px-1">{errors.language}</p>}
                </div>
            </div>
        </div>
    )
}
