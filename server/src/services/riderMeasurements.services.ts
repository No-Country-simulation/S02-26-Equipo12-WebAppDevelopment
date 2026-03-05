import { Rider, RiderMeasurement, MeasurementType } from "../models";

export class RiderMeasurementsService {

  async create(riderId: string, data: any) {
    const { measurementTypeId, value, measurementDate } = data;

    if (!measurementTypeId || value === undefined) {
      const error: any = new Error("measurementTypeId and value are required");
      error.statusCode = 400;
      throw error;
    }

    if (typeof value !== "number") {
      const error: any = new Error("Value must be a number");
      error.statusCode = 400;
      throw error;
    }

    const rider = await Rider.findByPk(riderId);
    if (!rider) {
      const error: any = new Error("Rider not found");
      error.statusCode = 404;
      throw error;
    }

    const measurementType = await MeasurementType.findByPk(measurementTypeId);
    if (!measurementType) {
      const error: any = new Error("MeasurementType not found");
      error.statusCode = 404;
      throw error;
    }

    if (measurementType.appliesTo !== "rider") {
      const error: any = new Error("Measurement type does not apply to rider");
      error.statusCode = 400;
      throw error;
    }

    return await RiderMeasurement.create({
      riderId,
      measurementTypeId,
      value,
      measurementDate,
    });
  }

  async getAll(riderId: string) {

    const rider = await Rider.findByPk(riderId);
    if (!rider) {
      const error: any = new Error("Rider not found");
      error.statusCode = 404;
      throw error;
    }

    const measurements = await RiderMeasurement.findAll({
      where: { riderId },
      include: [{
        model: MeasurementType,
        attributes: ["code", "unit", "description"],
      }],
      order: [["measurementDate", "DESC"]],
    });

    return measurements.map(m => ({
      measurementType: m.measurementType.code,
      label: m.measurementType.description,
      unit: m.measurementType.unit,
      value: Number(m.value),
      date: m.measurementDate.toISOString().split("T")[0],
    }));
  }

  async update(riderId: string, measurementId: string, data: any) {
    const { value, measurementDate } = data;

    if (value !== undefined && typeof value !== "number") {
      const error: any = new Error("Value must be a number");
      error.statusCode = 400;
      throw error;
    }

    const measurement = await RiderMeasurement.findByPk(measurementId);
    if (!measurement) {
      const error: any = new Error("Measurement not found");
      error.statusCode = 404;
      throw error;
    }

    if (measurement.riderId !== riderId) {
      const error: any = new Error("Measurement does not belong to rider");
      error.statusCode = 403;
      throw error;
    }

    await measurement.update({ value, measurementDate });
    return measurement;
  }

  async delete(riderId: string, measurementId: string) {

    const measurement = await RiderMeasurement.findByPk(measurementId);
    if (!measurement) {
      const error: any = new Error("Measurement not found");
      error.statusCode = 404;
      throw error;
    }

    if (measurement.riderId !== riderId) {
      const error: any = new Error("Measurement does not belong to rider");
      error.statusCode = 403;
      throw error;
    }

    await measurement.destroy();

    return { message: "Measurement deleted successfully" };
  }
}