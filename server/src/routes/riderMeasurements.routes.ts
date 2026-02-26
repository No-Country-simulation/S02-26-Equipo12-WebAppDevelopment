import { Router } from "express";
import { RiderMeasurementsController } from "../controllers/riderMeasurements.controller";


export class RiderMeasurementsRoutes {
  static get routes() {
    const router = Router();
    const controller = new RiderMeasurementsController();
       

        /**
   * @swagger
   * /riders/{riderId}/measurements:
   *   post:
   *     tags: [Rider Measurements]
   *     summary: Create a new rider measurement
   *     parameters:
   *       - in: path
   *         name: riderId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Rider unique identifier
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - measurementTypeId
   *               - value
   *             properties:
   *               measurementTypeId:
   *                 type: string
   *                 format: uuid
   *                 description: Measurement type ID (must apply to rider)
   *               value:
   *                 type: number
   *                 example: 27.5
   *               measurementDate:
   *                 type: string
   *                 format: date
   *                 example: 2026-02-07
   *     responses:
   *       201:
   *         description: Measurement created successfully
   *       400:
   *         description: Invalid input or measurement type does not apply to rider or value is not a number
   *       404:
   *         description: Rider or measurement type not found
   *       500:
   *         description: Internal server error
   */
        router.post("/:riderId/measurements", controller.create);


        /**
 * @swagger
 * /riders/{riderId}/measurements:
 *   get:
 *     tags: [Rider Measurements]
 *     summary: Get all measurements for a rider
 *     parameters:
 *       - in: path
 *         name: riderId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Rider unique identifier
 *     responses:
 *       200:
 *         description: List of rider measurements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   measurementType:
 *                     type: string
 *                     example: foot_length_cm
 *                   label:
 *                     type: string
 *                     example: Largo del pie
 *                   unit:
 *                     type: string
 *                     example: cm
 *                   value:
 *                     type: number
 *                     example: 27.5
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: 2026-02-07
 *       404:
 *         description: Rider not found
 *       500:
 *         description: Internal server error
 */
        router.get("/:riderId/measurements", controller.getAll);
/**
 * @swagger
 * /riders/{riderId}/measurements/{measurementId}:
 *   put:
 *     tags: [Rider Measurements]
 *     summary: Update a rider measurement
 *     parameters:
 *       - in: path
 *         name: riderId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Rider unique identifier
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Measurement unique identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 *                 example: 28.0
 *               measurementDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-03-01
 *     responses:
 *       200:
 *         description: Measurement updated successfully
 *       400:
 *         description: Invalid input (value must be a number)
 *       403:
 *         description: Measurement does not belong to the rider
 *       404:
 *         description: Rider or measurement not found
 *       500:
 *         description: Internal server error
 */
        router.put("/:riderId/measurements/:measurementId", controller.update);

        /**
 * @swagger
 * /riders/{riderId}/measurements/{measurementId}:
 *   delete:
 *     tags: [Rider Measurements]
 *     summary: Delete a rider measurement
 *     parameters:
 *       - in: path
 *         name: riderId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Rider unique identifier
 *       - in: path
 *         name: measurementId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Rider measurement unique identifier
 *     responses:
 *       200:
 *         description: Measurement deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Measurement deleted successfully
 *       403:
 *         description: Measurement does not belong to the rider
 *       404:
 *         description: Rider or measurement not found
 *       500:
 *         description: Internal server error
 */
        router.delete("/:riderId/measurements/:measurementId", controller.delete);
        return router;
    }
}



