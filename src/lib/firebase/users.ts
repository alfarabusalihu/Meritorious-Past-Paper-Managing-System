import { db } from "../firebase";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { UserProfile } from "./schema";

const USERS_COLLECTION = "users";

export const usersApi = {
    async syncUser(uid: string, email: string, displayName: string): Promise<UserProfile> {
        const userRef = doc(db, USERS_COLLECTION, uid);
        const snapshot = await getDoc(userRef);

        const envAdminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@gmail.com';
        const isEnvAdmin = email === envAdminEmail;

        if (snapshot.exists()) {
            const data = snapshot.data() as UserProfile;
            if (isEnvAdmin && data.role !== 'admin') {
                await setDoc(userRef, { ...data, role: 'admin' }, { merge: true });
                return { ...data, role: 'admin' };
            }
            return data;
        }

        const newUser: UserProfile = {
            uid,
            email,
            displayName,
            role: isEnvAdmin ? 'admin' : 'user',
            createdAt: new Date().toISOString()
        };
        await setDoc(userRef, newUser);
        return newUser;
    },
    async getUserRole(uid: string): Promise<'admin' | 'user'> {
        const userRef = doc(db, USERS_COLLECTION, uid);
        const snapshot = await getDoc(userRef);
        const data = snapshot.data();

        const envAdminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@gmail.com';
        if (data?.email === envAdminEmail) return 'admin';

        return data?.role || 'user';
    },

    async updateUserRole(uid: string, role: 'admin' | 'user') {
        const userRef = doc(db, USERS_COLLECTION, uid)
        await setDoc(userRef, { role }, { merge: true })
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
