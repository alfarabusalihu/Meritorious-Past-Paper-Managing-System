import { db } from '../firebase'
import { doc, getDoc, updateDoc, increment, setDoc, arrayUnion } from 'firebase/firestore'
import { getOrCreateVisitorId } from '../cookieUtils'

export interface SystemStats {
    visitors: number
    papersEngagement: number
}

export interface VisitorLog {
    lastVisit: number
    downloads: string[]
    createdAt: number
    deleteAt: Date
}

export const statsApi = {
    async getStats(): Promise<SystemStats> {
        try {
            const docRef = doc(db, 'stats', 'global')
            const snap = await getDoc(docRef)
            if (snap.exists()) {
                return snap.data() as SystemStats
            }
            const defaults = { visitors: 0, papersEngagement: 0 }
            await setDoc(docRef, defaults)
            return defaults
        } catch (error) {
            console.error('Failed to get stats:', error)
            return { visitors: 0, papersEngagement: 0 }
        }
    },

    async incrementVisitors() {
        const docRef = doc(db, 'stats', 'global')
        try {
            await updateDoc(docRef, {
                visitors: increment(1)
            })
        } catch (error) {
            // If doc doesn't exist, create it
            await setDoc(docRef, { visitors: 1, papersEngagement: 0 }, { merge: true })
        }
    },

    async trackVisitor() {
        // Don't track admin panel visits
        if (window.location.pathname.startsWith('/admin')) {
            return;
        }

        const visitorId = getOrCreateVisitorId();
        if (!visitorId) return;

        try {
            const visitorRef = doc(db, 'visitor_logs', visitorId);
            const visitorSnap = await getDoc(visitorRef);

            const now = Date.now();
            const ONE_HOUR = 3600000;
            const SIX_MONTHS_MS = 180 * 24 * 60 * 60 * 1000;

            if (!visitorSnap.exists()) {
                // First time visitor
                await this.incrementVisitors();
                await setDoc(visitorRef, {
                    lastVisit: now,
                    downloads: [],
                    createdAt: now,
                    deleteAt: new Date(now + SIX_MONTHS_MS)
                });
            } else {
                const lastVisit = visitorSnap.data().lastVisit;
                if (now - lastVisit > ONE_HOUR) {
                    // Returning after 1 hour session
                    await this.incrementVisitors();
                    await updateDoc(visitorRef, { lastVisit: now });
                }
            }
        } catch (error) {
            console.error('Visitor tracking failed:', error);
        }
    },

    async trackDownload(paperId: string): Promise<boolean> {
        const visitorId = getOrCreateVisitorId();
        if (!visitorId) return false;

        try {
            const visitorRef = doc(db, 'visitor_logs', visitorId);
            const visitorSnap = await getDoc(visitorRef);
            const SIX_MONTHS_MS = 180 * 24 * 60 * 60 * 1000;

            if (visitorSnap.exists()) {
                const downloads = visitorSnap.data().downloads || [];
                if (!downloads.includes(paperId)) {
                    await updateDoc(visitorRef, {
                        downloads: arrayUnion(paperId)
                    });
                    return true;
                }
            } else {
                // If log doc doesn't exist for some reason, create it and allow increment
                const now = Date.now();
                await setDoc(visitorRef, {
                    lastVisit: now,
                    downloads: [paperId],
                    createdAt: now,
                    deleteAt: new Date(now + SIX_MONTHS_MS)
                });
                return true;
            }
        } catch (error) {
            console.error('Download tracking failed:', error);
        }
        return false;
    },

    async incrementEngagement() {
        const docRef = doc(db, 'stats', 'global')
        try {
            const snap = await getDoc(docRef)
            if (!snap.exists()) {
                await setDoc(docRef, { visitors: 0, papersEngagement: 1 })
            } else {
                await updateDoc(docRef, {
                    papersEngagement: increment(1)
                })
            }
        } catch (error) {
            console.error('Failed to increment engagement:', error)
        }
    },

    async resetVisitors() {
        const docRef = doc(db, 'stats', 'global')
        try {
            await updateDoc(docRef, {
                visitors: 0
            })
        } catch (error) {
            console.error('Failed to reset visitors:', error)
        }
    }
}
