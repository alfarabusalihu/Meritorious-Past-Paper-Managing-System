import { FileText, Pencil, Trash2 } from 'lucide-react'
import { Paper } from '../../lib/firebase/schema'
import { useLanguage } from '../../context/LanguageContext'
import { clsx } from 'clsx'

interface PaperCardProps {
    paper: Paper
    onView?: (paper: Paper, url: string) => void
    isSuperAdmin?: boolean
    onEdit?: () => void
    onDelete?: (paper: Paper) => void
}

export function PaperCard({ paper, onView, isSuperAdmin, onEdit, onDelete }: PaperCardProps) {
    const { language: currentLanguage } = useLanguage()

    // Helper to get file URL from new files object
    const getFileUrl = (key: 'part1' | 'part2' | 'scheme') => {
        return paper.files && paper.files[key] ? paper.files[key] : null;
    }

    const hasPart1 = !!getFileUrl('part1');
    const hasPart2 = !!getFileUrl('part2');
    const hasScheme = !!getFileUrl('scheme');

    const defaultUrl = getFileUrl('part1') || getFileUrl('part2') || getFileUrl('scheme');

    return (
        <div
            onClick={() => defaultUrl && onView?.(paper, defaultUrl)}
            className="group bg-primary-foreground rounded-[2.5rem] border border-muted-foreground/10 p-8 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden flex flex-col min-h-[320px] cursor-pointer"
        >
            {/* Admin Floating Controls (Top Right) */}
            {isSuperAdmin && (
                <div className="absolute top-4 right-4 z-30 flex gap-2.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform translate-x-0 md:translate-x-4 md:group-hover:translate-x-0">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.();
                        }}
                        className="p-3 bg-white/95 backdrop-blur-md rounded-2xl text-secondary shadow-xl hover:bg-primary hover:text-white transition-all transform hover:scale-110 active:scale-90 border border-muted"
                        title="Edit Paper"
                    >
                        <Pencil size={18} strokeWidth={2.5} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(paper);
                        }}
                        className="p-3 bg-white/95 backdrop-blur-md rounded-2xl text-destructive shadow-xl hover:bg-destructive hover:text-white transition-all transform hover:scale-110 active:scale-90 border border-muted"
                        title="Delete Paper"
                    >
                        <Trash2 size={18} strokeWidth={2.5} />
                    </button>
                </div>
            )}

            {/* Decorative background blobs */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 group-hover:scale-150 transition-all duration-500" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 group-hover:scale-150 transition-all duration-500 opacity-0 group-hover:opacity-100" />

            {/* Bottom gradient border */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex flex-col flex-grow relative z-10">
                <div className="flex flex-col items-start gap-4 mb-4">
                    {/* 1. Document Icon - Bigger & Hover Color Change */}
                    <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-300 w-fit shadow-none">
                        <FileText size={48} strokeWidth={1.5} />
                    </div>

                    {/* 2. Paper Name */}
                    <h3 className="text-xl font-bold tracking-tight text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors break-words w-full">
                        {paper.title}
                    </h3>
                </div>

                {/* 3. Tags - Subject expands, others wrap */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <span className="w-fit px-4 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest border border-primary/10 text-center">
                        {paper.subject}
                    </span>
                    <span className="w-24 py-1 bg-secondary/10 text-secondary text-[10px] font-black rounded-full uppercase tracking-widest border border-secondary/10 text-center truncate">
                        {paper.year}
                    </span>
                    <span className="w-24 py-1 bg-blue-500/10 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-500/10 text-center truncate">
                        {paper.language}
                    </span>
                </div>

                {/* Divider - Visible only on hover */}
                <div className="h-px w-full bg-primary/50 mt-auto mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* 4. Action Buttons (Selection Bullets) */}
                <div className="grid grid-cols-3 gap-2">
                    {hasPart1 ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onView?.(paper, getFileUrl('part1')!);
                            }}
                            className={clsx(
                                "flex items-center justify-center h-10 rounded-xl bg-secondary/5 text-secondary font-bold hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-md border border-secondary/10 hover:border-transparent uppercase tracking-wider",
                                currentLanguage === 'ta' ? 'text-[9px]' : 'text-[10px]'
                            )}
                            aria-label={`View Part 1 of ${paper.title}`}
                        >
                            Part 1
                        </button>
                    ) : (
                        <div className={clsx(
                            "flex items-center justify-center h-10 rounded-xl bg-muted/20 text-muted-foreground/40 cursor-not-allowed border border-dashed border-muted font-bold uppercase tracking-wider",
                            currentLanguage === 'ta' ? 'text-[9px]' : 'text-[10px]'
                        )} aria-hidden="true">
                            Part 1
                        </div>
                    )}

                    {hasPart2 ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onView?.(paper, getFileUrl('part2')!);
                            }}
                            className={clsx(
                                "flex items-center justify-center h-10 rounded-xl bg-secondary/5 text-secondary font-bold hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-md border border-secondary/10 hover:border-transparent uppercase tracking-wider",
                                currentLanguage === 'ta' ? 'text-[9px]' : 'text-[10px]'
                            )}
                            aria-label={`View Part 2 of ${paper.title}`}
                        >
                            Part 2
                        </button>
                    ) : (
                        <div className={clsx(
                            "flex items-center justify-center h-10 rounded-xl bg-muted/20 text-muted-foreground/40 cursor-not-allowed border border-dashed border-muted font-bold uppercase tracking-wider",
                            currentLanguage === 'ta' ? 'text-[9px]' : 'text-[10px]'
                        )} aria-hidden="true">
                            Part 2
                        </div>
                    )}

                    {hasScheme ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onView?.(paper, getFileUrl('scheme')!);
                            }}
                            className={clsx(
                                "flex items-center justify-center h-10 rounded-xl bg-primary/10 text-primary font-bold hover:bg-secondary hover:text-white transition-all shadow-sm hover:shadow-md border border-primary/10 hover:border-transparent uppercase tracking-wider",
                                currentLanguage === 'ta' ? 'text-[9px]' : 'text-[10px]'
                            )}
                            aria-label={`View Marking Scheme of ${paper.title}`}
                        >
                            Scheme
                        </button>
                    ) : (
                        <div className={clsx(
                            "flex items-center justify-center h-10 rounded-xl bg-muted/20 text-muted-foreground/40 cursor-not-allowed border border-dashed border-muted font-bold uppercase tracking-wider",
                            currentLanguage === 'ta' ? 'text-[9px]' : 'text-[10px]'
                        )} aria-hidden="true">
                            Scheme
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
