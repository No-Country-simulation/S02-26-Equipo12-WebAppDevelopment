import { Router } from "express";
import { AIController } from "../controllers/ai.controller";

const router = Router();
const controller = new AIController();


/**
 * @swagger
 * /api/v1/ai/health:
 *   get:
 *     summary: Health check de la IA
 *     description: Retorna "ok" si la IA está operativa, "error" si hay algún problema.
 *     tags:
 *       - AI
 *     responses:
 *       200:
 *         description: IA operativa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.get("/health", controller.healthCheck);

export const AIRoutes = router;