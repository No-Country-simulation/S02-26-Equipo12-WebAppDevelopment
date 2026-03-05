import { Request, Response } from "express";
import { RecommendationService } from "../services/recommendation.service";
import { AIServices } from "../services/ia.services";

export class RecommendationController {
    private service = new RecommendationService();
    private aiService = new AIServices();

    getRecommendation = async (req: Request, res: Response) => {
        try {
            // ✅ Forzar strings seguros
            const productId = Array.isArray(req.params.productId)
                ? req.params.productId[0]
                : req.params.productId;

            const riderId = Array.isArray(req.params.riderId)
                ? req.params.riderId[0]
                : req.params.riderId;

            const horseId = Array.isArray(req.params.horseId)
                ? req.params.horseId[0]
                : req.params.horseId;

            if (!productId || !riderId || !horseId) {
                return res.status(400).json({ error: "Missing required parameters" });
            }

            // Ejecutar service
            const engineResult = await this.service.getRecommendations(riderId, horseId, productId);

            //obtener insight de ia
            const aiInsight = await this.aiService.analyzeRecommendation(engineResult);

            res.status(200).json({
                engineResult,
                ai: aiInsight
            });
            
        } catch (err: any) {
            console.error(err);
            res.status(500).json({ error: err.message || "Internal server error" });
        }
    };
}