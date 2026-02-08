import { useEffect } from 'react'
import { statsApi } from '../lib/firebase/stats'
import { useAuth } from '../context/AuthContext'

export function useVisitorTracker() {
    const { user, profile, loading } = useAuth()

    useEffect(() => {
        if (loading || !user || !profile) return

        // Only track if user has consented
        if (!profile.hasConsented) return

        // Only track in production (no localhost)
        const isProduction = import.meta.env.PROD &&
            !window.location.hostname.includes('localhost') &&
            !window.location.hostname.includes('127.0.0.1');

        if (!isProduction) return

        statsApi.trackVisitor(user.uid)
    }, [user, profile, loading])
}
