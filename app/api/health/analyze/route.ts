export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { analyzeHealthData, HealthAnalysis, ClinicalAnalysis } from '@/lib/openai';

interface AnalyzeRequest {
  type?: 'clinical_analysis';
  visit_summary?: any;
  date?: string;
  mood?: number;
  energy?: number;
  sleep?: number;
  symptoms?: string[];
  userProfile?: {
    age: number;
    gender: string;
    conditions: string[];
    medications: string[];
    allergies: string[];
    lifestyle: string;
  } | null;
}

export async function POST(req: Request) {
  try {
    const data: AnalyzeRequest = await req.json();
    
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