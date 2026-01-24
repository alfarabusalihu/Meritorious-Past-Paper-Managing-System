
export function toSentenceCase(str: string): string {
    if (!str) return str;

    // 1. Remove all characters except text, numbers, spaces, and parentheses
    // 2. Replace underscores and hyphens with spaces
    let cleaned = str.replace(/[_\-]+/g, ' ');
    cleaned = cleaned.replace(/[^a-zA-Z0-9\s()]/g, '');

    // 3. Clean up multiple spaces
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    if (!cleaned) return '';

    // 4. Apply sentence case
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
}

/**
 * Transforms a filename to Sentence case while preserving the extension.
 */
export function formatFilenameToSentenceCase(filename: string): string {
    const parts = filename.split('.');
    if (parts.length <= 1) return toSentenceCase(filename);

    const extension = parts.pop();
    const nameWithoutExtension = parts.join('.');

    return `${toSentenceCase(nameWithoutExtension)}.${extension}`;
}
