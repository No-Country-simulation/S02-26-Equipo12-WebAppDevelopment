import { Request, Response, NextFunction } from "express";
import { HorseMeasurementsService } from "../services/horseMeasurements.services";

export class HorseMeasurementsController {
  private measurements = new HorseMeasurementsService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const horseId = req.params.horseId as string;
      const measurement = await this.measurements.create(horseId, req.body);
      res.status(201).json(measurement);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const horseId = req.params.horseId as string;
      const measurements = await this.measurements.getAll(horseId);
      res.status(200).json(measurements);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const horseId = req.params.horseId as string;
      const measurementId = req.params.measurementId as string;
      await this.measurements.update(horseId, measurementId, req.body);
      res.status(200).json({ message: "Measurement updated successfully" });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const horseId = req.params.horseId as string;
      const measurementId = req.params.measurementId as string;
      await this.measurements.delete(horseId, measurementId);
      res.status(200).json({ message: "Measurement deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}