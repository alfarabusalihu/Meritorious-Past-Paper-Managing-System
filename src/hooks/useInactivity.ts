import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook to track user inactivity and trigger a callback.
 * @param callback Function to call when user is inactive
 * @param timeout Duration in ms before considering inactive (default 15 min)
 * @param active Whether to enable the timer (useful for only checking logged-in users)
 */
export function useInactivity(callback: () => void, timeout: number = 900000, active: boolean = true) {
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const callbackRef = useRef(callback);

    // Keep callback fresh without restarting effect
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    const resetTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        if (active) {
            timerRef.current = setTimeout(() => {
                callbackRef.current();
            }, timeout);
        }
    }, [timeout, active]);

    useEffect(() => {
        if (!active) return;

        const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

        const handleActivity = () => {
            resetTimer();
        };

        // Initial start
        resetTimer();

        // Add listeners
        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [active, resetTimer]);
}
