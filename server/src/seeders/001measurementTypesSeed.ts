import { MeasurementType } from "../models/measurementTypesModel";

export const seedMeasurementTypes = async () => {
    await MeasurementType.bulkCreate(
        [
            //Rider measurements
            {
                code: 'height_cm',
                unit: 'cm',
                appliesTo: 'rider',
                description: 'Height of the rider'
            },
            {
                code: 'weight_kg',
                unit: 'kg',
                appliesTo: 'rider',
                description: 'Weight of the rider'
            },
            {
                code: 'foot_length_cm',
                unit: 'cm',
                appliesTo: 'rider',
                description: 'Foot length of the rider'
            },
            {
                code: 'calf_circumference_cm',
                unit: 'cm',
                appliesTo: 'rider',
                description: 'Calf circumference of the rider'
            },
            {
                code: 'head_circumference_cm',
                unit: 'cm',
                appliesTo: 'rider',
                description: 'Head circumference of the rider'
            },

            //Horse measurements

            {
                code: 'back_length_cm',
                unit: 'cm',
                appliesTo: 'horse',
                description: 'Back length of the horse'
            },
            {
                code: 'girth_circumference_cm',
                unit: 'cm',
                appliesTo: 'horse',
                description: 'Girth circumference of the horse'
            }, 
        ],
        {
            ignoreDuplicates: true
        }
    );
};