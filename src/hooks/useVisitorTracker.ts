import { useEffect } from 'react'
import { statsApi } from '../lib/firebase/stats'
import { useAuth } from '../context/AuthContext'

export function useVisitorTracker() {
    const { user, loading } = useAuth()

    useEffect(() => {
        if (loading || !user) return

        // Check for 1-hour session gap
        import('../lib/cookieUtils').then(({ hasConsent, isSessionActive, startSession }) => {
            if (!hasConsent() || isSessionActive()) return;

            // Only track in production (no localhost)
            const isProduction = import.meta.env.PROD &&
                !window.location.hostname.includes('localhost') &&
                !window.location.hostname.includes('127.0.0.1');

            if (!isProduction) return

            statsApi.trackVisitor(user.uid).then(() => {
                startSession(); // Start 1-hour session timer
            });
        });
    }, [user, loading])
}
