import { db, storage, auth } from "../firebase";
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
    getDoc
} from "firebase/firestore";
import { ref, uploadBytesResumable, UploadTaskSnapshot, getDownloadURL } from "firebase/storage";
import { Paper, FilterOptions } from "./schema";
import { formatFilenameToSentenceCase } from "../utils/string";
import { statsApi } from "./stats";

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
    async uploadFile(
        file: File,
        uploader: { uid: string; displayName: string },
        onProgress?: (percent: number) => void
    ) {
        const sentenceCaseName = formatFilenameToSentenceCase(file.name);
        const filePath = `papers/${Date.now()}_${sentenceCaseName}`;
        const storageRef = ref(storage, filePath);

        const uploadTask = uploadBytesResumable(storageRef, file, {
            contentType: file.type,
            customMetadata: {
                'uploadedBy': uploader.uid,
                'uploaderName': uploader.displayName,
                'originalName': file.name
            }
        });

        return new Promise<{ url: string; metadata: any }>((resolve, reject) => {
            let lastUpdate = 0;
            uploadTask.on('state_changed',
                (snapshot: UploadTaskSnapshot) => {
                    const now = Date.now();
                    // Throttle updates to every 100ms or if complete
                    if (now - lastUpdate > 100 || snapshot.bytesTransferred === snapshot.totalBytes) {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        if (onProgress) onProgress(progress);
                        lastUpdate = now;
                    }
                },
                (error: Error) => reject(error),
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    console.log('[DEBUG] Generated download URL:', downloadURL);

                    resolve({
                        url: downloadURL,
                        metadata: {
                            uploadedBy: uploader.uid,
                            uploaderName: uploader.displayName,
                            fileSize: file.size,
                            mimeType: file.type,
                            originalName: file.name
                        }
                    });
                }
            );
        });
    },

    async createPaper(data: Omit<Paper, "id" | "createdAt" | "keywords" | "status">) {
        const paper: Omit<Paper, "id"> = {
            ...data,
            status: 'active', // Default status
            keywords: generateKeywords(data.title, data.subject, data.year),
            downloadCount: data.downloadCount || 0,
            createdAt: Timestamp.now()
        };

        const docRef = await addDoc(collection(db, PAPERS_COLLECTION), paper);
        return { id: docRef.id, ...paper };
    },

    async uploadPaper(
        file: File,
        data: Omit<Paper, "id" | "files" | "createdAt" | "keywords" | "metadata" | "status">,
        uploader: { uid: string; displayName: string }
    ) {
        const { url, metadata } = await this.uploadFile(file, uploader);
        return this.createPaper({
            ...data,
            files: { part1: url },
            metadata
        });
    },

    async getPapers(filters: FilterOptions = {}) {
        let q: Query<DocumentData> = collection(db, PAPERS_COLLECTION);

        // Soft Delete Filter: Only show active papers
        q = query(q, where("status", "==", "active"));

        if (filters.subject) q = query(q, where("subject", "==", filters.subject));
        if (filters.year) {
            const yearNum = typeof filters.year === 'string' ? parseInt(filters.year) : filters.year;
            if (!isNaN(yearNum)) {
                q = query(q, where("year", "==", yearNum));
            }
        }
        if (filters.language) q = query(q, where("language", "==", filters.language));
        if (filters.searchQuery) {
            q = query(q, where("keywords", "array-contains", filters.searchQuery.toLowerCase()));
        }
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Paper));
    },

    async deletePaper(id: string) {
        // Soft Delete: Just mark as deleted
        const docRef = doc(db, PAPERS_COLLECTION, id);

        const currentUser = auth.currentUser;

        await updateDoc(docRef, {
            status: 'deleted',
            deletedAt: Timestamp.now(),
            deletedBy: {
                uid: currentUser?.uid || "system",
                email: currentUser?.email || "unknown",
                displayName: currentUser?.displayName || "Admin"
            }
        });
    },

    async checkPaperExists(filename: string) {
        const q = query(
            collection(db, PAPERS_COLLECTION),
            where("metadata.originalName", "==", filename),
            where("status", "==", "active") // Only check active papers
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
    },

    async incrementDownloadCount(paperId: string) {
        const docRef = doc(db, PAPERS_COLLECTION, paperId);
        try {
            const snapshot = await getDoc(docRef);
            if (snapshot.exists()) {
                const current = snapshot.data() as Paper;
                await updateDoc(docRef, {
                    downloadCount: (current.downloadCount || 0) + 1
                });

                // Also increment Global Engagement Stats
                await statsApi.incrementEngagement();
            }
        } catch (error) {
            console.error("Failed to increment download count:", error);
        }
    }
};
