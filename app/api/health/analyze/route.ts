import { NextResponse } from 'next/server';
import { analyzeHealthData } from '@/lib/openai';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const analysis = await analyzeHealthData(data);
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Health analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze health data' },
      { status: 500 }
    );
  }
}