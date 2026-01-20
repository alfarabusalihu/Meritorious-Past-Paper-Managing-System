import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { usersApi } from '../lib/firebase/users';
import { UserProfile } from '../lib/firebase/schema';

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    isAdmin: boolean;
    isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (u) => {
            setUser(u);
            if (u) {
                // Fetch profile to get roles
                try {
                    const p = await usersApi.syncUser(u.uid, u.email || '', u.displayName || 'User');
                    setProfile(p);
                } catch (error) {
                    console.error('Error syncing user:', error);
                }
            } else {
                setProfile(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const value = {
        user,
        profile,
        loading,
        isAdmin: profile?.role === 'admin' || profile?.role === 'super-admin',
        isSuperAdmin: profile?.role === 'super-admin'
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
