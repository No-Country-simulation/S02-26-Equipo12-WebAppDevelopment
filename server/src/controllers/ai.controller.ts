import { Request, Response } from "express";
import { AIServices } from "../services/ia.services";

export class AIController {
    private aiService = new AIServices();

    /** Health check de la IA */
    healthCheck = async (_req: Request, res: Response) => {
        try {
            const status = await this.aiService.healthCheck();
            res.status(200).json({ status });
        } catch (err: any) {
            console.error(err);
            res.status(500).json({ status: "error", message: err.message || "Internal server error" });
        }
    };
}