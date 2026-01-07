/**
 * File Store - In-memory file storage with session-based organization
 * Files are stored temporarily and deleted when sessions expire
 */

export interface StoredFile {
  id: string;
  sessionId: string;
  filename: string;
  mimetype: string;
  size: number;
  data: Buffer;
  uploadedAt: number;
}

// Store files in memory (key: fileId, value: StoredFile)
const files = new Map<string, StoredFile>();

// Maximum file size: 10 MB
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Store a file
 */
export function storeFile(file: StoredFile): void {
  files.set(file.id, file);
}

/**
 * Get a file by ID
 */
export function getFile(fileId: string): StoredFile | null {
  return files.get(fileId) || null;
}

/**
 * Get all files for a session
 */
export function getFilesBySession(sessionId: string): StoredFile[] {
  const sessionFiles: StoredFile[] = [];
  
  for (const file of files.values()) {
    if (file.sessionId === sessionId) {
      sessionFiles.push(file);
    }
  }
  
  // Sort by upload time (newest first)
  return sessionFiles.sort((a, b) => b.uploadedAt - a.uploadedAt);
}

/**
 * Delete a file
 */
export function deleteFile(fileId: string): boolean {
  return files.delete(fileId);
}

/**
 * Delete all files for a session
 */
export function deleteFilesBySession(sessionId: string): number {
  let deletedCount = 0;
  
  for (const [fileId, file] of files.entries()) {
    if (file.sessionId === sessionId) {
      files.delete(fileId);
      deletedCount++;
    }
  }
  
  return deletedCount;
}

/**
 * Get total file count
 */
export function getFileCount(): number {
  return files.size;
}

/**
 * Get total storage size in bytes
 */
export function getTotalStorageSize(): number {
  let total = 0;
  for (const file of files.values()) {
    total += file.size;
  }
  return total;
}
