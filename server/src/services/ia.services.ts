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
    async analyzeRecommendation(recommendation: EngineResult, timeout = 5000): Promise<string> {
        const prompt = `
Analyze the following recommendation and give concise advice for the rider/horse:
${JSON.stringify(recommendation)}
Only respond with a short advice or comment.
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