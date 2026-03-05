import { Router } from "express";
import { RecommendationController } from "../controllers/recommendation.controller";

/**
 * @swagger
 * tags:
 *   name: Recommendations
 *   description: Endpoints para obtener recomendaciones de tallas
 */

export class RecommendationRoutes {

    static get routes() {
        const router = Router();
        const controller = new RecommendationController();

        // Endpoint para obtener recomendación
        /**
 * @swagger
 * /recommendations/{productId}/{riderId}/{horseId}:
 *   get:
 *     summary: Obtiene la recomendación de talla para un producto dado un rider y horse
 *     tags: [Recommendations]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *       - in: path
 *         name: riderId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del rider
 *       - in: path
 *         name: horseId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del horse
 *     responses:
 *       200:
 *         description: Recomendación de tallas calculada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [OK, INCOMPLETE_MEASUREMENT_DATA, NO_COMPATIBLE_SIZES]
 *                 missingMeasurements:
 *                   type: array
 *                   items:
 *                     type: string
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       sizeLabel:
 *                         type: string
 *                       score:
 *                         type: number
 *                       confidence:
 *                         type: number
 *       400:
 *         description: Faltan parámetros requeridos
 *       500:
 *         description: Error interno del servidor
 */

        router.get("/:productId/:riderId/:horseId", controller.getRecommendation);

        return router
    }

}