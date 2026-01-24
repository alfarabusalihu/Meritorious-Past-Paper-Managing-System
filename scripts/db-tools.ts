import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, QuerySnapshot, DocumentData } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config'; // Requires 'dotenv' to be installed or run with vite-node

// Firebase config from .env
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

async function exportCollection(name: string) {
    console.log(`Exporting ${name}...`);
    const colRef = collection(db, name);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function runSnapshot() {
    try {
        const data = {
            papers: await exportCollection('papers'),
            users: await exportCollection('users'),
            configs: await exportCollection('configs'),
            timestamp: new Date().toISOString()
        };

        fs.writeFileSync('db-snapshot.json', JSON.stringify(data, null, 2));
        console.log('✅ Snapshot saved to db-snapshot.json');

        // Health Check
        console.log('\n--- Health Check ---');
        let issues = 0;

        data.papers.forEach((p: any) => {
            if (!p.files) {
                console.warn(`⚠️  Paper [${p.id}] (${p.title}) is missing the 'files' object (Legacy).`);
                issues++;
            }
        });

        data.users.forEach((u: any) => {
            if (u.role === 'admin') {
                console.warn(`⚠️  User [${u.uid}] (${u.email}) has the legacy 'admin' role.`);
                issues++;
            }
        });

        if (issues === 0) {
            console.log('✅ No legacy data issues found!');
        } else {
            console.log(`\nFound ${issues} potential data alignment issues.`);
        }

    } catch (error) {
        console.error('❌ Error during snapshot:', error);
    }
}

runSnapshot();
