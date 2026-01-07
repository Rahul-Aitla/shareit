/**
 * POST /api/session
 * Create a new file sharing session
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/sessionStore';

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();
    
    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }
    
    const session = createSession(sessionId);
    
    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        expiresAt: session.expiresAt,
      },
    });
  } catch (error) {
    console.error('[API] Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
