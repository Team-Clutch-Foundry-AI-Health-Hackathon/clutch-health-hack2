import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
});

export interface HealthAnalysis {
  summary: string;
  concerns: string[];
  tips: string[];
  doctorRecommendation: {
    needed: boolean;
    urgency: 'routine' | 'soon' | 'urgent';
    specialistType?: string;
    reason?: string;
  };
}

export async function analyzeHealthData(userData: any): Promise<HealthAnalysis> {
  const prompt = `You are a helpful virtual health assistant. Analyze this patient's self-reported health data:

${JSON.stringify(userData, null, 2)}

Provide your analysis in the following EXACT JSON format:
{
  "summary": "A brief summary of their health status",
  "concerns": ["List of potential health concerns"],
  "tips": ["List of 2-3 personalized wellness tips"],
  "doctorRecommendation": {
    "needed": true/false,
    "urgency": "routine" or "soon" or "urgent",
    "specialistType": "Type of specialist if needed",
    "reason": "Reason for recommendation"
  }
}

Make sure to:
1. Include ALL fields exactly as shown
2. Use arrays for concerns and tips
3. Use the exact urgency values: "routine", "soon", or "urgent"
4. Return ONLY the JSON object, no other text`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable healthcare assistant. Provide clear, professional analysis while being mindful of medical ethics and privacy. Never make definitive medical diagnoses. Always return valid JSON matching the exact structure requested."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    if (!response.choices?.[0]?.message?.content) {
      throw new Error('No response content from OpenAI');
    }

    console.log('OpenAI Response:', response.choices[0].message.content);

    const analysis = JSON.parse(response.choices[0].message.content) as HealthAnalysis;

    // Validate the response structure
    if (!analysis.summary || !Array.isArray(analysis.concerns) || !Array.isArray(analysis.tips) || !analysis.doctorRecommendation) {
      console.error('Invalid analysis structure:', analysis);
      throw new Error('Invalid response structure from OpenAI');
    }

    // Validate doctorRecommendation structure
    if (typeof analysis.doctorRecommendation.needed !== 'boolean' || 
        !['routine', 'soon', 'urgent'].includes(analysis.doctorRecommendation.urgency)) {
      console.error('Invalid doctorRecommendation structure:', analysis.doctorRecommendation);
      throw new Error('Invalid doctorRecommendation structure');
    }

    return analysis;
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Return a default analysis in case of error
    return {
      summary: "Unable to analyze health data at this time.",
      concerns: ["Unable to analyze concerns"],
      tips: ["Please try again later"],
      doctorRecommendation: {
        needed: false,
        urgency: "routine",
        reason: "Unable to complete analysis"
      }
    };
  }
}