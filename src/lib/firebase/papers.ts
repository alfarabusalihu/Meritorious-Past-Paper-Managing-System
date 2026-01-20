import { db, storage } from "../firebase";
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    Timestamp,
    DocumentData,
    Query,
    updateDoc,
    doc,
    deleteDoc,
    getDoc,
    FieldValue
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Paper, FilterOptions } from "./schema";

const PAPERS_COLLECTION = "papers";

const generateKeywords = (title: string, subject: string, year: number): string[] => {
    const words = [title.toLowerCase(), subject.toLowerCase(), year.toString()];
    const keywords = new Set<string>();
    words.forEach(word => {
        let current = "";
        for (const char of word) {
            current += char;
            keywords.add(current);
        }
    });
    return Array.from(keywords);
};

export const papersApi = {
    async uploadFile(file: File, uploader: { uid: string; displayName: string }) {
        const storageRef = ref(storage, `papers/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        return {
            url: downloadURL,
            metadata: {
                uploadedBy: uploader.uid,
                uploaderName: uploader.displayName,
                fileSize: file.size,
                mimeType: file.type,
                originalName: file.name
            }
        };
    },

    async uploadPaper(
        file: File,
        data: Omit<Paper, "id" | "fileUrl" | "createdAt" | "keywords" | "metadata">,
        uploader: { uid: string; displayName: string }
    ) {
        const { url, metadata } = await this.uploadFile(file, uploader);

        const paper: Omit<Paper, "id"> = {
            ...data,
            fileUrl: url,
            keywords: generateKeywords(data.title, data.subject, data.year),
            metadata,
            createdAt: Timestamp.now()
        };

        const docRef = await addDoc(collection(db, PAPERS_COLLECTION), paper);
        return { id: docRef.id, ...paper };
    },

    async getPapers(filters: FilterOptions = {}) {
        let q: Query<DocumentData> = collection(db, PAPERS_COLLECTION);
        if (filters.subject) q = query(q, where("subject", "==", filters.subject));
        if (filters.year) q = query(q, where("year", "==", filters.year));
        if (filters.examType) q = query(q, where("examType", "==", filters.examType));
        if (filters.part) q = query(q, where("part", "==", filters.part));
        if (filters.language) q = query(q, where("language", "==", filters.language));
        if (filters.searchQuery) {
            q = query(q, where("keywords", "array-contains", filters.searchQuery.toLowerCase()));
        }
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Paper));
    },

    async getDeletedPapers() {
        const q = query(collection(db, PAPERS_COLLECTION), where("deleted", "==", true));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Paper));
    },

    async deletePaper(id: string, user: { uid: string }) {
        await updateDoc(doc(db, PAPERS_COLLECTION, id), {
            deleted: true,
            deletedAt: Timestamp.now(),
            deletedBy: user.uid
        });
    },

    async restorePaper(id: string) {
        await updateDoc(doc(db, PAPERS_COLLECTION, id), {
            deleted: false,
            deletedAt: FieldValue.delete(),
            deletedBy: FieldValue.delete()
        });
    },

    async permanentDeletePaper(id: string) {
        await deleteDoc(doc(db, PAPERS_COLLECTION, id));
    },

    async checkPaperExists(filename: string) {
        const q = query(
            collection(db, PAPERS_COLLECTION),
            where("metadata.originalName", "==", filename)
        );
        const snapshot = await getDocs(q);
        return !snapshot.empty;
    },

    async updatePaper(id: string, data: Partial<Paper>) {
        const docRef = doc(db, PAPERS_COLLECTION, id);

        // Regenerate keywords if title/subject/year changed
        const updates = { ...data };
        if (data.title || data.subject || data.year) {
            const snapshot = await getDoc(docRef);
            if (snapshot.exists()) {
                const current = snapshot.data() as Paper;
                const newTitle = data.title || current.title;
                const newSubject = data.subject || current.subject;
                const newYear = data.year || current.year;
                updates.keywords = generateKeywords(newTitle, newSubject, newYear);
            }
        }

        await updateDoc(docRef, updates);
    }
};
