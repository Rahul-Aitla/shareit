/**
 * GET /api/download/[fileId]
 * Download a file
 */

import { NextRequest, NextResponse } from 'next/server';
import { getFile } from '@/lib/fileStore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params;
    
    console.log('[API] Download request for fileId:', fileId);
    
    // Get file
    const file = getFile(fileId);
    
    if (!file) {
      console.error('[API] File not found:', fileId);
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    
    console.log('[API] File found:', file.filename, 'mimetype:', file.mimetype);
    
    // Return file data
    // Convert Buffer to Uint8Array for NextResponse
    const buffer = new Uint8Array(file.data);
    
    // Use 'inline' for images and PDFs so they can be previewed in browser
    // Use 'attachment' for other files to force download
    const isPreviewable = file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf';
    const disposition = isPreviewable 
      ? `inline; filename="${file.filename}"`
      : `attachment; filename="${file.filename}"`;
    
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': file.mimetype,
        'Content-Disposition': disposition,
        'Content-Length': file.size.toString(),
      },
    });
  } catch (error) {
    console.error('[API] Error downloading file:', error);
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    );
  }
}
