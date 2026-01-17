/**
 * POST /api/session/reset
 * Reset/end current session and create a new one
 */

import { NextRequest, NextResponse } from 'next/server';
import { invalidateSession, createSession } from '@/lib/sessionStore';
import { deleteFilesBySession } from '@/lib/fileStore';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing sessionId' },
        { status: 400 }
      );
    }
    
    console.log('[API] Resetting session:', sessionId);
    
    // Invalidate old session immediately
    invalidateSession(sessionId);
    
    // Delete all files associated with old session
    const deletedFiles = deleteFilesBySession(sessionId);
    console.log(`[API] Deleted ${deletedFiles} files from old session`);
    
    // Create new session
    const newSessionId = randomUUID();
    const newSession = createSession(newSessionId);
    
    console.log('[API] Created new session:', newSessionId);
    
    return NextResponse.json({
      newSessionId: newSession.id,
      expiresAt: newSession.expiresAt,
    });
  } catch (error) {
    console.error('[API] Error resetting session:', error);
    return NextResponse.json(
      { error: 'Failed to reset session' },
      { status: 500 }
    );
  }
}
