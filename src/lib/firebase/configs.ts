import { db } from '../firebase'
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'

export interface FilterConfig {
    subjects: string[]
    categories: string[]
    parts: string[]
    languages: string[]
    years: string[]
}

export interface SocialConfig {
    twitter?: string
    facebook?: string
    instagram?: string
}

export interface DonationConfig {
    coffeePrice?: number
    enabled?: boolean
}

export const configsApi = {
    async getFilters(): Promise<FilterConfig> {
        const docRef = doc(db, 'configs', 'filters')
        const snap = await getDoc(docRef)
        if (snap.exists()) {
            return snap.data() as FilterConfig
        }
        return { subjects: [], categories: [], parts: [], languages: [], years: [] }
    },

    async getAdminAuth(): Promise<{ email?: string, password?: string }> {
        const docRef = doc(db, 'configs', 'admin_auth')
        const snap = await getDoc(docRef)
        return snap.exists() ? snap.data() as { email?: string, password?: string } : {}
    },

    subscribeFilters(callback: (filters: FilterConfig) => void) {
        return onSnapshot(doc(db, 'configs', 'filters'), (snap) => {
            if (snap.exists()) {
                callback(snap.data() as FilterConfig)
            } else {
                callback({ subjects: [], categories: [], parts: [], languages: [], years: [] })
            }
        })
    },

    async updateFilters(filters: FilterConfig) {
        await setDoc(doc(db, 'configs', 'filters'), filters)
    },

    async getSocials(): Promise<SocialConfig> {
        const docRef = doc(db, 'configs', 'socials')
        const snap = await getDoc(docRef)
        return snap.exists() ? snap.data() as SocialConfig : {}
    },

    async updateSocials(socials: SocialConfig) {
        await setDoc(doc(db, 'configs', 'socials'), socials)
    },

    subscribeSocials(callback: (socials: SocialConfig) => void) {
        return onSnapshot(doc(db, 'configs', 'socials'), (snap) => {
            if (snap.exists()) {
                callback(snap.data() as SocialConfig)
            } else {
                callback({})
            }
        })
    },

    async getDonationSettings(): Promise<DonationConfig> {
        const docRef = doc(db, 'configs', 'donations')
        const snap = await getDoc(docRef)
        return snap.exists() ? snap.data() as DonationConfig : { coffeePrice: 5, enabled: true }
    },

    async updateDonationSettings(settings: DonationConfig) {
        await setDoc(doc(db, 'configs', 'donations'), settings)
    }
}
