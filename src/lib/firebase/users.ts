import { db } from "../firebase";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { UserProfile } from "./schema";

const USERS_COLLECTION = "users";

export const usersApi = {
    async syncUser(uid: string, email: string, displayName: string): Promise<UserProfile> {
        const userRef = doc(db, USERS_COLLECTION, uid);
        const snapshot = await getDoc(userRef);

        const envSuperAdminEmail = import.meta.env.VITE_SUPER_ADMIN_EMAIL || 'admin@gmail.com';

        // Check if any super-admin exists in the DB
        const usersSnapshot = await getDocs(collection(db, USERS_COLLECTION));
        const hasSuperAdmin = usersSnapshot.docs.some(d => (d.data() as UserProfile).role === 'super-admin');

        if (snapshot.exists()) {
            const data = snapshot.data() as UserProfile;
            // If no super-admin exists and this user matches the env email, promote them
            if (!hasSuperAdmin && email === envSuperAdminEmail && data.role !== 'super-admin') {
                const updated = { ...data, role: 'super-admin' as const };
                await setDoc(userRef, updated, { merge: true });
                return updated;
            }
            return data;
        }

        // New User
        const newUser: UserProfile = {
            uid,
            email,
            displayName,
            role: (!hasSuperAdmin && email === envSuperAdminEmail) ? 'super-admin' : 'user',
            createdAt: new Date()
        };
        await setDoc(userRef, newUser);
        return newUser;
    },

    async getUserRole(uid: string): Promise<UserProfile['role']> {
        const userRef = doc(db, USERS_COLLECTION, uid);
        const snapshot = await getDoc(userRef);
        return (snapshot.data() as UserProfile)?.role || 'user';
    },

    async updateUserRole(uid: string, role: UserProfile['role']) {
        const userRef = doc(db, USERS_COLLECTION, uid);
        await setDoc(userRef, { role }, { merge: true });
    },

    async transferSuperAdmin(currentUid: string, targetUid: string) {
        // This is a sensitive operation - ideally should be a Cloud Function, 
        // but for now we do it client-side as requested for simplicity in this stage.
        const currentRef = doc(db, USERS_COLLECTION, currentUid);
        const targetRef = doc(db, USERS_COLLECTION, targetUid);

        await setDoc(currentRef, { role: 'admin' }, { merge: true });
        await setDoc(targetRef, { role: 'super-admin' }, { merge: true });
    },

    async getAllUsers(): Promise<UserProfile[]> {
        const snapshot = await getDocs(collection(db, USERS_COLLECTION));
        return snapshot.docs.map(doc => doc.data() as UserProfile);
    },

    async toggleBlockUser(uid: string, blocked: boolean) {
        const userRef = doc(db, USERS_COLLECTION, uid);
        await setDoc(userRef, { blocked }, { merge: true });
    }
};
