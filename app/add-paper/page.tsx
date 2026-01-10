"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { ROUTES } from '@/constants/routes';
import {
    CATEGORY_OPTIONS,
    PART_OPTIONS,
    SUBJECT_OPTIONS,
    YEAR_OPTIONS,
    LANGUAGE_OPTIONS
} from '@/constants/filters';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from 'next/link';
import { Save, Loader2, File, AlertCircle, ArrowLeft, Trash2 } from "lucide-react";
import { calculateHash } from "@/lib/crypto-utils";
import PdfDropzone from '@/components/upload/PdfDropzone';

// Form Schema
const paperSchema = z.object({
    paperName: z.string().min(2, "Paper name must be at least 2 characters."),
    subject: z.string().min(1, "Please select a subject."),
    year: z.string().min(1, "Please select a year."),
    category: z.string().min(1, "Please select a category."),
    part: z.string().min(1, "Please select a part."),
    language: z.string().min(1, "Please select a language."),
});

type PaperFormValues = z.infer<typeof paperSchema>;

function AddPaperContent() {
    const { user, isLoading: authLoading } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const editId = searchParams.get('edit');

    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetching, setIsFetching] = useState(!!editId);
    const [existingPdfUrl, setExistingPdfUrl] = useState<string>('');

    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

    const form = useForm<PaperFormValues>({
        resolver: zodResolver(paperSchema),
        defaultValues: {
            paperName: "",
            subject: "",
            year: new Date().getFullYear().toString(),
            category: CATEGORY_OPTIONS[0],
            part: PART_OPTIONS[0],
            language: "English",
        },
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push(ROUTES.AUTH);
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (editId) {
            const fetchPaperData = async () => {
                try {
                    const response = await fetch(`/api/papers`);
                    const allPapers = await response.json();
                    const paper = allPapers.find((p: any) => p.paperId === editId);
                    if (paper) {
                        form.reset({
                            paperName: paper.paperName,
                            subject: paper.subject,
                            year: paper.year.toString(),
                            category: paper.category,
                            part: paper.part,
                            language: paper.language || 'English',
                        });
                        if (paper.pdfUrl) {
                            setExistingPdfUrl(paper.pdfUrl);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching paper for edit:', error);
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Failed to load paper details",
                    });
                } finally {
                    setIsFetching(false);
                }
            };
            fetchPaperData();
        }
    }, [editId, form, toast]);


    const handleSubmit = async (values: PaperFormValues) => {
        if (!user) return;
        if (!editId && !file) {
            toast({
                variant: "destructive",
                title: "File Required",
                description: t('addPaper.form.alerts.selectPdf'),
            });
            return;
        }

        setIsSubmitting(true);
        try {
            let pdfUrl = '';
            let contentHash = '';

            // Handle File Process
            if (file) {
                // Calculate hash for de-duplication
                contentHash = await calculateHash(file);

                const fileExt = file.name.split('.').pop();
                const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
                const baseName = `${sanitize(values.subject)}_${values.year}_${sanitize(values.category)}_${sanitize(values.part)}`;
                const fileName = `${baseName}_${Date.now()}.${fileExt}`;
                const filePath = `papers/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('papers')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('papers')
                    .getPublicUrl(filePath);

                pdfUrl = publicUrl;
            }

            const submitUrl = editId ? `/api/papers/${editId}` : '/api/papers';
            const method = editId ? 'PUT' : 'POST';

            const payload = {
                ...values,
                addedBy: user.name,
                ...(pdfUrl ? { pdfUrl } : {}),
                ...(contentHash ? { contentHash } : {}),
            };

            const response = await fetch(submitUrl, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.status === 409) {
                const errorData = await response.json();
                throw new Error(errorData.message || "This exact file has already been uploaded.");
            }

            if (!response.ok) throw new Error(t('addPaper.form.alerts.saveError'));

            toast({
                title: "Success",
                description: editId ? "Paper updated successfully." : "Paper published successfully.",
            });

            router.push(ROUTES.HOME);
        } catch (error: any) {
            console.error('Error saving paper:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || t('addPaper.form.alerts.saveError'),
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!editId) return;
        setIsLoadingDelete(true);
        try {
            const response = await fetch(`/api/papers/${editId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete paper');

            toast({
                title: "Deleted",
                description: "Paper removed successfully.",
            });
            router.push(ROUTES.HOME);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete paper",
            });
        } finally {
            setIsLoadingDelete(false);
        }
    };

    if (authLoading || isFetching) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="relative min-h-screen pb-20">
            {/* Background elements (Radiant) */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] -z-10" />

            <div className="container py-8 lg:py-12 max-w-7xl">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-muted">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <Button variant="outline" size="icon" asChild className="h-12 w-12 rounded-xl">
                                <Link href={ROUTES.HOME}>
                                    <ArrowLeft className="h-5 w-5" />
                                </Link>
                            </Button>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight text-secondary">
                                    {editId ? t('addPaper.title.edit') : t('addPaper.title.add')}
                                </h1>
                                <p className="text-muted-foreground font-medium">
                                    {editId ? "Update paper details or remove it." : "Share a new past paper with the community."}
                                </p>
                            </div>
                        </div>

                        {/* Delete Button (Only in Edit Mode) */}
                        {editId && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="lg" className="w-full md:w-auto font-bold shadow-lg shadow-destructive/20" disabled={isLoadingDelete}>
                                        {isLoadingDelete ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                        Delete Paper
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the paper
                                            "{form.getValues().paperName}" and remove it from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                            {/* Left Column: Form Fields */}
                            <div className="xl:col-span-5 space-y-8 order-2 xl:order-1">
                                <div className="bg-card border border-muted p-8 rounded-[2rem] shadow-xl shadow-primary/5 space-y-6">

                                    <FormField
                                        control={form.control}
                                        name="year"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('addPaper.form.year')}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-12 rounded-xl border-2 font-bold bg-background">
                                                            <SelectValue placeholder="Select Year" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {YEAR_OPTIONS.map((y) => (
                                                            <SelectItem key={y} className='bg-background' value={y}>{y}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('addPaper.form.category')}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-12 rounded-xl border-2 font-bold bg-background">
                                                            <SelectValue className='bg-background' placeholder="Select Category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {CATEGORY_OPTIONS.map((c) => (
                                                            <SelectItem key={c} className='bg-background' value={c}>{c}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="language"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('addPaper.form.language')}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-12 rounded-xl border-2 font-bold bg-background">
                                                            <SelectValue placeholder="Select Language" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {LANGUAGE_OPTIONS.map((l) => (
                                                            <SelectItem key={l} className='bg-background' value={l}>{l}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="part"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('addPaper.form.part')}</FormLabel>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {PART_OPTIONS.map((opt) => (
                                                        <div
                                                            key={opt}
                                                            onClick={() => field.onChange(opt)}
                                                            className={`
                                                                cursor-pointer text-center py-3 rounded-xl border-2 font-bold transition-all
                                                                ${field.value === opt
                                                                    ? "bg-primary text-primary-foreground border-primary"
                                                                    : "bg-background border-muted hover:border-primary/50"}
                                                            `}
                                                        >
                                                            {opt}
                                                        </div>
                                                    ))}
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit" size="lg" className="w-full h-14 text-lg font-black uppercase tracking-widest rounded-xl shadow-xl" disabled={isSubmitting}>
                                        {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                                        {editId ? t('addPaper.form.submit.save') : t('addPaper.form.submit.publish')}
                                    </Button>

                                </div>
                            </div>

                            {/* Right Column: Upload & Metdata */}
                            <div className="xl:col-span-7 space-y-8 order-1 xl:order-2">
                                <div className="bg-muted/5 border-2 border-dashed border-muted rounded-[2rem] p-4 hover:border-primary/30 transition-all">
                                    <div className="rounded-[1.5rem] bg-card border shadow-inner h-full">
                                        <PdfDropzone
                                            onFileSelect={setFile}
                                            selectedFile={file}
                                            existingFileUrl={existingPdfUrl}
                                        />
                                        {editId && !file && !existingPdfUrl && (
                                            <p className="text-center pb-4 text-xs text-muted-foreground italic">
                                                {t('addPaper.form.dropzone.keep')}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="paperName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('addPaper.form.name')}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={t('addPaper.form.placeholder.name')} {...field} className="h-12 font-bold" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="subject"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('addPaper.form.subject')}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-12 rounded-xl border-2 font-bold bg-background">
                                                            <SelectValue placeholder={t('addPaper.form.placeholder.subject')} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {SUBJECT_OPTIONS.map((opt) => (
                                                            <SelectItem className='bg-background' key={opt} value={opt}>{opt}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default function AddPaper() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-12 w-12 text-primary animate-spin" /></div>}>
            <AddPaperContent />
        </Suspense>
    );
}
