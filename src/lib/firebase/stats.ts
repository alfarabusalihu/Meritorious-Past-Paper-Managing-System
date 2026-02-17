import { db } from '../firebase'
import { doc, getDoc, updateDoc, increment, setDoc, arrayUnion, onSnapshot } from 'firebase/firestore'

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
        } catch {
            // If doc doesn't exist, create it
            await setDoc(docRef, { visitors: 1, papersEngagement: 0 }, { merge: true })
        }
    },

    subscribeToStats(callback: (stats: SystemStats) => void) {
        const docRef = doc(db, 'stats', 'global');
        return onSnapshot(docRef, (snap) => {
            if (snap.exists()) {
                callback(snap.data() as SystemStats);
            } else {
                callback({ visitors: 0, papersEngagement: 0 });
            }
        });
    },

    async trackVisitor(uid: string) {
        // Don't track admin panel visits
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
            return;
        }

        if (!uid) return;

        const visitorRef = doc(db, 'visitor_logs', uid);
        const now = Date.now();
        const SIX_MONTHS_MS = 180 * 24 * 60 * 60 * 1000;

        try {
            // Attempt to update existing visitor log
            await updateDoc(visitorRef, {
                lastVisit: now
            });

            // Note: We'd need to check if incrementing is still needed based on lastVisit
            // but updateDoc doesn't return the data. To keep it optimized with ONE_HOUR gap,
            // we'll stick to getDoc if we REALLY need that logic, OR we can use a cookie-based session
            // check which is already done in useVisitorTracker.ts. 
            // Since useVisitorTracker already checks isSessionActive(), we can safely increment here.
            await this.incrementVisitors();

        } catch (error: any) {
            if (error.code === 'not-found') {
                // First time visitor
                try {
                    await this.incrementVisitors();
                    await setDoc(visitorRef, {
                        lastVisit: now,
                        downloads: [],
                        createdAt: now,
                        deleteAt: new Date(now + SIX_MONTHS_MS)
                    });
                } catch (innerErr) {
                    console.error('Visitor doc creation failed:', innerErr);
                }
            } else {
                console.error('Visitor tracking update failed:', error);
            }
        }
    },

    async trackDownload(paperId: string, uid: string): Promise<boolean> {
        if (!uid || !paperId) return false;

        const visitorRef = doc(db, 'visitor_logs', uid);
        const now = Date.now();
        const SIX_MONTHS_MS = 180 * 24 * 60 * 60 * 1000;

        try {
            // Attempt to update existing visitor log with arrayUnion
            // Firestore arrayUnion is idempotent, so we don't need to check if paperId exists
            await updateDoc(visitorRef, {
                downloads: arrayUnion(paperId),
                lastVisit: now
            });
            return true;
        } catch (error: any) {
            if (error.code === 'not-found') {
                try {
                    await setDoc(visitorRef, {
                        lastVisit: now,
                        downloads: [paperId],
                        createdAt: now,
                        deleteAt: new Date(now + SIX_MONTHS_MS)
                    });
                    return true;
                } catch (innerErr) {
                    console.error('Download log creation failed:', innerErr);
                }
            } else {
                console.error('Download tracking update failed:', error);
            }
        }
        return false;
    },

    async incrementEngagement() {
        const docRef = doc(db, 'stats', 'global')
        try {
            await updateDoc(docRef, {
                papersEngagement: increment(1)
            })
        } catch {
            // Fallback for missing global stats doc
            await setDoc(docRef, { visitors: 0, papersEngagement: 1 }, { merge: true })
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
