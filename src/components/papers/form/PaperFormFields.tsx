import { FilterConfig } from '../../../lib/firebase/configs'
import { Input } from '../../ui/Input'
import { clsx } from 'clsx'

interface PaperFormFieldsProps {
    title: string;
    setTitle: (val: string) => void;
    subject: string;
    setSubject: (val: string) => void;
    year: string;
    setYear: (val: string) => void;
    examType: string;
    setExamType: (val: string) => void;
    part: string;
    setPart: (val: string) => void;
    language: string;
    setLanguage: (val: string) => void;
    dynamicFilters: FilterConfig | null;
    t: (key: string) => string;
}

export function PaperFormFields({
    title, setTitle,
    subject, setSubject,
    year, setYear,
    examType, setExamType,
    part, setPart,
    language, setLanguage,
    dynamicFilters,
    t
}: PaperFormFieldsProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-6">
                <Input
                    label={t('addPaper.form.name')}
                    placeholder={t('addPaper.form.placeholder.name')}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-1">{t('addPaper.form.subject')}</label>
                    <select
                        className="h-12 w-full rounded-2xl border-none bg-muted/30 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                    >
                        <option value="">{t('addPaper.form.placeholder.subject')}</option>
                        {((dynamicFilters?.subjects as string[]) || []).slice().sort().map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{t('addPaper.form.year')}</label>
                    <select
                        className="h-12 w-full rounded-2xl border-none bg-muted/30 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        required
                    >
                        <option value="">Select Year</option>
                        {((dynamicFilters?.years as string[]) || []).slice().sort((a, b) => parseInt(b) - parseInt(a)).map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{t('addPaper.form.category')}</label>
                    <select
                        className="h-12 w-full rounded-2xl border-none bg-muted/30 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                        value={examType}
                        onChange={(e) => setExamType(e.target.value)}
                        required
                    >
                        <option value="">Select Category</option>
                        {((dynamicFilters?.categories as string[]) || []).map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Part / Component</label>
                    <div className="grid grid-cols-2 gap-2">
                        {((dynamicFilters?.parts as string[]) || []).map(p => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setPart(p)}
                                className={clsx(
                                    "py-3 px-2 rounded-xl text-xs font-bold transition-all border-2",
                                    part === p ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted/30 border-transparent text-muted-foreground hover:bg-muted/50"
                                )}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Language</label>
                    <select
                        className="h-12 w-full rounded-2xl border-none bg-muted/30 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        required
                    >
                        <option value="">Select Language</option>
                        {((dynamicFilters?.languages as string[]) || []).map(l => (
                            <option key={l} value={l}>{l}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}
