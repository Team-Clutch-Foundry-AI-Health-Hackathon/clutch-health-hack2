export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Dynamically import loadPastCases to ensure it's server-side only
  const { loadPastCases } = await import('@/lib/openai');

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    await loadPastCases(buffer);

    return NextResponse.json({ 
      message: 'Past cases loaded successfully',
      fileSize: buffer.length
    });
  } catch (error) {
    console.error('Error loading past cases:', error);
    return NextResponse.json(
      { 
        error: 'Failed to load past cases',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 