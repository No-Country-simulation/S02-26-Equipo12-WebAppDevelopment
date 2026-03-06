import type { APIRoute } from "astro";
import { RiderMeasurementsSchema, type RiderMeasurements } from "../../components/fitbot/forms/riderFormDataManager";

export const prerender = false;


export const GET: APIRoute = async ()=> {
    return new Response(
        JSON.stringify({ok: true, message:"POST to api/rider"}), {status: 200, headers: {"content-type": "application/json"}}
    );
};
 

export const POST: APIRoute = async ( {request} ) => {
    const ct = request.headers.get("content-type") ?? "NO-content-type";
    console.log("content-type: ", ct);

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsed = RiderMeasurementsSchema.safeParse(data);

    if(!parsed.success) {

        const fieldErrors: Record <string, string> = {};

        for (const issue of parsed.error.issues) {
            const key = String(issue.path[0] ?? "");
            if (key) fieldErrors[key] = issue.message;
        }

    return new Response(JSON.stringify({ ok: false, fieldErrors}), {status: 400})

    }


    console.log("Rider: ", parsed.data);

    return Response.redirect("/", 303)

    // return new Response (JSON.stringify({ok: true}), {status: 200})
}