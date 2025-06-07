import OpenAI from 'openai';
import pdfParse from 'pdf-parse';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
});

interface HealthData {
  [key: string]: any;
}

export interface HealthAnalysis {
  analysis: string;
  comparison: string;
  riskFactors: string[];
  recommendations: string[];
  diagnosis: {
    guidelines: string[];
    nextSteps: string[];
  };
  prognosis: {
    researchBased: string;
    visitBased: string;
  };
  finalRecommendation: string;
  references: {
    journal: string;
    title: string;
    year: string;
    url: string;
  }[];
}

interface PastCase {
  date: string;
  diagnosis: string[];
  treatment: string[];
  outcome: string[];
}

// Initialize past cases cache
let pastCasesCache: PastCase[] = [];

async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
}

export async function loadPastCases(pdfBuffer: Buffer): Promise<void> {
  try {
    const text = await extractTextFromPDF(pdfBuffer);
    const cases = parseCasesFromText(text);
    pastCasesCache = cases;
  } catch (error) {
    console.error('Error loading past cases:', error);
    throw error;
  }
}

function parseCasesFromText(text: string): PastCase[] {
  const cases: PastCase[] = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let currentCase: Partial<PastCase> = {};
  
  for (const line of lines) {
    // Look for date patterns (e.g., MM/DD/YYYY or Month DD, YYYY)
    const dateMatch = line.match(/(\d{1,2}\/\d{1,2}\/\d{4})|([A-Za-z]+\s+\d{1,2},\s+\d{4})/);
    if (dateMatch) {
      // If we have a previous case, save it
      if (currentCase.date && currentCase.diagnosis?.length) {
        cases.push(currentCase as PastCase);
      }
      // Start a new case
      currentCase = {
        date: dateMatch[0],
        diagnosis: [],
        treatment: [],
        outcome: []
      };
      continue;
    }

    // Look for diagnosis indicators
    if (line.toLowerCase().includes('diagnosis:') || line.toLowerCase().includes('dx:')) {
      const diagnosis = line.split(':')[1]?.trim() || '';
      if (diagnosis) {
        currentCase.diagnosis = [diagnosis];
      }
      continue;
    }

    // Look for treatment indicators
    if (line.toLowerCase().includes('treatment:') || line.toLowerCase().includes('tx:')) {
      const treatment = line.split(':')[1]?.trim() || '';
      if (treatment) {
        currentCase.treatment = [treatment];
      }
      continue;
    }

    // Look for outcome indicators
    if (line.toLowerCase().includes('outcome:') || line.toLowerCase().includes('result:')) {
      const outcome = line.split(':')[1]?.trim() || '';
      if (outcome) {
        currentCase.outcome = [outcome];
      }
      continue;
    }

    // If we're in a case and the line doesn't match any patterns,
    // append it to the last non-empty field
    if (currentCase.date) {
      if (!currentCase.diagnosis?.length) {
        currentCase.diagnosis = [line];
      } else if (!currentCase.treatment?.length) {
        currentCase.treatment = [line];
      } else if (!currentCase.outcome?.length) {
        currentCase.outcome = [line];
      }
    }
  }

  // Add the last case if it exists
  if (currentCase.date && currentCase.diagnosis?.length) {
    cases.push(currentCase as PastCase);
  }

  return cases;
}

export async function analyzeHealthData(data: HealthData): Promise<HealthAnalysis> {
  try {
    const pastCasesText = pastCasesCache.map(case_ => 
      `Date: ${case_.date}\nDiagnosis: ${case_.diagnosis.join(', ')}\nTreatment: ${case_.treatment.join(', ')}\nOutcome: ${case_.outcome.join(', ')}`
    ).join('\n\n');

    const prompt = `Analyze the following health data and past medical cases. Provide a detailed analysis with at least 3 relevant African-focused medical journal references or research articles.

Current Health Data:
${JSON.stringify(data, null, 2)}

Past Medical Cases:
${pastCasesText}

Please provide:
1. A detailed analysis of the current health data
2. Comparison with past cases
3. Potential risk factors and concerns
4. Recommendations for monitoring and follow-up
5. Diagnosis guidelines and recommended next steps
6. Prognosis analysis based on:
   - Current medical research
   - Similar cases from previous visits
7. Final recommendation with clear action items, including: order diagnosis X, administer medication Y based on research and past visits, consider imaging Z (if relevant), review lab A results, and provide a prognosis percentage (e.g., X% chance of Y outcome) based on past visits and research.
8. At least 3 relevant African-focused medical journal references with titles, years, and links to the articles

Format the response as a JSON object with the following structure:
{
  "analysis": "Detailed analysis text",
  "comparison": "Comparison with past cases",
  "riskFactors": ["Factor 1", "Factor 2", ...],
  "recommendations": ["Recommendation 1", "Recommendation 2", ...],
  "diagnosis": {
    "guidelines": ["Guideline 1", "Guideline 2", ...],
    "nextSteps": ["Step 1", "Step 2", ...]
  },
  "prognosis": {
    "researchBased": "Prognosis based on current medical research",
    "visitBased": "Prognosis based on similar past cases"
  },
  "finalRecommendation": "Clear, actionable final recommendation, including diagnosis, medication, imaging (if present), lab results, and prognosis percentage.",
  "references": [
    {
      "journal": "Journal name",
      "title": "Paper title",
      "year": "Publication year",
      "url": "Link to the article"
    }
  ]
}

IMPORTANT: Return ONLY the JSON object, without any markdown formatting or code block syntax.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a medical AI assistant. Provide detailed, evidence-based analysis with proper medical journal references. Consider both current medical guidelines and patterns from past cases when making recommendations. Return ONLY the JSON object without any markdown formatting."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = response.choices[0].message.content || '{}';
    // Clean the response by removing any markdown code block syntax
    const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
    const analysis = JSON.parse(cleanedContent) as HealthAnalysis;

    // Validate response structure
    if (!analysis.analysis || !analysis.comparison || !Array.isArray(analysis.riskFactors) || 
        !Array.isArray(analysis.recommendations) || !Array.isArray(analysis.references) || 
        analysis.references.length < 3 || !analysis.diagnosis || !analysis.prognosis || 
        !analysis.finalRecommendation) {
      throw new Error('Invalid response structure from OpenAI');
    }

    return analysis;
  } catch (error) {
    console.error('Error analyzing health data:', error);
    throw error;
  }
}