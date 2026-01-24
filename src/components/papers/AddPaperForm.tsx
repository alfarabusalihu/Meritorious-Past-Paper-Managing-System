import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { papersApi } from '../../lib/firebase/papers'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { useLanguage } from '../../context/LanguageContext'
import { useFilters } from '../../context/FilterContext'
import { FileText, Save, ArrowLeft } from 'lucide-react'
import { Paper } from '../../lib/firebase/schema'
import { Alert } from '../ui/Alert'
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
    const [part1File, setPart1File] = useState<File | null>(null)
    const [part2File, setPart2File] = useState<File | null>(null)
    const [schemeFile, setSchemeFile] = useState<File | null>(null)

    const [title, setTitle] = useState(paperToEdit?.title || '')
    const [subject, setSubject] = useState(paperToEdit?.subject || '')
    const [year, setYear] = useState(paperToEdit?.year?.toString() || '')
    const [language, setLanguage] = useState(paperToEdit?.language || 'English')

    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState<{ [key: string]: number }>({})
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
    const [feedback, setFeedback] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({
        open: false, message: '', severity: 'success'
    })

    // Track which files user wants to change when editing
    const [changingPart1, setChangingPart1] = useState(false)
    const [changingPart2, setChangingPart2] = useState(false)
    const [changingScheme, setChangingScheme] = useState(false)

    // Helper to extract filename from URL
    const getFilenameFromUrl = (url: string) => {
        try {
            const decoded = decodeURIComponent(url)
            const parts = decoded.split('/')
            const filename = parts[parts.length - 1].split('?')[0]
            return filename.replace(/^\d+_/, '') // Remove timestamp prefix
        } catch {
            return 'Uploaded file'
        }
    }

    useEffect(() => {
        if (dynamicFilters && !paperToEdit) {
            if (!language && dynamicFilters.languages?.length > 0) setLanguage(dynamicFilters.languages[0])
            if (year && dynamicFilters.years?.length > 0 && !dynamicFilters.years.includes(year.toString())) {
                setYear(dynamicFilters.years[0])
            }
        }
    }, [dynamicFilters, paperToEdit, language, year])

    const handleAutoFill = (metadata: { title?: string }) => {
        if (metadata.title) {
            // Set title if empty
            if (!title) setTitle(metadata.title)
        }
    }


    const validateForm = () => {
        const errors: { [key: string]: string } = {}
        let isValid = true

        if (!title.trim()) {
            errors.title = 'Title is required'
            isValid = false
        }
        if (!subject) {
            errors.subject = 'Subject is required'
            isValid = false
        }
        if (!year) {
            errors.year = 'Year is required'
            isValid = false
        }
        if (!language) {
            errors.language = 'Language is required'
            isValid = false
        }

        // File validation (at least one file required for new papers)
        if (!paperToEdit && !part1File && !part2File && !schemeFile) {
            setFeedback({ open: true, message: 'Please upload at least one file.', severity: 'error' })
            isValid = false
        }

        setValidationErrors(errors)
        return isValid
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            // Also show generic error snackbar if fields are missing
            if (Object.keys(validationErrors).length > 0) {
                setFeedback({ open: true, message: 'Please fill in all required fields.', severity: 'error' })
            }
            return
        }

        const currentUser = auth.currentUser
        if (!currentUser) {
            setFeedback({ open: true, message: 'You must be logged in.', severity: 'error' })
            return
        }

        setLoading(true)
        setProgress({})

        try {
            const uploadConfig = {
                uid: currentUser?.uid || 'system-admin',
                displayName: currentUser?.displayName || 'System Admin'
            }

            // Helper to upload if file exists
            const activeFiles: { part1?: string, part2?: string, scheme?: string } = paperToEdit?.files ? { ...paperToEdit.files } : {}

            // 1. Collect all valid files
            const filesToUpload: { key: string, file: File }[] = [];
            if (part1File) filesToUpload.push({ key: 'part1', file: part1File });
            if (part2File) filesToUpload.push({ key: 'part2', file: part2File });
            if (schemeFile) filesToUpload.push({ key: 'scheme', file: schemeFile });

            // 2. Sort by size (Smallest First)
            filesToUpload.sort((a, b) => a.file.size - b.file.size);

            // 3. Sequential Upload (Strictly 1 at a time)
            const totalFiles = filesToUpload.length;
            let completedFiles = 0;

            for (const item of filesToUpload) {
                // Update local progress to show WHICH file is currently uploading
                setProgress(prev => ({ ...prev, [item.key]: 0 }));

                const res = await papersApi.uploadFile(item.file, uploadConfig, (percentage) => {
                    // (Completed Files + Current File Percentage) / Total Files

                    // Keep local progress for the UI checkmarks
                    setProgress(prev => ({ ...prev, [item.key]: percentage }));
                });

                activeFiles[item.key as keyof typeof activeFiles] = res.url;
                completedFiles++;
            }

            // Ensure 100% at the end

            const paperData: any = {
                title: title.trim(),
                subject,
                year: parseInt(year),
                language,
                files: activeFiles
            }

            if (paperToEdit) {
                await papersApi.updatePaper(paperToEdit.id!, paperData)
                setFeedback({ open: true, message: 'Paper updated successfully!', severity: 'success' })
            } else {
                await papersApi.createPaper({
                    ...paperData,
                    metadata: {
                        uploadedBy: uploadConfig.uid,
                        uploaderName: uploadConfig.displayName,
                        originalName: part1File?.name || part2File?.name || schemeFile?.name || 'unknown'
                    }
                })

                setFeedback({ open: true, message: 'Paper created successfully!', severity: 'success' })
            }

            setTimeout(() => navigate('/admin'), 1500)

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

            <Card className="p-4 sm:p-8 overflow-hidden max-w-5xl mx-auto shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-10">

                    {/* Multi-File Upload Grid */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg text-secondary flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Upload Files
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block text-center">Part 1 (Question)</span>
                                <FileUploadSection
                                    file={part1File}
                                    onFileChange={setPart1File}
                                    onAutoFill={(m) => handleAutoFill(m)}
                                    onSnackbar={(m, s) => setFeedback({ open: true, message: m, severity: s })}
                                    required={!paperToEdit && !part1File && !part2File && !schemeFile}
                                    dynamicFilters={dynamicFilters}
                                    progress={progress.part1}
                                    existingFileName={paperToEdit?.files?.part1 && !changingPart1 ? getFilenameFromUrl(paperToEdit.files.part1) : undefined}
                                    onChangeFile={() => setChangingPart1(true)}
                                />
                            </div>
                            <div className="space-y-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block text-center">Part 2 (Question)</span>
                                <FileUploadSection
                                    file={part2File}
                                    onFileChange={setPart2File}
                                    onAutoFill={(m) => handleAutoFill(m)}
                                    onSnackbar={(m, s) => setFeedback({ open: true, message: m, severity: s })}
                                    required={false}
                                    dynamicFilters={dynamicFilters}
                                    progress={progress.part2}
                                    existingFileName={paperToEdit?.files?.part2 && !changingPart2 ? getFilenameFromUrl(paperToEdit.files.part2) : undefined}
                                    onChangeFile={() => setChangingPart2(true)}
                                />
                            </div>
                            <div className="space-y-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block text-center">Marking Scheme</span>
                                <FileUploadSection
                                    file={schemeFile}
                                    onFileChange={setSchemeFile}
                                    onAutoFill={(m) => handleAutoFill(m)}
                                    onSnackbar={(m, s) => setFeedback({ open: true, message: m, severity: s })}
                                    required={false}
                                    dynamicFilters={dynamicFilters}
                                    progress={progress.scheme}
                                    existingFileName={paperToEdit?.files?.scheme && !changingScheme ? getFilenameFromUrl(paperToEdit.files.scheme) : undefined}
                                    onChangeFile={() => setChangingScheme(true)}
                                />
                            </div>
                        </div>
                    </div>

                    <PaperFormFields
                        title={title} setTitle={setTitle}
                        subject={subject} setSubject={setSubject}
                        year={year} setYear={setYear}
                        language={language} setLanguage={setLanguage}
                        dynamicFilters={dynamicFilters}
                        t={t}
                        errors={validationErrors}
                    />

                    <Button type="submit" className="w-full h-16 rounded-2xl font-bold text-lg shadow-2xl shadow-primary/20 hover:-translate-y-1 transition-all" isLoading={loading}>
                        <Save className="mr-3" />
                        {paperToEdit ? 'Update Paper' : 'Publish Paper'}
                    </Button>
                </form>
            </Card>

            {feedback.open && (
                <div className="fixed bottom-8 right-8 z-[110] w-full max-w-md px-4 animate-in slide-in-from-bottom-4">
                    <Alert
                        severity={feedback.severity}
                        onClose={() => setFeedback({ ...feedback, open: false })}
                    >
                        {feedback.message}
                    </Alert>
                </div>
            )}
        </div>
    )
}
