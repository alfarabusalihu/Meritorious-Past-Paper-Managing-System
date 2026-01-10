/** @vitest-environment node */
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { calculateHash } from './crypto-utils';
import { webcrypto } from 'node:crypto';

beforeAll(() => {
    if (!globalThis.crypto) {
        // @ts-ignore
        globalThis.crypto = webcrypto;
    }
});

describe('calculateHash', () => {
    it('should generate a consistent SHA-256 hash for a file', async () => {
        // Create a dummy file
        const content = 'hello world';
        const file = new File([content], 'test.txt', { type: 'text/plain' });

        // Calculate hash
        const hash = await calculateHash(file);

        // Expected SHA-256 for "hello world"
        // b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9
        expect(hash).toBe('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9');
    });

    it('should generate different hashes for different content', async () => {
        const file1 = new File(['content 1'], 'file1.txt');
        const file2 = new File(['content 2'], 'file2.txt');

        const hash1 = await calculateHash(file1);
        const hash2 = await calculateHash(file2);

        expect(hash1).not.toBe(hash2);
    });
});
