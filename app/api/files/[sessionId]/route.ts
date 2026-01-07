/**
 * GET /api/files/[sessionId]
 * Fetch all files for a session
 */

import { NextRequest, NextResponse } from 'next/server';
import { isSessionValid } from '@/lib/sessionStore';
import { getFilesBySession } from '@/lib/fileStore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    
    // Validate session
    if (!isSessionValid(sessionId)) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 404 }
      );
    }
    
    // Get files
    const files = getFilesBySession(sessionId);
    
    // Return file metadata (without data)
    const fileList = files.map((file) => ({
      id: file.id,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      uploadedAt: file.uploadedAt,
    }));
    
    return NextResponse.json({
      success: true,
      files: fileList,
    });
  } catch (error) {
    console.error('[API] Error fetching files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}
