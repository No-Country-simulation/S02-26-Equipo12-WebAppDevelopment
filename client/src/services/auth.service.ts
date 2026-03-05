import type { LoginResponse } from "../interfaces/auth.interface";

import { attemp } from "../utils/attemp";

const BASE_URL = import.meta.env.PUBLIC_SERVER_URL;

export const login = async (input: { email: string; password: string }) => {
  const { data, error } = await attemp<LoginResponse>(async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      throw new Error("Error fetching products");
    }

    return res.json();
  });

  return { data, error };
};
