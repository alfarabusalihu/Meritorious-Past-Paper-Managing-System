/**
 * Cookie utilities for visitor tracking
 * Provides consent-aware cookie management for GDPR compliance
 */

const COOKIE_NAME = 'visitor_id';
const COOKIE_EXPIRY_DAYS = 30; // 30 days standard
const CONSENT_KEY = 'cookie_consent';

/**
 * Check if user has given consent for cookies
 */
export function hasConsent(): boolean {
    const consent = localStorage.getItem(CONSENT_KEY);
    return consent === 'accepted';
}

/**
 * Generate a unique visitor ID using UUID v4
 */
export function generateVisitorId(): string {
    // Use crypto.randomUUID if available (modern browsers)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    // Fallback for older browsers
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Get visitor ID from cookie
 */
export function getVisitorCookie(): string | null {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === COOKIE_NAME) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

/**
 * Set visitor ID cookie with 30-day expiry
 */
export function setVisitorCookie(id: string): void {
    const expires = new Date();
    expires.setDate(expires.getDate() + COOKIE_EXPIRY_DAYS);

    // Set cookie with security flags
    const cookieString = `${COOKIE_NAME}=${encodeURIComponent(id)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;
    document.cookie = cookieString;
}

/**
 * Get or create visitor ID
 * Returns null if user hasn't given consent
 */
export function getOrCreateVisitorId(): string | null {
    // Check consent first
    if (!hasConsent()) {
        return null;
    }

    // Try to get existing cookie
    let visitorId = getVisitorCookie();

    if (!visitorId) {
        // Generate new ID (No localStorage fallback)
        visitorId = generateVisitorId();

        // Set cookie
        setVisitorCookie(visitorId);
    }

    return visitorId;
}

/**
 * Set user's cookie consent choice
 */
export function setConsent(accepted: boolean): void {
    localStorage.setItem(CONSENT_KEY, accepted ? 'accepted' : 'declined');

    if (!accepted) {
        // Clear visitor cookie if consent is declined
        document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        localStorage.removeItem(COOKIE_NAME);
    }
}

/**
 * Check if consent choice has been made
 */
export function hasConsentChoice(): boolean {
    return localStorage.getItem(CONSENT_KEY) !== null;
}
