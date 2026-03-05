import type { APIRoute } from "astro";
import type { LoginResponse } from "../../interfaces/auth.interface";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await request.json();
  const { email, password } = body;

  const baseUrl = import.meta.env.PUBLIC_SERVER_URL;
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Login failed" }), {
      status: 401,
    });
  }

  const data: LoginResponse = await res.json();
  const token = data.result.token;

  cookies.set("token", token, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  });
};
