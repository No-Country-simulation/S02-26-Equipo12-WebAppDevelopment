import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY!,
});

export class AIServices {
    private model;

    constructor() {
        this.model = groq('openai/gpt-oss-20b');
    }

    async healthCheck(): Promise<string> {
        const { text } = await generateText({
            model: this.model,
            prompt: 'Respond only with "ok" if you are healthy, otherwise respond with "error".',
        });

        return text.trim();
    }
}