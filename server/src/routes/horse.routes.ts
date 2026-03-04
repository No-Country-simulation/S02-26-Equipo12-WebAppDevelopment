import { Router } from "express"
import { HorseController } from "../controllers/horse.controller"

export class HorseRoutes {
  static get routes() {
    const router = Router()
    const controller = new HorseController()

    /**
     * @swagger
     * tags:
     *   name: Horses
     *   description: Horse management
     */

    /**
     * @swagger
     * /riders/{riderId}/horses:
     *   post:
     *     tags: [Horses]
     *     summary: Create a horse for a rider
     *     parameters:
     *       - in: path
     *         name: riderId
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *             properties:
     *               name:
     *                 type: string
     *     responses:
     *       201:
     *         description: Horse created successfully
     *       400:
     *         description: Validation error
     *       404:
     *         description: Rider not found
     */
    router.post('/:riderId/horses', controller.create)

    /**
     * @swagger
     * /riders/{riderId}/horses:
     *   get:
     *     tags: [Horses]
     *     summary: Get all horses for a rider
     *     parameters:
     *       - in: path
     *         name: riderId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: List of horses
     *       404:
     *         description: Rider not found
     */
    router.get('/:riderId/horses', controller.getAllByRider)

    /**
     * @swagger
     * /horses/{horseId}:
     *   get:
     *     tags: [Horses]
     *     summary: Get a horse by ID
     *     parameters:
     *       - in: path
     *         name: horseId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Horse found
     *       404:
     *         description: Horse not found
     */
    router.get('/horses/:horseId', controller.getById)

    /**
     * @swagger
     * /horses/{horseId}:
     *   put:
     *     tags: [Horses]
     *     summary: Update a horse
     *     parameters:
     *       - in: path
     *         name: horseId
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
     *     responses:
     *       200:
     *         description: Horse updated successfully
     *       400:
     *         description: Validation error
     *       404:
     *         description: Horse not found
     */
    router.put('/horses/:horseId', controller.update)

    /**
     * @swagger
     * /horses/{horseId}:
     *   delete:
     *     tags: [Horses]
     *     summary: Delete a horse
     *     parameters:
     *       - in: path
     *         name: horseId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Horse deleted successfully
     *       404:
     *         description: Horse not found
     */
    router.delete('/horses/:horseId', controller.delete)

    return router
  }
}