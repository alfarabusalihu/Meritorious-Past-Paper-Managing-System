"use client";

import { useState, useEffect } from 'react';
import { Save, Loader2, Globe, Facebook, Instagram, Twitter, List, Plus, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { SUBJECT_OPTIONS, CATEGORY_OPTIONS, PART_OPTIONS } from '@/constants/filters';

export default function SettingsManager() {
    const { toast } = useToast();
    const [configs, setConfigs] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            const res = await fetch('/api/configs');
            const data = await res.json();

            // Seed defaults and merge with existing data
            if (!data.filters) data.filters = {};

            data.filters.subjects = Array.from(new Set([...SUBJECT_OPTIONS, ...(data.filters.subjects || [])]));
            data.filters.categories = Array.from(new Set([...CATEGORY_OPTIONS, ...(data.filters.categories || [])]));
            data.filters.parts = Array.from(new Set([...PART_OPTIONS, ...(data.filters.parts || [])]));

            setConfigs(data);
        } catch (error) {
            console.error('Failed to load configs:', error);
            toast({ variant: "destructive", title: "Error", description: "Failed to load settings" });
            // Fallback to defaults to prevent crash
            setConfigs({
                filters: {
                    subjects: [...SUBJECT_OPTIONS],
                    categories: [...CATEGORY_OPTIONS],
                    parts: [...PART_OPTIONS]
                },
                socials: {}
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (id: string, data: any) => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/configs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, data }),
            });
            if (!res.ok) throw new Error();
            toast({ title: "Success", description: "Settings updated successfully" });
            fetchConfigs();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to update settings" });
        } finally {
            setIsSaving(false);
        }
    };

    const addFilterItem = (type: 'subjects' | 'categories' | 'parts') => {
        if (!configs) return;
        const newFilters = { ...configs.filters };
        newFilters[type] = [...(newFilters[type] || []), "New Item"];
        setConfigs({ ...configs, filters: newFilters });
    };

    const removeFilterItem = (type: 'subjects' | 'categories' | 'parts', index: number) => {
        if (!configs) return;
        const newFilters = { ...configs.filters };
        newFilters[type] = newFilters[type].filter((_: any, i: number) => i !== index);
        setConfigs({ ...configs, filters: newFilters });
    };

    const updateFilterItem = (type: 'subjects' | 'categories' | 'parts', index: number, value: string) => {
        if (!configs) return;
        const newFilters = { ...configs.filters };
        newFilters[type][index] = value;
        setConfigs({ ...configs, filters: newFilters });
    };

    const toTitleCase = (str: string) => {
        return str.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };

    const updateSocial = (platform: string, value: string) => {
        if (!configs) return;
        setConfigs({
            ...configs,
            socials: { ...configs.socials, [platform]: value }
        });
    };

    if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Filters Card */}
            <div className="bg-card border rounded-xl shadow-sm p-6 space-y-6">
                <div className="flex items-center justify-between gap-4 border-b border-muted pb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <List className="h-5 w-5 text-primary" />
                        Filter Options
                    </h2>
                    <Button
                        size="sm"
                        className="font-bold rounded-lg"
                        onClick={() => handleSave('filters', configs.filters)}
                        disabled={isSaving}
                    >
                        {isSaving ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Save className="mr-2 h-3 w-3" />}
                        Save Changes
                    </Button>
                </div>

                <div className="space-y-8">
                    {(['subjects', 'categories', 'parts'] as const).map((type) => (
                        <div key={type} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">{type}</h3>
                                <Button size="sm" variant="ghost" onClick={() => addFilterItem(type)} className="h-8 px-2 text-primary hover:bg-primary/10 rounded-lg hover:text-primary">
                                    <Plus className="h-3 w-3 mr-1" /> Add
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {configs?.filters?.[type]?.map((item: string, idx: number) => (
                                    <div key={idx} className="flex gap-2">
                                        <Input
                                            value={item}
                                            onChange={(e) => updateFilterItem(type, idx, e.target.value)}
                                            onBlur={(e) => updateFilterItem(type, idx, toTitleCase(e.target.value))}
                                            className="h-10 font-bold rounded-lg"
                                        />
                                        <Button size="icon" variant="ghost" onClick={() => removeFilterItem(type, idx)} className="h-10 w-10 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Social Links Card */}
            <div className="bg-card border rounded-xl shadow-sm p-6 space-y-6">
                <div className="flex items-center justify-between gap-4 border-b border-muted pb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" />
                        Social Media
                    </h2>
                    <Button
                        size="sm"
                        className="font-bold rounded-lg"
                        onClick={() => handleSave('socials', configs.socials)}
                        disabled={isSaving}
                    >
                        {isSaving ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Save className="mr-2 h-3 w-3" />}
                        Save Changes
                    </Button>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Twitter className="h-3 w-3" /> Twitter URL
                        </label>
                        <Input
                            value={configs?.socials?.twitter || ''}
                            onChange={(e) => updateSocial('twitter', e.target.value)}
                            placeholder="https://twitter.com/..."
                            className="h-11 font-bold rounded-lg"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Facebook className="h-3 w-3" /> Facebook URL
                        </label>
                        <Input
                            value={configs?.socials?.facebook || ''}
                            onChange={(e) => updateSocial('facebook', e.target.value)}
                            placeholder="https://facebook.com/..."
                            className="h-11 font-bold rounded-lg"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Instagram className="h-3 w-3" /> Instagram URL
                        </label>
                        <Input
                            value={configs?.socials?.instagram || ''}
                            onChange={(e) => updateSocial('instagram', e.target.value)}
                            placeholder="https://instagram.com/..."
                            className="h-11 font-bold rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
