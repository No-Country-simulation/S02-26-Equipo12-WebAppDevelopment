import { Request, Response, NextFunction } from "express";
import { RiderMeasurementsService } from "../services/riderMeasurements.services";

export class RiderMeasurementsController {
    private measurements = new RiderMeasurementsService();

    create = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const riderId = req.params.riderId as string;
            const measurement = await this.measurements.create(riderId, req.body);
            res.status(201).json(measurement);
        } catch (error) {
            next(error);
        }
    };

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const riderId = req.params.riderId as string;
            const measurements = await this.measurements.getAll(riderId);
            res.status(200).json(measurements);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const riderId = req.params.riderId as string;
            const measurementId = req.params.measurementId as string;
            await this.measurements.update(riderId, measurementId, req.body);
            res.status(200).json({ message: "Measurement updated successfully" });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const riderId = req.params.riderId as string;
            const measurementId = req.params.measurementId as string;
            await this.measurements.delete(riderId, measurementId);
            res.status(200).json({ message: "Measurement deleted successfully" });
        } catch (error) {
            next(error);
        }
    };
}