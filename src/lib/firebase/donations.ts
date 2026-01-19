import { db } from "../firebase";
import { collection, addDoc, getDocs, orderBy, query, limit } from "firebase/firestore";
import { Contribution } from "./schema";

const DONATIONS_COLLECTION = "contributions";

export const donationsApi = {
    async addContribution(contribution: Omit<Contribution, 'id' | 'timestamp'>): Promise<string> {
        const docRef = await addDoc(collection(db, DONATIONS_COLLECTION), {
            ...contribution,
            timestamp: new Date().toISOString()
        });
        return docRef.id;
    },

    async getContributions(): Promise<Contribution[]> {
        const q = query(collection(db, DONATIONS_COLLECTION), orderBy("timestamp", "desc"), limit(50));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contribution));
    },

    async getTotalDonationAmount(): Promise<number> {
        // Note: For large scale, use aggregation queries or cloud functions.
        // For client-side simple total:
        const snapshot = await getDocs(collection(db, DONATIONS_COLLECTION));
        return snapshot.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
    }
};
