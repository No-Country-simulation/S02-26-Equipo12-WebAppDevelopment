export interface Measurement {
    [measurementTypeCode: string]: number;
}

export interface SizeMeasurementRange {
    min: number;
    max: number;
}

export interface GroupedSize {
    sizeLabel: string;
    measurements: {
        [measurementTypeCode: string]: SizeMeasurementRange;
    }
}

export interface EngineInput {
    measurements: Measurement;
    requiredMeasurementTypes: string[];
    groupedSizes: GroupedSize[];
}

export interface SizeResult {
    sizeLabel: string;
    score: number;
    confidence: number;
}

export enum EngineStatus {
    OK = 'OK',
    INCOMPLETE_MEASUREMENT_DATA = 'INCOMPLETE_MEASUREMENT_DATA',
    NO_COMPATIBLE_SIZES = 'NO_COMPATIBLE_SIZES'
}

export interface EngineResult {
    status: EngineStatus;
    missingMeasurements?: string[];
    results?: SizeResult[];
}

export function calculateBestSizes(input: EngineInput): EngineResult {
    const {
        measurements,
        requiredMeasurementTypes,
        groupedSizes
    } = input;

    //1 Validar que existan las medidas requeridas
    const missingMeasurements = requiredMeasurementTypes.filter(
        (type) => measurements[type] === undefined
    );

    if (missingMeasurements.length > 0) {
        return {
            status: EngineStatus.INCOMPLETE_MEASUREMENT_DATA,
            missingMeasurements
        };
    }

    const compatibleResults: SizeResult[] = [];

    //2 evaluar cada talla
    console.log("INPUT ENGINE", JSON.stringify(input, null, 2));
    
    for (const size of groupedSizes) {

        //validar que la talla tenga todas las medidas reqqueridas
        const sizeHasAllMeasurements = requiredMeasurementTypes.every(
            (type) => size.measurements[type] !== undefined
        );

        if (!sizeHasAllMeasurements) {
            continue; //descartar talla incompleta
        }

        let totalNormalDistance = 0;
        let isCompatible = true;

        //3 validar rango y calcular score
        for (const type of requiredMeasurementTypes) {
            const measurementValue = measurements[type];
            const range = size.measurements[type];

            if (measurementValue < range.min || measurementValue > range.max) {
                isCompatible = false; //talla no compatible
                break;
            }

            const center = (range.min + range.max) / 2;
            const width = range.max - range.min;

            //evitar division por cero
            const normalDistance =
                width === 0
                    ? 0 :
                    Math.abs(measurementValue - center) / width;

            totalNormalDistance += normalDistance;
        }

        if (!isCompatible) continue;

        const score =
            totalNormalDistance / requiredMeasurementTypes.length;

        const confidence = 1 - score;

        compatibleResults.push({
            sizeLabel: size.sizeLabel,
            score,
            confidence
        });
    }

    //4 si no hay compatibles
    if (compatibleResults.length === 0) {
        return {
            status: EngineStatus.NO_COMPATIBLE_SIZES
        };
    }

    //5 ordenar por mejor score
    compatibleResults.sort((a, b) => a.score - b.score);

    return {
        status: EngineStatus.OK,
        results: compatibleResults
    };
}