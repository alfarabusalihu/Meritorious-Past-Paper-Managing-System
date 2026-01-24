
import { Upload, FileText, Sparkles } from 'lucide-react'
import { Button } from '../../ui/Button'
import { clsx } from 'clsx'
import { FilterConfig } from '../../../lib/firebase/configs'
import { toSentenceCase } from '../../../lib/utils/string'

interface FileUploadSectionProps {
    file: File | null;
    onFileChange: (file: File | null) => void;
    onAutoFill: (metadata: { title?: string, subject?: string, year?: number, language?: string }) => void;
    onSnackbar: (message: string, severity: 'success' | 'error') => void;
    required?: boolean;
    dynamicFilters: FilterConfig | null;
    progress?: number;
    existingFileName?: string; // For edit mode
    onChangeFile?: () => void; // Callback when user wants to change existing file
}

export function FileUploadSection({ file, onFileChange, onAutoFill, onSnackbar, required, progress, existingFileName, onChangeFile }: FileUploadSectionProps) {
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

    const handleAutoFill = () => {
        if (!file) return

        // Basic Filename Extraction with Sentence Case
        const filename = file.name.replace(/\.[^/.]+$/, "")
        const formattedTitle = toSentenceCase(filename)
        onAutoFill({ title: formattedTitle })
        onSnackbar('Used formatted filename as title.', 'success')
    }

    return (
        <div className="relative group">
            {/* Show existing file info when editing and no new file selected */}
            {existingFileName && !file ? (
                <div className="flex h-48 w-full flex-col items-center justify-center rounded-[2.5rem] border-4 border-primary/40 bg-primary/5">
                    <div className="flex flex-col items-center gap-4 text-primary text-center px-6 w-full">
                        <div className="p-4 bg-primary rounded-2xl text-white">
                            <FileText size={36} />
                        </div>
                        <div className="min-w-0 max-w-full space-y-3">
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Current File</p>
                                <span className="font-bold text-sm block truncate mt-1">{existingFileName}</span>
                            </div>
                            <Button
                                type="button"
                                onClick={onChangeFile}
                                className="bg-secondary text-secondary-foreground h-10 px-6 rounded-xl font-bold text-xs uppercase tracking-widest"
                            >
                                Change File
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
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
                                        onClick={handleAutoFill}
                                        className="bg-secondary text-secondary-foreground h-10 px-4 rounded-xl flex items-center gap-2 group transition-all"
                                    >
                                        <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                                        <span className="font-bold text-xs uppercase tracking-widest">
                                            Use Filename
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
                    {/* Progress Overlay */}
                    {progress !== undefined && progress > 0 && progress < 100 && (
                        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/90 rounded-[2.5rem] backdrop-blur-sm">
                            <div className="w-1/2 h-4 bg-muted rounded-full overflow-hidden border border-muted-foreground/10">
                                <div
                                    className="h-full bg-primary transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="mt-4 font-black text-primary text-xl tabular-nums">
                                {Math.round(progress)}%
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                                Uploading Content...
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
