type MeasurementsPayload = {
  measurementTypeId: string;
  value: number;
  measurementDate?: string;
};

type ExistingMeasurement = {
  id: string;
  measurementTypeId: string;
}

const API_BASE = import.meta.env.PUBLIC_SERVER_URL;

const RIDER_ID_DEMO = "3889dcc2-daed-4aa2-bcab-47dff770dee0";

const MEASUREMENT_TYPE_IDS: Record<string, string> = {
  riderHeight: "966f9434-9733-447c-8351-e80731d301ea",
  riderWeight: "95ff2373-5e63-4168-a1bd-292215a6e601",
  riderFootLength: "2810e105-c150-4165-a254-fe506ec1ba4c",
  riderCalfCircumference: "87d91c4d-a620-4636-b9cd-644532164e76",
  riderHeadCircumference: "aa1c7861-6260-4ac3-83bd-8563037a711a",
};


async function getMeasurements(riderId: string): Promise<ExistingMeasurement[]> {

  const res = await fetch(`${API_BASE}/riders/${riderId}/measurements`, {
    headers: { "Accept": "application/json" }
  });

  if (!res.ok) throw new Error(await res.text());

  return res.json();

  
}


// async function getMeasurements(riderId: string): Promise<ExistingMeasurement[]> {
//   const url = `${API_BASE}/riders/${riderId}/measurements`;

//   console.log("[GET measurements] riderId =", riderId);
//   console.log("[GET measurements] url =", url);

//   const res = await fetch(url, { headers: { Accept: "application/json" } });

//   console.log("[GET measurements] status =", res.status);

//   if (!res.ok) throw new Error(await res.text());
//   return res.json();
// }


async function postMeasurements(body: MeasurementsPayload): Promise<Response> {
  return fetch(`${API_BASE}/riders/${RIDER_ID_DEMO}/measurements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}


async function updateMeasurements(riderId: string, measurementId: string, body: Partial<MeasurementsPayload>): Promise<Response> {

  return fetch(`${API_BASE}/riders/${riderId}/measurements/${measurementId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

}

export function mountRiderMeasurementsForm(formId = "rider-measurements-form"): void {

  const form = document.getElementById(formId);
  if (!(form instanceof HTMLFormElement)) {
    throw new Error(`Form #${formId} not found or not a <form>.`);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!RIDER_ID_DEMO || RIDER_ID_DEMO.includes("Set Rider")) {
      console.error("Set RIDER_ID_DEMO to a real Rider UUID from your DB.");
      return;
    }


    let existingMeasurements: ExistingMeasurement[] = [];

    console.log("[submit] RIDER_ID_DEMO =", RIDER_ID_DEMO);

    try {
      existingMeasurements = await getMeasurements(RIDER_ID_DEMO);

      console.log("existingMeasurements RAW:", existingMeasurements);
console.log("first item:", existingMeasurements?.[0]);

    }
    catch (err) {
      console.error("No se puede listar measures", err);
      return;
    }

    const existingByType = new Map(existingMeasurements.map(m => [m.measurementTypeId, m.id]));

    const formData = new FormData(form);
    const payload: Promise<Response>[] = [];

    for (const [fieldName, measurementTypeId] of Object.entries(MEASUREMENT_TYPE_IDS)) {
      const rawValue = formData.get(fieldName);
      if (rawValue == null || String(rawValue).trim() === "") continue;

      const value = Number(rawValue);
      if (!Number.isFinite(value)) {
        console.error(`${fieldName} debe ser un número válido`);
        return;
      }

      const existingId = existingByType.get(measurementTypeId);

      if (existingId) {
        payload.push(updateMeasurements(RIDER_ID_DEMO, existingId, { value }))
      } else {
        payload.push(postMeasurements({ measurementTypeId, value }));
      }

    }

    if (!payload.length) {
      console.log("No measurements");
      return;
    }

    const responses = await Promise.all(payload);
    const failed = responses.find((r) => !r.ok);

    if (failed) {
      console.error("Backend error:", await failed.text());
      return;
    }


    alert("Measurements saved");
    form.reset();
    window.location.assign("/fitbot");

  });

}