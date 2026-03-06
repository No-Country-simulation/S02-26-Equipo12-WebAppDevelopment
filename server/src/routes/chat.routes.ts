import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";

export class ChatRoutes {
    static get routes() {
        const router = Router();
        const controller = new ChatController();

        /**
 /**
 * @openapi
 * /chat/recommend-products:
 *   post:
 *     summary: Obtiene recomendaciones de productos para un rider a partir de texto libre
 *     tags:
 *       - Chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - riderId
 *               - horseId
 *               - userText
 *             properties:
 *               riderId:
 *                 type: string
 *                 format: uuid
 *                 example: "14a33b01-fe5b-4410-b20a-606e39bcbbe5"
 *               horseId:
 *                 type: string
 *                 format: uuid
 *                 example: "00000000-0000-0000-0000-000000000001"
 *               userText:
 *                 type: string
 *                 example: "Quiero botines de montar"
 *     responses:
 *       200:
 *         description: Lista de productos recomendados con la talla sugerida
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   image:
 *                     type: string
 *                   recommendedSize:
 *                     type: string
 *       400:
 *         description: No se pudo deducir la subcategoría
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

        router.post("/recommend-products", controller.recommendProducts);

        return router;

    }
}
