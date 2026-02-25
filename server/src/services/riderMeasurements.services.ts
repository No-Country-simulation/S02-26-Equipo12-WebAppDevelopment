import { Rider, RiderMeasurement, MeasurementType } from "../models";

export class RiderMeasurementsService {

    async create(riderId: string, data: any) {
        const { measurementTypeId, value, measurementDate } = data;

        if (!measurementTypeId || value === undefined)
            throw new Error("measurementTypeId and value are required");

        if (typeof value !== "number")
            throw new Error("Value must be a number");

        const rider = await Rider.findByPk(riderId);
        if (!rider) throw new Error("Rider not found");

        const measurementType = await MeasurementType.findByPk(measurementTypeId);
        if (!measurementType) throw new Error("MeasurementType not found");

        if (measurementType.appliesTo !== "rider")
            throw new Error("Measurement type does not apply to rider");

        return await RiderMeasurement.create({
            riderId,
            measurementTypeId,
            value,
            measurementDate,
        });
    }

    async getAll(riderId: string) {
        const rider = await Rider.findByPk(riderId);
        if (!rider) throw new Error("Rider not found");

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

        if (value !== undefined && typeof value !== "number")
            throw new Error("Value must be a number");

        const measurement = await RiderMeasurement.findByPk(measurementId);
        if (!measurement) throw new Error("Measurement not found");

        if (measurement.riderId !== riderId)
            throw new Error("Measurement does not belong to rider");

        await measurement.update({ value, measurementDate });
        return measurement;
    }

    async delete(riderId: string, measurementId: string) {
        const measurement = await RiderMeasurement.findByPk(measurementId);
        if (!measurement) throw new Error("Measurement not found");

        if (measurement.riderId !== riderId)
            throw new Error("Measurement does not belong to rider");

        await measurement.destroy();
        return { message: "Measurement deleted successfully" };
    }
}