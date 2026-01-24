import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import 'dotenv/config';

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const seedData = async () => {
    console.log('🌱 Starting database seeding...');

    // Initial Stats
    const statsRef = doc(db, 'stats', 'global')
    const statsSnap = await getDoc(statsRef)
    if (!statsSnap.exists()) {
        console.log('📊 Initializing global stats...');
        await setDoc(statsRef, {
            visitors: 1250,
            papersEngagement: 8900
        })
    }

    // Initial Filters
    const filtersRef = doc(db, 'configs', 'filters')
    const filtersSnap = await getDoc(filtersRef)
    const existingFilters = filtersSnap.exists() ? filtersSnap.data() as any : {}

    console.log('🔍 Configuring filters...');
    const coreFilters = {
        subjects: existingFilters.subjects || ['Mathematics', 'Science'],
        languages: Array.from(new Set(['English', 'Tamil', ...(existingFilters.languages || [])])),
        years: Array.from(new Set([
            ...Array.from({ length: new Date().getFullYear() - 2019 + 1 }, (_, i) => (new Date().getFullYear() - i).toString()),
            ...(existingFilters.years || [])
        ])).sort((a, b) => parseInt(b) - parseInt(a))
    }

    await setDoc(filtersRef, coreFilters, { merge: true })

    // Initial Socials
    const socialsRef = doc(db, 'configs', 'socials')
    const socialsSnap = await getDoc(socialsRef)
    if (!socialsSnap.exists()) {
        console.log('📱 Initializing social links...');
        await setDoc(socialsRef, {
            twitter: 'https://twitter.com/meritorious',
            facebook: 'https://facebook.com/meritorious',
            instagram: 'https://instagram.com/meritorious'
        })
    }

    // Initial Admin Auth
    const adminEmail = process.env.VITE_SUPER_ADMIN_EMAIL || 'admin@gmail.com'
    const adminUserRef = doc(db, 'users', 'system-admin')
    const adminUserSnap = await getDoc(adminUserRef)
    if (!adminUserSnap.exists()) {
        console.log('👤 Registering system admin role...');
        await setDoc(adminUserRef, {
            uid: 'system-admin',
            email: adminEmail,
            displayName: 'System Admin',
            role: 'super-admin'
        })
    }

    console.log('✅ Seeding complete!');
}

seedData();
