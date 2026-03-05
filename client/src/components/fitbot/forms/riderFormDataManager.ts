import { z } from "astro:schema";

const stringToNumber = (opts?: {min?: number; max?: number}) => 
    z.preprocess( (value) => {
    if ( value === "" || value == null || value === undefined) return undefined;
    if(typeof value === "number") return value;

    if(typeof value === "string") {
        const n = Number(value);
        return Number.isFinite(n) ? n : value;
    }
    return value;

}, z.number()
.refine((n) => Number.isFinite(n), "Invalid number")
.pipe(
    z.number()
    .min(opts?.min ?? Number.NEGATIVE_INFINITY)
    .max(opts?.max ?? Number.POSITIVE_INFINITY)
));

export const GenderSchema = z.enum(["male", "female"]) ;
export const FitPreferenceSchema = z.enum(["loose", "regular", "fit"]);

export const RiderMeasurementsSchema = z.object({

    riderHeight: stringToNumber({min: 50, max:250}),
    riderWeight: stringToNumber({min: 1, max:300}),
    riderHeadCircumference: stringToNumber({min: 50, max:250}),
    riderFootLength: stringToNumber({min: 50, max:250}),
    riderFootWidth: stringToNumber({min: 50, max:250}),
    riderCalfCircumference: stringToNumber({min: 50, max:250}),
    riderCalfWidth: stringToNumber({min: 50, max:250}),
    riderChest: stringToNumber({min: 50, max:250}),
    riderCalfHeight: stringToNumber({min: 50, max:250}),
    riderInseam: stringToNumber({min: 50, max:250}),
    riderWaistCircumference: stringToNumber({min: 50, max:250}),
    riderHipCircumference: stringToNumber({min: 50, max:250}),
    riderThighCircumference: stringToNumber({min: 50, max:250}),
    riderHandCircumference: stringToNumber({min: 50, max:250}),
    riderPalmLength: stringToNumber({min: 50, max:250}),
    riderGenderFit: GenderSchema,
    riderFitPreference: FitPreferenceSchema,

})

export type RiderMeasurements = z.infer <typeof RiderMeasurementsSchema>;
export type Gender = z.infer <typeof GenderSchema>;
export type FitPreferences = z.infer <typeof FitPreferenceSchema>;



