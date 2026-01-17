/**
 * Session Store - In-memory session management with auto-expiry
 * Stores active sessions and their expiry times
 */

export interface Session {
  id: string;
  createdAt: number;
  expiresAt: number;
}

// Store sessions in memory (key: sessionId, value: Session)
const sessions = new Map<string, Session>();

// Session timeout: 10 minutes
const SESSION_TIMEOUT_MS = 10 * 60 * 1000;

/**
 * Create a new session
 */
export function createSession(sessionId: string): Session {
  const now = Date.now();
  const session: Session = {
    id: sessionId,
    createdAt: now,
    expiresAt: now + SESSION_TIMEOUT_MS,
  };
  
  sessions.set(sessionId, session);
  return session;
}

/**
 * Get a session by ID
 * Returns null if session doesn't exist or has expired
 */
export function getSession(sessionId: string): Session | null {
  const session = sessions.get(sessionId);
  
  if (!session) {
    return null;
  }
  
  // Check if session has expired
  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId);
    return null;
  }
  
  return session;
}

/**
 * Check if a session is valid (exists and not expired)
 */
export function isSessionValid(sessionId: string): boolean {
  return getSession(sessionId) !== null;
}

/**
 * Delete a session
 */
export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId);
}

/**
 * Invalidate a session immediately (for manual session reset)
 * This marks the session as expired so it can't be used anymore
 */
export function invalidateSession(sessionId: string): void {
  const session = sessions.get(sessionId);
  if (session) {
    // Set expiry to past time to invalidate it
    session.expiresAt = Date.now() - 1000;
  }
}

/**
 * Clean up expired sessions
 * This should be called periodically
 */
export function cleanupExpiredSessions(): number {
  const now = Date.now();
  let deletedCount = 0;
  
  for (const [sessionId, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      sessions.delete(sessionId);
      deletedCount++;
    }
  }
  
  return deletedCount;
}

// Auto-cleanup every minute
setInterval(() => {
  const deleted = cleanupExpiredSessions();
  if (deleted > 0) {
    console.log(`[SessionStore] Cleaned up ${deleted} expired sessions`);
  }
}, 60 * 1000);
