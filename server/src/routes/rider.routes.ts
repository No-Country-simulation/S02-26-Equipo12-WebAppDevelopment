import { Router } from "express"
import { RiderController } from "../controllers/rider.controller"
import { authMiddleware } from "../middleware/auth.middleware"


export class RiderRoutes {
    static get routes() {
        const router = Router()
        const controller = new RiderController()

        /**
         * @swagger
         * /riders:
         *   get:
         *     tags: [Riders]
         *     summary: Get all riders
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: List of riders
         *       401:
         *         description: Unauthorized
         */
        router.get('/', authMiddleware, controller.getAll)

        /**
         * @swagger
         * /riders/{id}:
         *   get:
         *     tags: [Riders]
         *     summary: Get a rider by ID
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Rider found
         *       401:
         *         description: Unauthorized
         *       404:
         *         description: Rider not found
         */
        router.get('/:id', authMiddleware, controller.getById)

        /**
         * @swagger
         * /riders/{id}:
         *   put:
         *     tags: [Riders]
         *     summary: Update a rider
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               name:
         *                 type: string
         *               lastName:
         *                 type: string
         *               birthDate:
         *                 type: string
         *               gender:
         *                 type: string
         *                 enum: [male, female]
         *     responses:
         *       200:
         *         description: Rider updated successfully
         *       401:
         *         description: Unauthorized
         *       404:
         *         description: Rider not found
         */
        router.put('/:id', authMiddleware, controller.update)

        /**
         * @swagger
         * /riders/{id}:
         *   delete:
         *     tags: [Riders]
         *     summary: Delete a rider
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Rider deleted successfully
         *       401:
         *         description: Unauthorized
         *       404:
         *         description: Rider not found
         */
        router.delete('/:id', authMiddleware, controller.delete)
    return router
    }
}