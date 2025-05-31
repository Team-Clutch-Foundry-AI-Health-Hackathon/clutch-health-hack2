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

Provide:
1. A short summary of their health status
2. Any potential health concerns based on their data and demographics
3. 2-3 personalized wellness tips
4. Whether they should see a doctor (routine checkup, soon, or urgent) and if so, what type of specialist and why

Format your response in JSON matching the HealthAnalysis type.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: "You are a knowledgeable healthcare assistant. Provide clear, professional analysis while being mindful of medical ethics and privacy. Never make definitive medical diagnoses."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content) as HealthAnalysis;
}