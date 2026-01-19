import { db } from '../firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export const seedData = async () => {
    // Initial Stats
    const statsRef = doc(db, 'stats', 'global')
    const statsSnap = await getDoc(statsRef)
    if (!statsSnap.exists()) {
        await setDoc(statsRef, {
            visitors: 1250,
            contributors: 42,
            papersEngagement: 8900
        })
    }

    // Initial Filters
    const filtersRef = doc(db, 'configs', 'filters')
    const filtersSnap = await getDoc(filtersRef)
    const existingFilters = filtersSnap.exists() ? filtersSnap.data() as any : {}

    const coreFilters = {
        subjects: existingFilters.subjects || ['Mathematics', 'Science', 'History', 'Geography', 'Civics', 'English', 'Tamil'],
        categories: existingFilters.categories || ['PAPER', 'SCHEME'],
        parts: existingFilters.parts || ['Part 1', 'Part 2'],
        languages: Array.from(new Set(['English', 'Tamil', ...(existingFilters.languages || [])])),
        years: Array.from(new Set([
            ...Array.from({ length: new Date().getFullYear() - 2020 + 2 }, (_, i) => (new Date().getFullYear() + 1 - i).toString()),
            ...(existingFilters.years || [])
        ])).sort((a, b) => parseInt(b) - parseInt(a))
    }

    await setDoc(filtersRef, coreFilters, { merge: true })

    // Initial Socials
    const socialsRef = doc(db, 'configs', 'socials')
    const socialsSnap = await getDoc(socialsRef)
    if (!socialsSnap.exists()) {
        await setDoc(socialsRef, {
            twitter: 'https://twitter.com/meritorious',
            facebook: 'https://facebook.com/meritorious',
            instagram: 'https://instagram.com/meritorious'
        })
    }

    // Initial Admin Auth (For non-Google login parity)
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@gmail.com'
    const adminAuthRef = doc(db, 'configs', 'admin_auth')
    const adminAuthSnap = await getDoc(adminAuthRef)
    if (!adminAuthSnap.exists()) {
        await setDoc(adminAuthRef, {
            email: adminEmail,
            password: import.meta.env.VITE_ADMIN_PASSWORD || 'adminMPPMS'
        })
    }

    // Ensure system-admin role is registered
    const adminUserRef = doc(db, 'users', 'system-admin')
    const adminUserSnap = await getDoc(adminUserRef)
    if (!adminUserSnap.exists()) {
        await setDoc(adminUserRef, {
            uid: 'system-admin',
            email: adminEmail,
            displayName: 'System Admin',
            role: 'admin'
        })
    }
}
