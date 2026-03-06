import { Request, Response } from "express";
import { ChatRecommendationService } from "../services/chatRecommendation.service";
import { AIServices } from "../services/ia.services";
import { EngineStatus } from "../services/recommendation.engine";

export class ChatController {

  private service = new ChatRecommendationService();
  private aiService = new AIServices();

  recommendProducts = async (req: Request, res: Response) => {

    try {

      const { riderId, horseId, userText } = req.body;

      console.log("CHAT REQUEST", { riderId, horseId, userText });

      // 1️⃣ IA deduce subcategoría
      let subCategoryName = await this.aiService.deduceSubCategory(userText);

      if (!subCategoryName) {
        return res.status(400).json({
          error: "No se pudo deducir la subcategoría."
        });
      }

      // 2️⃣ Sanitizar salida IA
      subCategoryName = subCategoryName
        .replace(/```/g, "")
        .replace(/[{}"]/g, "")
        .split("\n")[0]
        .trim();

      console.log("Sanitized subCategory:", subCategoryName);

      // 3️⃣ Obtener recomendaciones reales del sistema
      const results = await this.service.recommendProducts(
        riderId,
        horseId,
        subCategoryName
      );

      console.log("CHAT RESULTS", results);

      if (!results.length) {
        return res.json({
          message: "No encontré productos compatibles con tus medidas.",
          products: []
        });
      }

      // 4️⃣ IA genera explicación en texto
      const aiMessage = await this.aiService.analyzeRecommendationJSON(
        {
          status: EngineStatus.OK,
          results: results.map(p => ({
            sizeLabel: p.recommendedSize,
            score: 0,
            confidence: 1
          }))
        },
        results,
        { head_circumference_cm: 56 }
      );

      console.log("RAW AI MESSAGE:", aiMessage);

      // 5️⃣ LIMPIEZA FUERTE DEL MENSAJE
      let cleanMessage = aiMessage || "";

      // eliminar markdown
      cleanMessage = cleanMessage
        .replace(/```json/g, "")
        .replace(/```/g, "");

      // eliminar cualquier JSON array
      cleanMessage = cleanMessage.replace(/\[[\s\S]*?\]/g, "");

      // eliminar cualquier JSON object
      cleanMessage = cleanMessage.replace(/\{[\s\S]*?\}/g, "");

      // limpiar espacios
      cleanMessage = cleanMessage.trim();

      // fallback si la IA devuelve algo vacío
      if (!cleanMessage) {
        cleanMessage = "Según tus medidas, estos productos podrían quedarte bien.";
      }

      console.log("CLEAN AI MESSAGE:", cleanMessage);

      // 6️⃣ RESPUESTA FINAL
      res.json({
        message: cleanMessage,
        products: results
      });

    } catch (error) {

      console.error("CHAT ERROR", error);

      res.status(500).json({
        error: "chat recommendation failed"
      });

    }

  };

}