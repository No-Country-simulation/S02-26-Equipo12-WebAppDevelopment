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

  /**
   * Analiza la recomendación y devuelve un mensaje con JSON de productos compatibles
   */
  async analyzeRecommendationJSON(
    _recommendation: EngineResult,
    products: {
      productId: string,
      name: string,
      recommendedSize: string,
      image?: string,
      description?: string
    }[],
    measurements: Record<string, number>,
    timeout = 5000
  ): Promise<string> {

    const prompt = `
You are an equestrian equipment sizing assistant.

User measurements:
${JSON.stringify(measurements)}

Products evaluated:
${JSON.stringify(products)}

Instructions:
- Generate a short message in Spanish starting with:
  "Según tus medidas, te recomiendo estos productos y estas tallas:"
- Include a valid JSON array of recommended products after the message.
- Each object in the JSON must include: productId, name, recommendedSize, image, description.
- Only include products compatible with the user's measurements.
- Ensure the JSON is valid and can be parsed.
- Keep the full response under 10 sentences.
- Use a friendly tone of conversation.
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

      // Imprimir respuesta completa de la IA en consola
      console.log('IA MESSAGE + JSON:', result.text);

      return result.text;

    } catch (err) {
      console.error('AI analyzeRecommendationJSON error:', err);
      return `Según tus medidas, te recomiendo estos productos: ${JSON.stringify(products)}`;
    }
  }

  /**
   * Deducir la subcategoría de producto a partir de un texto libre del usuario
   */
  async deduceSubCategory(userText: string, timeout = 3000): Promise<string | null> {

 const prompt = `
You are an AI that classifies equestrian products.

User text:
"${userText}"

Task:
Identify the product subcategory.

Output rules (STRICT):
- Return ONLY the subcategory name
- Return ONLY ONE WORD or ONE SHORT PHRASE
- NO JSON
- NO markdown
- NO code blocks
- NO explanations
- NO extra text
- If the product cannot be identified return exactly: Desconocido

Valid outputs:
Helmets
Boots
Gloves
Desconocido
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

      const subCategory = result.text.trim();
      return subCategory === "Desconocido" ? null : subCategory;

    } catch (err) {
      console.error('AI deduceSubCategory error:', err);
      return null;
    }
  }
}