
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
const HORSE_ID_DEMO = "68b142e7-6aa2-4879-9df0-e7e9439d1a2c";

const MEASUREMENT_TYPE_IDS: Record<string, string> = {
    horseBackLength: "5e35ca29-4cf7-4600-bd6e-fe9d92b75820",
    horseGirthCircumference: "ae776d49-dc5a-4ac0-81ad-97e8b68f1429"
}


//Get
async function getHorseMeasurements(horseId: string): Promise<ExistingMeasurement[]> {

    const res = await fetch(`${API_BASE}/horses/${horseId}/measurements`, {
        headers: { "Accept": "application/json" }
    });

    if (!res.ok) throw new Error(await res.text());

    return res.json();
}


//Post
async function postHorseMeasurements(body: MeasurementsPayload): Promise<Response> {
    return fetch(`${API_BASE}/horses/${HORSE_ID_DEMO}/measurements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
}


// Put
async function updateHorseMeasurements(horseId: string, measurementId: string, body: Partial<MeasurementsPayload>): Promise<Response> {

    return fetch(`${API_BASE}/horses/${horseId}/measurements/${measurementId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })
}


export function mountHorseMeasurementsForm(formId = "horse-measurements-form"): void {
    console.log("hola");
    console.log("equifit-storage:", localStorage.getItem("equifit-storage"));

    const form = document.getElementById(formId);

    if (!(form instanceof HTMLFormElement)) {
        throw new Error("Not found a form")
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();


        if(!HORSE_ID_DEMO || HORSE_ID_DEMO.includes("Set Horse")) {
            console.error("Set HORSE DEMO")
            return
        }

        console.log("[submit] HORSE_DEMO =", HORSE_ID_DEMO)


        let horseMeasurementsDb: ExistingMeasurement[] = [];

        try {

            horseMeasurementsDb = await getHorseMeasurements(HORSE_ID_DEMO);

            console.log("Horse Measurements RAW", horseMeasurementsDb);
            console.log("First Item: ", horseMeasurementsDb?.[0]);

        } catch (error) {
            console.error("No se puede listar las medidas de horse", error);

            return;
        }

        const existingType = new Map(horseMeasurementsDb.map(m => [m.measurementTypeId, m.id]));

        const formData = new FormData(form);
        const payload: Promise<Response>[] = []

        for (const [fieldName, measurementTypeId] of Object.entries(MEASUREMENT_TYPE_IDS)) {
            const rawValue = formData.get(fieldName);

            if (rawValue == null || String(rawValue).trim() === "") continue;

            const value = Number(rawValue);
            if (!Number.isFinite(value)) {
                console.error(`${fieldName} debe ser un numero valido`);
                return;
            }

            const existingMeasurementId = existingType.get(measurementTypeId);

            if (existingMeasurementId) {
                payload.push(updateHorseMeasurements(HORSE_ID_DEMO, existingMeasurementId, { value }))
            } else {
                payload.push(postHorseMeasurements({ measurementTypeId, value }));
            }
        }

        if (!payload.length) {
            console.log("No measurements")
            return
        }


        alert("Horse Measurements saved");
        form.reset();
        window.location.assign("/fitbot");

    })
}




