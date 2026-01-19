import { db } from '../firebase'
import { doc, getDoc, updateDoc, increment, setDoc } from 'firebase/firestore'

export interface SystemStats {
    visitors: number
    contributors: number
    papersEngagement: number
}

export const statsApi = {
    async getStats(): Promise<SystemStats> {
        const docRef = doc(db, 'stats', 'global')
        const snap = await getDoc(docRef)
        if (snap.exists()) {
            return snap.data() as SystemStats
        }
        const defaults = { visitors: 0, contributors: 0, papersEngagement: 0 }
        await setDoc(docRef, defaults)
        return defaults
    },

    async incrementVisitors() {
        const docRef = doc(db, 'stats', 'global')
        await updateDoc(docRef, {
            visitors: increment(1)
        })
    },

    async incrementEngagement() {
        const docRef = doc(db, 'stats', 'global')
        await updateDoc(docRef, {
            papersEngagement: increment(1)
        })
    },

    async incrementContributors() {
        const docRef = doc(db, 'stats', 'global')
        await updateDoc(docRef, {
            contributors: increment(1)
        })
    }
}
