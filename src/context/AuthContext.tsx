import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User, signOut, setPersistence, browserSessionPersistence, signInAnonymously } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { usersApi } from '../lib/firebase/users';
import { UserProfile } from '../lib/firebase/schema';
import { useInactivity } from '../hooks/useInactivity';

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    isSuperAdmin: boolean;
    updateConsent: (accepted: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const handleLogout = useCallback(async () => {
        try {
            await signOut(auth);
            window.location.href = '/';
        } catch (error) {
            console.error('Auto-logout failed:', error);
        }
    }, []);

    const updateConsent = async (accepted: boolean) => {
        if (!user) return;
        try {
            await usersApi.updateUserConsent(user.uid, accepted);
            // Re-sync profile to reflect change
            const p = await usersApi.syncUser(user.uid, user.email || '', user.displayName || (user.isAnonymous ? 'Visitor' : 'User'));
            setProfile(p);
        } catch (error) {
            console.error('Failed to update consent:', error);
        }
    };

    // Auto-logout after 15 minutes of inactivity (900000ms)
    // Only active when a real user is logged in (not anonymous)
    useInactivity(handleLogout, 900000, !!user && !user?.isAnonymous);

    useEffect(() => {
        // Enforce Session Persistence (Logout on Tab Close)
        setPersistence(auth, browserSessionPersistence).catch(console.error);

        const unsubscribe = onAuthStateChanged(auth, async (u) => {
            if (!u) {
                // Only sign in anonymously if cookie consent is already given
                const { hasConsent } = await import('../lib/cookieUtils');
                if (hasConsent()) {
                    try {
                        await signInAnonymously(auth);
                    } catch (error) {
                        console.error('Anonymous auth failed:', error);
                        setLoading(false);
                    }
                } else {
                    setLoading(false);
                }
                return;
            }

            setUser(u);
            try {
                // Visitors (anonymous) get a simple sync, real users get their profile
                const p = await usersApi.syncUser(u.uid, u.email || '', u.displayName || (u.isAnonymous ? 'Visitor' : 'User'));
                setProfile(p);
            } catch (error) {
                console.error('Error syncing user:', error);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const value = {
        user,
        profile,
        loading,
        isSuperAdmin: profile?.role === 'super-admin',
        updateConsent
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
