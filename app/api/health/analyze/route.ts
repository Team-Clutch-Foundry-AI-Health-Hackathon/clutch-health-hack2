export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { analyzeHealthData } from '@/lib/openai';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    if (!data) {
      return NextResponse.json(
        { error: 'No data provided' },
        { status: 400 }
      );
    }

    const analysis = await analyzeHealthData(data);
    
    if (!analysis) {
      throw new Error('No analysis returned');
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Health analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze health data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}