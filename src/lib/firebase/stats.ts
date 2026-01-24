import { db } from '../firebase'
import { doc, getDoc, updateDoc, increment, setDoc } from 'firebase/firestore'

export interface SystemStats {
    visitors: number
    papersEngagement: number
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
            const snap = await getDoc(docRef)
            if (!snap.exists()) {
                await setDoc(docRef, { visitors: 1, papersEngagement: 0 })
            } else {
                await updateDoc(docRef, {
                    visitors: increment(1)
                })
            }
        } catch (error) {
            console.error('Failed to increment visitors:', error)
        }
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
