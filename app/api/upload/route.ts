/**
 * POST /api/upload
 * Upload a file to a session
 */

import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { isSessionValid } from '@/lib/sessionStore';
import { storeFile, MAX_FILE_SIZE } from '@/lib/fileStore';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const sessionId = formData.get('sessionId') as string;
    
    // Validate inputs
    if (!sessionId || !file) {
      return NextResponse.json(
        { error: 'Missing sessionId or file' },
        { status: 400 }
      );
    }
    
    // Validate session
    if (!isSessionValid(sessionId)) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 404 }
      );
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
        { status: 413 }
      );
    }
    
    // Validate file type (images and PDFs only)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only images and PDFs are allowed' },
        { status: 400 }
      );
    }
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Store file
    const fileId = randomUUID();
    const storedFile = {
      id: fileId,
      sessionId,
      filename: file.name,
      mimetype: file.type,
      size: file.size,
      data: buffer,
      uploadedAt: Date.now(),
    };
    
    storeFile(storedFile);
    
    return NextResponse.json({
      success: true,
      file: {
        id: fileId,
        filename: file.name,
        mimetype: file.type,
        size: file.size,
        uploadedAt: storedFile.uploadedAt,
      },
    });
  } catch (error) {
    console.error('[API] Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
