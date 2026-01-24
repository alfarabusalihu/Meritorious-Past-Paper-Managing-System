import { Timestamp } from 'firebase/firestore'

// Firestore Schema Definitions

export interface Paper {
    id?: string;
    title: string;
    subject: string;
    year: number;
    language: string;

    // Soft Delete Status
    status: 'active' | 'deleted';

    // Multi-part file support
    files: {
        part1?: string;
        part2?: string;
        scheme?: string;
    };

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

    downloadCount?: number; // Track downloads
}

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    role: 'super-admin' | 'user';
    blocked?: boolean;
    photoURL?: string;
    papersUploaded?: number; // Track contributor stats
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
    language?: string;
    searchQuery?: string;
}
