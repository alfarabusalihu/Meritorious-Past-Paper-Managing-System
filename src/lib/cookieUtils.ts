/**
 * Cookie utilities for visitor tracking
 * Provides consent-aware cookie management for GDPR compliance
 */

const COOKIE_NAME = 'visitor_id';
const CONSENT_KEY = 'cookie_consent';

/**
 * Check if user has given consent for cookies
 */
export function hasConsent(): boolean {
    const consent = localStorage.getItem(CONSENT_KEY);
    return consent === 'accepted';
}

/**
 * Set user's cookie consent choice
 */
export function setConsent(accepted: boolean): void {
    localStorage.setItem(CONSENT_KEY, accepted ? 'accepted' : 'declined');

    if (!accepted) {
        // Clear any old visitor cookie if consent is declined
        document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}

/**
 * Check if consent choice has been made
 */
export function hasConsentChoice(): boolean {
    return localStorage.getItem(CONSENT_KEY) !== null;
}
