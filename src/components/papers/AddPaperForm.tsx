import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { papersApi } from '../../lib/firebase/papers'
import { usersApi } from '../../lib/firebase/users'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { useLanguage } from '../../context/LanguageContext'
import { useFilters } from '../../context/FilterContext'
import { FileText, Save, ArrowLeft } from 'lucide-react'
import { Paper } from '../../lib/firebase/schema'
import { Snackbar, Alert } from '@mui/material'
import { auth } from '../../lib/firebase'
import { FileUploadSection } from './form/FileUploadSection'
import { PaperFormFields } from './form/PaperFormFields'

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
    const [year, setYear] = useState(paperToEdit?.year?.toString() || '')
    const [examType, setExamType] = useState(paperToEdit?.examType || '')
    const [part, setPart] = useState(paperToEdit?.part || '')
    const [language, setLanguage] = useState(paperToEdit?.language || 'English')

    const [loading, setLoading] = useState(false)
    const [changingFile, setChangingFile] = useState(false)
    const [feedback, setFeedback] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({
        open: false, message: '', severity: 'success'
    })

    useEffect(() => {
        if (dynamicFilters && !paperToEdit) {
            if (!language && dynamicFilters.languages?.length > 0) setLanguage(dynamicFilters.languages[0])
            if (!examType && dynamicFilters.categories?.length > 0) setExamType(dynamicFilters.categories[0])
            if (!part && dynamicFilters.parts?.length > 0) setPart(dynamicFilters.parts[0])
            if (year && dynamicFilters.years?.length > 0 && !dynamicFilters.years.includes(year.toString())) {
                setYear(dynamicFilters.years[0])
            }
        }
    }, [dynamicFilters, paperToEdit, language, examType, part, year])

    const handleAutoFill = (metadata: { title?: string, subject?: string, year?: number, examType?: string, part?: string, language?: string }) => {
        if (metadata.title) setTitle(metadata.title)
        if (metadata.subject) setSubject(metadata.subject)
        if (metadata.year) setYear(metadata.year.toString())
        if (metadata.examType) setExamType(metadata.examType)
        if (metadata.part) setPart(metadata.part)
        if (metadata.language) setLanguage(metadata.language)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if ((!file && !paperToEdit) || !title || !subject || !examType) {
            setFeedback({ open: true, message: 'Please fill in all required fields.', severity: 'error' })
            return
        }

        const currentUser = auth.currentUser
        const isSystemAdmin = localStorage.getItem('isSystemAdmin') === 'true'

        if (!currentUser && !isSystemAdmin) {
            setFeedback({ open: true, message: 'You must be logged in.', severity: 'error' })
            return
        }

        setLoading(true)
        try {
            if (paperToEdit) {
                const updates: Partial<Paper> = {
                    title: title.trim(),
                    subject,
                    year: parseInt(year),
                    examType,
                    part,
                    language
                }

                if (file && changingFile) {
                    const uploadResult = await papersApi.uploadFile(file, {
                        uid: currentUser?.uid || 'system-admin',
                        displayName: currentUser?.displayName || 'System Admin'
                    })
                    updates.fileUrl = uploadResult.url
                    updates.metadata = uploadResult.metadata
                }

                await papersApi.updatePaper(paperToEdit.id!, updates)
                setFeedback({ open: true, message: 'Paper updated successfully!', severity: 'success' })
                setTimeout(() => navigate('/admin'), 1500)
            } else {
                if (file) {
                    const exists = await papersApi.checkPaperExists(file.name)
                    if (exists) {
                        setFeedback({ open: true, message: 'A file with this name already exists.', severity: 'error' })
                        setLoading(false)
                        return
                    }

                    await papersApi.uploadPaper(
                        file,
                        { title, subject, year: parseInt(year), examType, part, language },
                        {
                            uid: currentUser?.uid || 'system-admin',
                            displayName: currentUser?.displayName || 'System Admin'
                        }
                    )

                    // Increment contributor's upload counter
                    if (currentUser?.uid) {
                        await usersApi.incrementPapersUploaded(currentUser.uid)
                    }

                    setFeedback({ open: true, message: t('addPaper.form.alerts.saveSuccess'), severity: 'success' })
                    setTimeout(() => navigate('/admin'), 1500)
                }
            }
        } catch (err: unknown) {
            console.error(err)
            const error = err as Error
            setFeedback({ open: true, message: error.message || 'Operation failed', severity: 'error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8 min-w-0 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="secondary"
                    onClick={() => navigate('/admin')}
                    className="h-12 w-12 rounded-full p-0 flex items-center justify-center bg-white shadow-sm hover:bg-slate-50"
                >
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-secondary tracking-tight">
                        {paperToEdit ? 'Edit Paper' : 'Add New Paper'}
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground font-medium">
                        {paperToEdit ? 'Update existing paper details' : 'Upload and catalogue a new past paper'}
                    </p>
                </div>
            </div>

            <Card className="p-4 sm:p-8 overflow-hidden max-w-4xl mx-auto shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Currently Editing Info */}
                    {paperToEdit && (
                        <div className="bg-primary/5 border-2 border-primary/20 rounded-3xl p-4 sm:p-6 space-y-4 shadow-inner">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary rounded-lg text-primary-foreground">
                                    <FileText size={20} />
                                </div>
                                <h3 className="font-bold text-lg text-secondary">Currently Editing Reference</h3>
                            </div>
                            {!changingFile ? (
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-foreground">Current File</p>
                                        <p className="text-xs text-muted-foreground truncate">{paperToEdit.metadata?.originalName}</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setChangingFile(true)}
                                        className="font-bold px-6 rounded-xl"
                                    >
                                        Change PDF
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                                    <p className="text-xs text-amber-600 font-bold italic">⚠️ Choose a replacement PDF below</p>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => { setChangingFile(false); setFile(null); }}
                                        className="font-bold text-muted-foreground rounded-xl"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* File Upload Section */}
                    {(!paperToEdit || changingFile) && (
                        <FileUploadSection
                            file={file}
                            onFileChange={setFile}
                            onAutoFill={handleAutoFill}
                            onSnackbar={(message, severity) => setFeedback({ open: true, message, severity })}
                            required={!paperToEdit}
                            dynamicFilters={dynamicFilters}
                        />
                    )}

                    <PaperFormFields
                        title={title} setTitle={setTitle}
                        subject={subject} setSubject={setSubject}
                        year={year} setYear={setYear}
                        examType={examType} setExamType={setExamType}
                        part={part} setPart={setPart}
                        language={language} setLanguage={setLanguage}
                        dynamicFilters={dynamicFilters}
                        t={t}
                    />

                    <Button type="submit" className="w-full h-16 rounded-2xl font-bold text-lg shadow-2xl shadow-primary/20 hover:-translate-y-1 transition-all" isLoading={loading}>
                        <Save className="mr-3" />
                        {paperToEdit ? 'Update Paper' : 'Publish Paper'}
                    </Button>
                </form>
            </Card>

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
