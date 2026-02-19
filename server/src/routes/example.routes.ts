import { Router } from "express"
import { ExampleController } from "../controllers/example.controller"

export class ExampleRoutes {
  static get routes() {
    const router = Router()
    const controller = new ExampleController()

    /**
     * @swagger
     * /example:
     *   get:
     *     tags: [Example]
     *     summary: A welcome message
     *     responses:
     *       200:
     *         description: A welcome message
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */
    router.get('/', controller.example)

    /**
     * @swagger
     * /example/another:
     *   get:
     *     tags: [Example]
     *     summary: Another welcome message
     *     responses:
     *       200:
     *         description: A welcome message
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */
    router.get('/another', controller.example)

    return router
  }
}