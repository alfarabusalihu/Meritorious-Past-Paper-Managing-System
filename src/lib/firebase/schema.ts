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

    createdAt: any; // Firestore Timestamp
    updatedAt?: any;
}

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    role: 'admin' | 'user';
    blocked?: boolean;
    photoURL?: string;
    createdAt: any;
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
    timestamp: any;
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
