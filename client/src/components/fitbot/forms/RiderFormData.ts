


export type Gender = | "male" | "female";
export type FitPreference = | "loose" | "regular" | "fit"
    


export interface RiderMeasurements {
    height: number;
    weight: number;
    headCircumference: number;
    footLength: number;
    footWidth: number;
    calfCircumference: number;
    calfHeigh: number;
    inseam: number;
    waistCircumference: number;
    hipCircumference: number;
    thighCircumference: number;
    handCircumference: number;
    palmLenght: number;
    genderFit: Gender;
    fitPreference: FitPreference;

}
