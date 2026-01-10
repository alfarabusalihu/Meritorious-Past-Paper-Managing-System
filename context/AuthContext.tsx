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
            const envAdminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@gmail.com";
            const isEnvAdmin = email === envAdminEmail;

            let finalProfile = profile;

            // If profile doesn't exist (e.g., first-time OAuth login), create it
            if (!profile) {
                const { data: newProfile, error: createError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: userId,
                            email: email,
                            name: email.split('@')[0],
                            role: isEnvAdmin ? 'admin' : 'staff' // Assign admin role if email matches env
                        }
                    ])
                    .select()
                    .single();

                if (createError) {
                    console.error('Error creating profile for OAuth user:', createError);
                } else {
                    finalProfile = newProfile;
                }
            }

            let role: 'admin' | 'staff' = 'staff';

            if (isEnvAdmin) {
                role = 'admin';
            } else if (finalProfile?.role) {
                role = finalProfile.role as 'admin' | 'staff';
            }

            if (finalProfile?.is_blocked) {
                await logout();
                alert('Your account has been blocked.');
                return;
            }

            setUser({
                id: userId,
                email: email,
                name: finalProfile?.name || email.split('@')[0],
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
