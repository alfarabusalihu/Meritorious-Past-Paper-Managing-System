import { Upload, FileText, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '../../ui/Button'
import { clsx } from 'clsx'
import { extractTextFromPDF, analyzePaperWithAI } from '../../../lib/utils/ai-extractor'
import { useState } from 'react'

interface FileUploadSectionProps {
    file: File | null;
    onFileChange: (file: File | null) => void;
    onAutoFill: (metadata: { title?: string, subject?: string, year?: number, examType?: string, part?: string, language?: string }) => void;
    onSnackbar: (message: string, severity: 'success' | 'error') => void;
    required?: boolean;
}

export function FileUploadSection({ file, onFileChange, onAutoFill, onSnackbar, required }: FileUploadSectionProps) {
    const [aiLoading, setAiLoading] = useState(false)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const selectedFile = e.target.files[0]
            if (selectedFile.type !== 'application/pdf') {
                onSnackbar('Only PDF files are allowed.', 'error')
                return
            }
            onFileChange(selectedFile)
        }
    }

    const handleAIAutoFill = async () => {
        if (!file) return
        setAiLoading(true)
        try {
            const text = await extractTextFromPDF(file)
            const metadata = await analyzePaperWithAI(text)
            onAutoFill(metadata)
            onSnackbar('AI Analysis complete!', 'success')
        } catch (err) {
            console.error(err)
            onSnackbar('AI failed to analyze this PDF. Manual entry required.', 'error')
        } finally {
            setAiLoading(false)
        }
    }

    return (
        <div className="relative group">
            <div className={clsx(
                "flex h-48 w-full flex-col items-center justify-center rounded-[2.5rem] border-4 border-dashed transition-all",
                file ? "border-primary/40 bg-primary/5" : "border-muted/30 bg-muted/5 group-hover:border-primary/40 group-hover:bg-primary/5"
            )}>
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="absolute inset-0 cursor-pointer opacity-0 z-10"
                    required={required}
                />
                {file ? (
                    <div className="flex flex-col items-center gap-4 text-primary text-center px-6 w-full z-20">
                        <div className="p-4 bg-primary rounded-2xl text-white">
                            <FileText size={36} />
                        </div>
                        <div className="min-w-0 max-w-full">
                            <span className="font-bold text-lg block truncate">{file.name}</span>
                            <div className="flex items-center justify-center gap-3 mt-2">
                                <Button
                                    type="button"
                                    onClick={handleAIAutoFill}
                                    disabled={aiLoading}
                                    className="bg-secondary text-secondary-foreground h-10 px-4 rounded-xl flex items-center gap-2 group transition-all"
                                >
                                    {aiLoading ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                                    )}
                                    <span className="font-bold text-xs uppercase tracking-widest">
                                        {aiLoading ? 'Analyzing...' : 'Auto-fill with AI'}
                                    </span>
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => onFileChange(null)}
                                    className="text-destructive h-10 px-4 rounded-xl font-bold text-xs uppercase"
                                >
                                    Discard
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 text-muted-foreground group-hover:text-primary transition-colors text-center">
                        <div className="p-4 bg-card rounded-2xl shadow-xl border border-muted group-hover:border-primary/30 transition-all">
                            <Upload size={32} />
                        </div>
                        <div className="space-y-1">
                            <span className="font-bold text-lg block">Click or Drag PDF to Upload</span>
                            <span className="font-bold text-xs text-muted-foreground/60 italic uppercase tracking-widest">Max 50MB</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
