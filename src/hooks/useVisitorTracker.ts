import { useEffect } from 'react'
import { statsApi } from '../lib/firebase/stats'

export function useVisitorTracker() {
    useEffect(() => {
        // Only track in production (not localhost or dev domains)
        const isProduction = import.meta.env.PROD &&
            window.location.hostname !== 'localhost' &&
            !window.location.hostname.includes('127.0.0.1');

        if (!isProduction) return

        const hasVisited = localStorage.getItem('has_visited_merit_series')
        if (!hasVisited) {
            statsApi.incrementVisitors()
            localStorage.setItem('has_visited_merit_series', 'true')
        }
    }, [])
}
