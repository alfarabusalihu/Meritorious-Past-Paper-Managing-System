import { Timestamp } from 'firebase/firestore'

// Firestore Schema Definitions

export interface Paper {
    id?: string;
    title: string;
    subject: string;
    year: number;
    examType: string; // 'Final', 'Midterm', etc.
    part: string;
    language: string;
    fileUrl: string;

    // Search Optimization
    keywords: string[]; // ['m', 'ma', 'math', '2023']

    // Denormalized Metadata for UI efficiency
    metadata: {
        uploadedBy: string; // User UID
        uploaderName: string; // Display Name
        fileSize?: number;
        mimeType?: string;
        originalName?: string;
    };

    createdAt: Timestamp | Date; // Firestore Timestamp
    updatedAt?: Timestamp | Date;
}

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    role: 'admin' | 'user' | 'super-admin';
    blocked?: boolean;
    photoURL?: string;
    createdAt: Timestamp | Date;
}

export interface Contribution {
    id?: string;
    donorName: string;
    email: string;
    amount: number;
    currency: string;
    status: 'succeeded' | 'pending' | 'failed';
    coffeeCount: number;
    message?: string;
    timestamp: Timestamp | Date;
    receiptId?: string;
}

export interface FilterOptions {
    subject?: string;
    year?: number;
    examType?: string;
    part?: string;
    language?: string;
    searchQuery?: string;
}
