import { Router } from "express";
import { HorseMeasurementsController } from "../controllers/horseMeasurements.controller";

export class HorseMeasurementsRoutes {
  static get routes() {
    const router = Router();
    const controller = new HorseMeasurementsController();

    /**
     * @swagger
     * tags:
     *   name: HorseMeasurements
     *   description: Horse measurement management
     */

    /**
     * @swagger
     * /horses/{horseId}/measurements:
     *   post:
     *     summary: Create a new measurement for a horse
     *     tags: [HorseMeasurements]
     *     parameters:
     *       - in: path
     *         name: horseId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the horse
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               measurementTypeId:
     *                 type: string
     *               value:
     *                 type: number
     *             required:
     *               - measurementTypeId
     *               - value
     *     responses:
     *       201:
     *         description: Measurement created successfully
     *       400:
     *         description: Invalid input
     */
    router.post("/:horseId/measurements", controller.create);

    /**
     * @swagger
     * /horses/{horseId}/measurements:
     *   get:
     *     summary: Get all measurements of a horse
     *     tags: [HorseMeasurements]
     *     parameters:
     *       - in: path
     *         name: horseId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the horse
     *     responses:
     *       200:
     *         description: List of measurements
     *       404:
     *         description: Horse not found
     */
    router.get("/:horseId/measurements", controller.getAll);

    /**
     * @swagger
     * /horses/{horseId}/measurements/{measurementId}:
     *   put:
     *     summary: Update a horse measurement
     *     tags: [HorseMeasurements]
     *     parameters:
     *       - in: path
     *         name: horseId
     *         required: true
     *         schema:
     *           type: string
     *       - in: path
     *         name: measurementId
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
     *               value:
     *                 type: number
     *             required:
     *               - value
     *     responses:
     *       200:
     *         description: Measurement updated successfully
     *       403:
     *         description: Measurement does not belong to horse
     *       404:
     *         description: Measurement not found
     */
    router.put("/:horseId/measurements/:measurementId", controller.update);

    /**
     * @swagger
     * /horses/{horseId}/measurements/{measurementId}:
     *   delete:
     *     summary: Delete a horse measurement
     *     tags: [HorseMeasurements]
     *     parameters:
     *       - in: path
     *         name: horseId
     *         required: true
     *         schema:
     *           type: string
     *       - in: path
     *         name: measurementId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Measurement deleted successfully
     *       403:
     *         description: Measurement does not belong to horse
     *       404:
     *         description: Measurement not found
     */
    router.delete("/:horseId/measurements/:measurementId", controller.delete);

    return router;
  }
}

