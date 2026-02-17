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
            console.log("Attempting to track visitor...");
            statsApi.trackVisitor(user.uid).then(() => {
                startSession(); // Start 1-hour session timer
            });
        });
    }, [user, loading])
}
