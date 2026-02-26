import { seedMeasurementTypes } from "./seeders/001measurementTypesSeed";

export const runSeeds = async () => {

    console.log('Running seeds...');
    await seedMeasurementTypes();
    console.log('Seeds completed.');
}