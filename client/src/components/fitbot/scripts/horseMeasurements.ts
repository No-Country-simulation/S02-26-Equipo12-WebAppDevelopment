
type MeasurementsPayload = {
    measurementTypeId: string;
    value: number;
    measurementDate?: string;
};

type ExistingMeasurement = {
    id: string;
    measurementTypeId: string;
    value: number;
    measurementDate?: string | null;
    createdAt: string;
    updatedAt: string;
}



const API_BASE = import.meta.env.PUBLIC_SERVER_URL;
const HORSE_ID_DEMO = "3889dcc2-daed-4aa2-bcab-47dff770dee0";

const MEASUREMENT_TYPE_IDS: Record<string, string> = {
    horseBackLength: "5e35ca29-4cf7-4600-bd6e-fe9d92b75820",
    horseGirthCircumference: "ae776d49-dc5a-4ac0-81ad-97e8b68f1429"
}


//Get
async function getHorseMeasurements(horseId: string): Promise<ExistingMeasurement[]> {

    const res = await fetch(`${API_BASE}/horses/${horseId}/measurements`, {
        headers: { "Accept": "application/json" }
    });

    if(!res.ok) throw new Error(await res.text());

    return res.json();
}


//Post
async function postHorseMeasurements(body: MeasurementsPayload): Promise <Response> {
    return fetch(`${API_BASE}/horses/${HORSE_ID_DEMO}/measurements`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
    });
}


export function mountHorseMeasurementsForm (formId = "horse-measurements-form") : void {

    const form = document.getElementById(formId);
9
    if (!(form instanceof HTMLFormElement)) {
        throw new Error("Not found a form")
    }
}
// async function updateHorseMeasurements(horseId: string, measurementId: string, body: Partial<MeasurementsPayload>): Promise<Response> {
    
// }




