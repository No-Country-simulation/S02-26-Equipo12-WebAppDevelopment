import { Horse, HorseMeasurement, MeasurementType } from "../models";

export class HorseMeasurementsService {

  async create(horseId: string, data: any) {
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

    const horse = await Horse.findByPk(horseId);
    if (!horse) {
      const error: any = new Error("Horse not found");
      error.statusCode = 404;
      throw error;
    }

    const measurementType = await MeasurementType.findByPk(measurementTypeId);
    if (!measurementType) {
      const error: any = new Error("MeasurementType not found");
      error.statusCode = 404;
      throw error;
    }

    if (measurementType.appliesTo !== "horse") {
      const error: any = new Error("Measurement type does not apply to horse");
      error.statusCode = 400;
      throw error;
    }

    return await HorseMeasurement.create({
      horseId,
      measurementTypeId,
      value,
      measurementDate,
    });
  }

  async getAll(horseId: string) {

    const horse = await Horse.findByPk(horseId);
    if (!horse) {
      const error: any = new Error("Horse not found");
      error.statusCode = 404;
      throw error;
    }

    const measurements = await HorseMeasurement.findAll({
      where: { horseId },
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

  async update(horseId: string, measurementId: string, data: any) {
    const { value, measurementDate } = data;

    if (value !== undefined && typeof value !== "number") {
      const error: any = new Error("Value must be a number");
      error.statusCode = 400;
      throw error;
    }

    const measurement = await HorseMeasurement.findByPk(measurementId);
    if (!measurement) {
      const error: any = new Error("Measurement not found");
      error.statusCode = 404;
      throw error;
    }

    if (measurement.horseId !== horseId) {
      const error: any = new Error("Measurement does not belong to horse");
      error.statusCode = 403;
      throw error;
    }

    await measurement.update({ value, measurementDate });
    return measurement;
  }

  async delete(horseId: string, measurementId: string) {

    const measurement = await HorseMeasurement.findByPk(measurementId);
    if (!measurement) {
      const error: any = new Error("Measurement not found");
      error.statusCode = 404;
      throw error;
    }

    if (measurement.horseId !== horseId) {
      const error: any = new Error("Measurement does not belong to horse");
      error.statusCode = 403;
      throw error;
    }

    await measurement.destroy();

    return { message: "Measurement deleted successfully" };
  }
}