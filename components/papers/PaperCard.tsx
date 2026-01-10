"use client";

import { Paper } from '@/types/paper';
import { FileText, Calendar, User, ArrowRight, BookOpen, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

interface PaperCardProps {
    paper: Paper;
    onClick?: (paper: Paper) => void;
    onEdit?: (paper: Paper) => void;
    onDelete?: (paper: Paper) => void;
}

export default function PaperCard({ paper }: PaperCardProps) {
    const { user } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Allow any logged in user to see edit button, as per "any logged user can edit/create/remove"
    const canEdit = !!user;

    const handleCardClick = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('view', paper.paperId);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`${ROUTES.ADD_PAPER}?edit=${paper.paperId}`);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            className="group relative bg-muted/20 border border-muted rounded-[2rem] p-6 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer overflow-hidden"
            onClick={handleCardClick}
        >
            {/* Action Buttons (Any Logged User) */}
            {canEdit && (
                <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                        onClick={handleEditClick}
                        className="p-2 bg-background border hover:border-primary hover:text-primary rounded-xl transition-all shadow-sm"
                        title={t('papers.card.edit')}
                    >
                        <Edit2 className="h-4 w-4" />
                    </button>
                    {/* Delete button removed as requested. User must delete from the Edit page. */}
                </div>
            )}

            <div className="space-y-6">
                <div className="flex items-start justify-between">
                    <div className="p-4 bg-primary/10 rounded-[1.25rem] text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground shadow-inner">
                        <FileText className="h-7 w-7" />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                            {paper.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                            {paper.part}
                        </span>
                    </div>
                    <h3 className="text-xl font-black text-secondary group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {paper.paperName}
                    </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
                        <BookOpen className="h-4 w-4" />
                        <span className="truncate">{paper.subject}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
                        <Calendar className="h-4 w-4" />
                        <span>{paper.year}</span>
                    </div>
                </div>

                <div className="pt-6 border-t border-muted flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-secondary/10 flex items-center justify-center">
                            <User className="h-3 w-3 text-secondary" />
                        </div>
                        <span className="text-xs font-bold text-muted-foreground">
                            {t('papers.card.addedBy')} <span className="text-secondary">{paper.addedBy}</span>
                        </span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
            </div>
        </motion.div>
    );
}
