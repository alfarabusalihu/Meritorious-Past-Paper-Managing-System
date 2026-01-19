import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Upload, FileText, ArrowLeft, Save } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card } from '../ui/Card'
import { papersApi } from '../../lib/firebase/papers'
import { auth } from '../../lib/firebase'
import { useLanguage } from '../../context/LanguageContext'
import { useFilters } from '../../context/FilterContext'
import { clsx } from 'clsx'
import { Snackbar, Alert } from '@mui/material'
import { Paper } from '../../lib/firebase/schema'

export function AddPaperForm() {
    const { t } = useLanguage()
    const { filters: dynamicFilters } = useFilters()
    const navigate = useNavigate()
    const location = useLocation()
    const paperToEdit = location.state?.paperToEdit as Paper | undefined

    // Form State
    const [file, setFile] = useState<File | null>(null)
    const [title, setTitle] = useState(paperToEdit?.title || '')
    const [subject, setSubject] = useState(paperToEdit?.subject || '')
    const [year, setYear] = useState(paperToEdit?.year || new Date().getFullYear())
    const [examType, setExamType] = useState(paperToEdit?.examType || '')
    const [part, setPart] = useState(paperToEdit?.part || '')
    const [language, setLanguage] = useState(paperToEdit?.language || '')

    const [loading, setLoading] = useState(false)
    const [changingFile, setChangingFile] = useState(false) // Track if user wants to change PDF in edit mode
    const [feedback, setFeedback] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({
        open: false, message: '', severity: 'success'
    })

    // Set defaults when filters load (only if not editing)
    useEffect(() => {
        if (dynamicFilters && !paperToEdit) {
            if (!language && dynamicFilters.languages?.length > 0) setLanguage(dynamicFilters.languages[0])
            if (!examType && dynamicFilters.categories?.length > 0) setExamType(dynamicFilters.categories[0])
            if (!part && dynamicFilters.parts?.length > 0) setPart(dynamicFilters.parts[0])
            if (year && dynamicFilters.years?.length > 0 && !dynamicFilters.years.includes(year.toString())) {
                setYear(parseInt(dynamicFilters.years[0]))
            }
        }
    }, [dynamicFilters, paperToEdit])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const selectedFile = e.target.files[0]

            // Strict PDF Check
            if (selectedFile.type !== 'application/pdf') {
                setFeedback({ open: true, message: 'Only PDF files are allowed.', severity: 'error' })
                return
            }

            setFile(selectedFile)

            // Smart Feature: Auto-Title
            // "2023_Science_Paper_1.pdf" -> "2023 Science Paper 1"
            const smartTitle = selectedFile.name.replace(/\.pdf$/i, '').replace(/[_-]/g, ' ')
            setTitle(smartTitle)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if ((!file && !paperToEdit) || !title || !subject || !examType) {
            setFeedback({ open: true, message: 'Please fill in all required fields.', severity: 'error' })
            return
        }

        const user = auth.currentUser
        const isSystemAdmin = localStorage.getItem('isSystemAdmin') === 'true'

        // Anti-Zombie check
        if (!user && !isSystemAdmin) {
            setFeedback({ open: true, message: 'You must be logged in.', severity: 'error' })
            return
        }
        if (isSystemAdmin && !user) {
            setFeedback({
                open: true,
                message: 'Admin session expired. Please logout and login again.',
                severity: 'error'
            })
            return
        }

        setLoading(true)
        try {
            if (paperToEdit) {
                // EDIT mode
                if (!title.trim()) {
                    setFeedback({ open: true, message: 'Title is required', severity: 'error' })
                    return
                }

                const updates: Partial<Paper> = {
                    title: title.trim(),
                    subject,
                    year,
                    examType,
                    part,
                    language
                }

                // If user is changing the file, upload new one
                if (file && changingFile) {
                    const uploadResult = await papersApi.uploadFile(file, {
                        uid: user?.uid || 'system-admin',
                        displayName: user?.displayName || 'System Admin'
                    })
                    updates.fileUrl = uploadResult.url
                    updates.metadata = uploadResult.metadata
                }

                await papersApi.updatePaper(paperToEdit.id!, updates)
                setFeedback({ open: true, message: 'Paper updated successfully!', severity: 'success' })
                setTimeout(() => navigate('/admin'), 1500)
            } else {
                // Create Mode
                // 1. Duplicate Check
                if (file) {
                    const exists = await papersApi.checkPaperExists(file.name)
                    if (exists) {
                        setFeedback({ open: true, message: 'A file with this name already exists in the archive.', severity: 'error' })
                        setLoading(false)
                        return
                    }

                    // 2. Upload
                    await papersApi.uploadPaper(
                        file,
                        { title, subject, year, examType, part, language },
                        {
                            uid: user?.uid || 'system-admin',
                            displayName: user?.displayName || 'System Admin'
                        }
                    )
                    setFeedback({ open: true, message: t('addPaper.form.alerts.saveSuccess'), severity: 'success' })
                }
            }
            setTimeout(() => navigate('/admin'), 1500)
        } catch (err: any) {
            console.error(err)
            setFeedback({ open: true, message: err.message || 'Operation failed', severity: 'error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4">
                <Button
                    variant="secondary"
                    onClick={() => navigate('/admin')}
                    className="h-12 w-12 rounded-full p-0 flex items-center justify-center bg-white shadow-sm hover:bg-slate-50"
                >
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-3xl font-black text-secondary tracking-tight">
                        {paperToEdit ? 'Edit Paper' : 'Add New Paper'}
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        {paperToEdit ? 'Update existing paper details' : 'Upload and catalogue a new past paper'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-6">
                    <Card className="p-8 space-y-8">
                        {/* Current Paper Info (Edit Mode) */}
                        {paperToEdit && (
                            <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-6 space-y-3" role="status" aria-label="Editing existing paper">
                                <div className="flex items-center gap-3 mb-4">
                                    <FileText className="text-primary" size={24} aria-hidden="true" />
                                    <div>
                                        <h3 className="font-black text-lg text-secondary">Currently Editing</h3>
                                        <p className="text-xs font-medium text-muted-foreground">Original paper details loaded</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-primary font-bold">Original Title:</span>
                                        <p className="text-foreground font-medium">{paperToEdit.title}</p>
                                    </div>
                                    <div>
                                        <span className="text-primary font-bold">File:</span>
                                        <p className="text-foreground font-medium">{paperToEdit.metadata?.originalName || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* Current PDF File Display */}
                                {!changingFile && (
                                    <div className="mt-4 border-t border-primary/20 pt-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <FileText className="text-primary" size={18} />
                                                <div>
                                                    <p className="text-sm font-bold text-foreground">Current PDF</p>
                                                    <p className="text-xs text-muted-foreground">{paperToEdit.metadata?.originalName}</p>
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => setChangingFile(true)}
                                                className="font-bold"
                                            >
                                                Change File
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {changingFile && (
                                    <div className="mt-4 border-t border-primary/20 pt-4">
                                        <p className="text-xs text-muted-foreground mb-3 italic">
                                            ⚠️ Uploading a new file will replace the existing PDF.
                                        </p>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setChangingFile(false)
                                                setFile(null)
                                            }}
                                            className="font-bold text-muted-foreground"
                                        >
                                            Cancel File Change
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* File Upload Section */}
                        {(!paperToEdit || changingFile) && (
                            <div className="relative group">
                                <div className={clsx(
                                    "flex h-48 w-full flex-col items-center justify-center rounded-[2rem] border-4 border-dashed transition-all",
                                    file ? "border-primary/40 bg-primary/5" : "border-muted bg-muted/5 group-hover:border-primary/40 group-hover:bg-primary/5"
                                )}>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 cursor-pointer opacity-0 z-10"
                                        required={!paperToEdit}
                                    />
                                    {file ? (
                                        <div className="flex flex-col items-center gap-4 text-primary text-center px-6">
                                            <div className="p-3 bg-primary rounded-full text-white shadow-xl shadow-primary/20">
                                                <FileText size={32} />
                                            </div>
                                            <div>
                                                <span className="font-black text-lg block truncate max-w-[400px]">{file.name}</span>
                                                <span className="text-sm font-bold text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-4 text-muted-foreground group-hover:text-primary transition-colors text-center">
                                            <div className="p-3 bg-card rounded-full shadow-xl border border-muted group-hover:border-primary/30 transition-all">
                                                <Upload size={28} />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="font-black text-lg block">Click to upload PDF</span>
                                                <span className="font-bold text-xs text-muted-foreground/60 italic uppercase tracking-widest">Max 50MB</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            <Input
                                label={t('addPaper.form.name')}
                                placeholder={t('addPaper.form.placeholder.name')}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 px-1">{t('addPaper.form.subject')}</label>
                                <select
                                    className="h-12 w-full rounded-2xl border-none bg-muted/30 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
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
                    </Card>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <Card className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">{t('addPaper.form.year')}</label>
                            <select
                                className="h-12 w-full rounded-2xl border-none bg-muted/30 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                                value={year}
                                onChange={(e) => setYear(parseInt(e.target.value))}
                                required
                            >
                                <option value="" disabled>Select Year</option>
                                {((dynamicFilters?.years as string[]) || []).map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">{t('addPaper.form.category')}</label>
                            <select
                                className="h-12 w-full rounded-2xl border-none bg-muted/30 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
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

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Part / Component</label>
                            <div className="grid grid-cols-2 gap-2">
                                {((dynamicFilters?.parts as string[]) || []).map(p => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setPart(p)}
                                        className={clsx(
                                            "py-3 px-2 rounded-xl text-xs font-black transition-all border-2",
                                            part === p ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted/30 border-transparent text-muted-foreground hover:bg-muted/50"
                                        )}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Language</label>
                            <select
                                className="h-12 w-full rounded-2xl border-none bg-muted/30 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
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
                    </Card>
                </div>

                {/* Submit Button at Bottom */}
                <div className="lg:col-span-12">
                    <Button type="submit" className="w-full h-16 rounded-[2rem] font-black text-xl shadow-2xl shadow-primary/20 hover:-translate-y-1 transition-all" isLoading={loading}>
                        <Save className="mr-3" />
                        {paperToEdit ? 'Update Paper Details' : t('addPaper.form.submit.publish')}
                    </Button>
                </div>
            </form>

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
