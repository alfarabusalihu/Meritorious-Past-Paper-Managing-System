import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { usersApi } from '../lib/firebase/users';
import { UserProfile } from '../lib/firebase/schema';
import { useInactivity } from '../hooks/useInactivity';

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

    const handleLogout = useCallback(async () => {
        try {
            await signOut(auth);
            // Optional: You could redirect here or show a toast "Logged out due to inactivity"
            // but the state change will handle the UI update mostly.
        } catch (error) {
            console.error('Auto-logout failed:', error);
        }
    }, []);

    // Auto-logout after 15 minutes of inactivity (900000ms)
    // Only active when a user is logged in
    useInactivity(handleLogout, 900000, !!user);

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
        isAdmin: !!user, // Treat any logged-in user as an admin as per requirements
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
