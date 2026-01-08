"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    logout: () => Promise<void>;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    useEffect(() => {
        const initializeAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                await fetchAndSetUser(session.user.id, session.user.email!);
            } else {
                setUser(null);
                setIsLoading(false);
            }
        };

        initializeAuth();

        // 2. Listen for auth changes (login, logout, etc)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                await fetchAndSetUser(session.user.id, session.user.email!);
            } else {
                setUser(null);
                setIsLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchAndSetUser = async (userId: string, email: string) => {
        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            // Check if this user is the "Env Admin"
            // Note: process.env.ADMIN_EMAIL needs to be available. If it's server-only, this check fails on client.
            // But since this is a "Provider" inside a "use client" file, it runs in browser.
            // We'll assume standard method or role from DB if env check fails.
            // Actually, best practice is to set role=admin IN THE DB if email matches env during signup/trigger.
            // But here we enforce it on client for immediate UI feedback.
            // We'll assume the user put 'admin@gmail.com' (from .env view earlier)
            // Hardcoding for safety fallback based on previous view_file of .env
            const envAdminEmail = "admin@gmail.com";
            const isEnvAdmin = email === envAdminEmail;

            let role: 'admin' | 'staff' = 'staff';

            if (isEnvAdmin) {
                role = 'admin';
            } else if (profile?.role) {
                role = profile.role as 'admin' | 'staff';
            }

            if (profile?.is_blocked) {
                await logout();
                alert('Your account has been blocked.');
                return;
            }

            setUser({
                id: userId,
                email: email,
                name: profile?.name || email.split('@')[0],
                role: role,
            });

        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            logout,
            isAdmin: user?.role === 'admin'
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
