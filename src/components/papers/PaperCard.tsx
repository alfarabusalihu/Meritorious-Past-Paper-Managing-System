import { FileText, Download, Eye, Calendar, User, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Paper } from '../../lib/firebase/schema'

interface PaperCardProps {
    paper: Paper
    onView?: (paper: Paper) => void
    isAdmin?: boolean
    onEdit?: () => void
    onDelete?: (paper: Paper) => void
}

export function PaperCard({ paper, onView, isAdmin, onEdit, onDelete }: PaperCardProps) {

    return (
        <div
            onClick={() => onView?.(paper)}
            className="group bg-card rounded-[2.5rem] border border-muted p-8 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden cursor-pointer"
        >
            {/* Admin Floating Controls (Top Right) */}
            {isAdmin && (
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

            {/* Decorative background blob */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

            <div className="space-y-6 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="p-4 bg-primary/5 rounded-2xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shadow-sm w-fit">
                        <FileText size={28} />
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-2 pr-12 md:pr-0">
                        <Badge variant="secondary" className="font-bold tracking-tight rounded-xl px-3 py-1 text-xs whitespace-nowrap">
                            {paper.examType}
                        </Badge>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors min-h-[3.5rem] break-words">
                        {paper.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground truncate">
                        <span className="text-primary/60">#</span>
                        <span className="truncate">{paper.subject}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/30 rounded-2xl">
                        <Calendar size={14} className="text-primary" />
                        {paper.year}
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/30 rounded-2xl min-w-0">
                        <User size={14} className="text-primary flex-shrink-0" />
                        <span className="truncate">{paper.metadata.uploaderName}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                    <div className="flex-1 font-bold rounded-2xl h-14 bg-primary/5 text-primary flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        <Eye size={20} />
                        View Paper
                    </div>
                    <a
                        href={paper.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 flex-shrink-0"
                        title="Download PDF"
                    >
                        <Download size={24} />
                    </a>
                </div>
            </div>
        </div>
    )
}
