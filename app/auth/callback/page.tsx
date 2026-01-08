"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        const handleCallback = async () => {
            const { error } = await supabase.auth.getSession();
            if (error) {
                console.error('Error during auth callback:', error);
                router.push('/auth/login?error=AuthFailed');
            } else {
                router.push('/');
            }
        };
        handleCallback();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>
    );
}
