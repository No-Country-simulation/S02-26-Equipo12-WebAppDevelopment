import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { EngineResult } from './recommendation.engine';

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY!,
});

export class AIServices {
    private model;

    constructor() {
        this.model = groq('openai/gpt-oss-20b');
    }

    /** Health check de la IA */
    async healthCheck(timeout = 3000): Promise<string> {
        try {
            const result = await Promise.race([
                generateText({
                    model: this.model,
                    prompt: 'Respond only with "ok" if you are healthy, otherwise respond with "error".',
                }),
                new Promise<{ text: string }>((_, reject) =>
                    setTimeout(() => reject(new Error('AI timeout')), timeout)
                )
            ]);

            return result.text.trim();
        } catch (err) {
            console.error('AI health check error:', err);
            return 'error';
        }
    }

    /** Analiza la recomendación y devuelve un insight opcional */
    async analyzeRecommendation(
  recommendation: EngineResult,
  context: {
    productName: string,
    measurements: Record<string, number>
  },
  timeout = 5000
): Promise<string> {

  const prompt = `
You are an equestrian equipment sizing assistant.

Product:
${context.productName}

User measurements:
${JSON.stringify(context.measurements)}

Sizing engine result:
${JSON.stringify(recommendation)}

Instructions:
- If a size is recommended, explain briefly why.
- If there are no compatible sizes, explain what the rider could adjust.
- If data is incomplete, say what measurements are missing.
- Keep the answer under 2 sentences.
- Do not invent horse context if the product is for the rider.

Respond with a short advice only.
`;

  try {
    const result = await Promise.race([
      generateText({
        model: this.model,
        prompt
      }),
      new Promise<{ text: string }>((_, reject) =>
        setTimeout(() => reject(new Error('AI timeout')), timeout)
      )
    ]);

    return result.text.trim();

  } catch (err) {
    console.error('AI analyzeRecommendation error:', err);
    return 'No advice available';
  }
}
}