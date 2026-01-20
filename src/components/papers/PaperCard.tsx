import { FileText, Download, Eye, Calendar, User } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
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
        <div className="group bg-card rounded-[2.5rem] border border-muted p-8 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
            {/* Decorative background blob */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

            <div className="space-y-6 relative z-10">
                <div className="flex items-start justify-between">
                    <div className="p-4 bg-primary/5 rounded-2xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shadow-sm">
                        <FileText size={28} />
                    </div>
                    <Badge variant="secondary" className="font-bold tracking-tight rounded-xl px-3 py-1 text-xs">
                        {paper.examType}
                    </Badge>
                </div>

                <div className="space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors min-h-[3.5rem]">
                        {paper.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                        <span className="text-primary/60">#</span>
                        {paper.subject}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/30 rounded-2xl">
                        <Calendar size={14} className="text-primary" />
                        {paper.year}
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/30 rounded-2xl truncate">
                        <User size={14} className="text-primary" />
                        {paper.metadata.uploaderName}
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <Button
                        onClick={() => onView?.(paper)}
                        className="flex-1 font-bold rounded-2xl h-14 shadow-lg shadow-primary/20 text-base"
                    >
                        <Eye size={20} className="mr-2" />
                        View
                    </Button>
                    <a
                        href={paper.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
                        title="Download PDF"
                    >
                        <Download size={24} />
                    </a>
                </div>
            </div>

            {/* Admin Overlay Controls */}
            {isAdmin && (
                <div
                    className="absolute inset-0 z-20 bg-secondary/80 backdrop-blur-sm rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4"
                >
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.();
                        }}
                        className="font-bold rounded-xl bg-white text-secondary hover:bg-slate-100"
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(paper);
                        }}
                        className="font-bold rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Delete
                    </Button>
                </div>
            )}
        </div>
    )
}
