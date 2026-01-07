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
    
    // Get file
    const file = getFile(fileId);
    
    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    
    // Return file data
    // Convert Buffer to Uint8Array for NextResponse
    const buffer = new Uint8Array(file.data);
    
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': file.mimetype,
        'Content-Disposition': `attachment; filename="${file.filename}"`,
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
