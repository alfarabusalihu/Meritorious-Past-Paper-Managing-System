"use client";

import { useState, useEffect } from 'react';
import { Save, Loader2, Globe, Facebook, Instagram, Twitter, List, Plus, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from '@/lib/cn';

export default function SettingsManager() {
    const { toast } = useToast();
    const [configs, setConfigs] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'filters' | 'socials'>('filters');

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            const res = await fetch('/api/configs');
            const data = await res.json();
            setConfigs(data);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to load settings" });
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
        const newFilters = { ...configs.filters };
        newFilters[type] = [...newFilters[type], "New Item"];
        setConfigs({ ...configs, filters: newFilters });
    };

    const removeFilterItem = (type: 'subjects' | 'categories' | 'parts', index: number) => {
        const newFilters = { ...configs.filters };
        newFilters[type] = newFilters[type].filter((_: any, i: number) => i !== index);
        setConfigs({ ...configs, filters: newFilters });
    };

    const updateFilterItem = (type: 'subjects' | 'categories' | 'parts', index: number, value: string) => {
        const newFilters = { ...configs.filters };
        newFilters[type][index] = value;
        setConfigs({ ...configs, filters: newFilters });
    };

    const updateSocial = (platform: string, value: string) => {
        setConfigs({
            ...configs,
            socials: { ...configs.socials, [platform]: value }
        });
    };

    if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

    return (
        <div className="bg-card border border-muted rounded-[2rem] overflow-hidden shadow-xl shadow-primary/5">
            <div className="flex border-b border-muted">
                <button
                    onClick={() => setActiveTab('filters')}
                    className={cn(
                        "flex-1 py-4 text-sm font-black uppercase tracking-widest transition-all",
                        activeTab === 'filters' ? "bg-primary text-primary-foreground" : "hover:bg-muted/50 text-muted-foreground"
                    )}
                >
                    <List className="inline-block h-4 w-4 mr-2" />
                    Filters
                </button>
                <button
                    onClick={() => setActiveTab('socials')}
                    className={cn(
                        "flex-1 py-4 text-sm font-black uppercase tracking-widest transition-all",
                        activeTab === 'socials' ? "bg-primary text-primary-foreground" : "hover:bg-muted/50 text-muted-foreground"
                    )}
                >
                    <Globe className="inline-block h-4 w-4 mr-2" />
                    Social Links
                </button>
            </div>

            <div className="p-8 space-y-8">
                {activeTab === 'filters' ? (
                    <div className="space-y-8">
                        {(['subjects', 'categories', 'parts'] as const).map((type) => (
                            <div key={type} className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-black uppercase tracking-tight text-secondary">{type}</h3>
                                    <Button size="sm" variant="outline" onClick={() => addFilterItem(type)} className="rounded-full">
                                        <Plus className="h-4 w-4 mr-1" /> Add
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {configs.filters?.[type]?.map((item: string, idx: number) => (
                                        <div key={idx} className="flex gap-2">
                                            <Input
                                                value={item}
                                                onChange={(e) => updateFilterItem(type, idx, e.target.value)}
                                                className="font-bold rounded-xl"
                                            />
                                            <Button size="icon" variant="ghost" onClick={() => removeFilterItem(type, idx)} className="text-destructive hover:bg-destructive/10 rounded-full">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <Button
                            className="w-full h-12 font-black uppercase tracking-widest rounded-xl"
                            onClick={() => handleSave('filters', configs.filters)}
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Filter Settings
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Twitter className="h-3 w-3" /> Twitter URL
                                </label>
                                <Input
                                    value={configs.socials?.twitter}
                                    onChange={(e) => updateSocial('twitter', e.target.value)}
                                    placeholder="https://twitter.com/..."
                                    className="font-bold rounded-xl h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Facebook className="h-3 w-3" /> Facebook URL
                                </label>
                                <Input
                                    value={configs.socials?.facebook}
                                    onChange={(e) => updateSocial('facebook', e.target.value)}
                                    placeholder="https://facebook.com/..."
                                    className="font-bold rounded-xl h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Instagram className="h-3 w-3" /> Instagram URL
                                </label>
                                <Input
                                    value={configs.socials?.instagram}
                                    onChange={(e) => updateSocial('instagram', e.target.value)}
                                    placeholder="https://instagram.com/..."
                                    className="font-bold rounded-xl h-12"
                                />
                            </div>
                        </div>
                        <Button
                            className="w-full h-12 font-black uppercase tracking-widest rounded-xl"
                            onClick={() => handleSave('socials', configs.socials)}
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Social Links
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
