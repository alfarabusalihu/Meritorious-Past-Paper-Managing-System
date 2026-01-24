import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Helper to strip gs:// and paths from bucket URLs
const getBucketName = (url?: string) => {
    if (!url) return undefined;
    // Remove gs:// prefix if present
    const cleaned = url.replace('gs://', '');
    // Return just the bucket name (before any /)
    return cleaned.split('/')[0];
};

// Initialize Firebase (Singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Set persistence to session (clears on tab close)
setPersistence(auth, browserSessionPersistence).catch((error) => {
    console.error("Failed to set auth persistence:", error);
});

// Use the bucket name directly from env (no processing needed for new format)
const mainBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;

console.log("Firebase Storage Bucket:", mainBucket);

export const db = getFirestore(app);
export const storage = getStorage(app, mainBucket);
