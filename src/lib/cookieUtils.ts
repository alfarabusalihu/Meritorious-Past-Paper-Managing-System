/**
 * Cookie utilities for visitor tracking
 * Provides consent-aware cookie management for GDPR compliance
 */

const CONSENT_KEY = 'cookie_consent';
const SESSION_KEY = 'visitor_session';

// 1 Year in seconds
const ONE_YEAR = 365 * 24 * 60 * 60;
// 1 Hour in seconds
const ONE_HOUR = 60 * 60;

/**
 * Set a cookie with a specific expiry
 */
export function setCookie(name: string, value: string, seconds: number): void {
    const date = new Date();
    date.setTime(date.getTime() + (seconds * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

/**
 * Check if user has given consent for cookies
 */
export function hasConsent(): boolean {
    return getCookie(CONSENT_KEY) === 'accepted';
}

/**
 * Set user's cookie consent choice
 */
export function setConsent(accepted: boolean): void {
    if (accepted) {
        setCookie(CONSENT_KEY, 'accepted', ONE_YEAR);
    } else {
        // Clear consent and session
        document.cookie = `${CONSENT_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${SESSION_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}

/**
 * Check if consent choice has been made
 */
export function hasConsentChoice(): boolean {
    return getCookie(CONSENT_KEY) !== null;
}

/**
 * Check if a session is currently active
 */
export function isSessionActive(): boolean {
    return getCookie(SESSION_KEY) !== null;
}

/**
 * Start or refresh a 1-hour session
 */
export function startSession(): void {
    setCookie(SESSION_KEY, 'active', ONE_HOUR);
}
