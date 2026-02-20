import { create } from "zustand";

import { createAuthSlice, type AuthSlice } from "./slices/auth.slice";

export const useBoundStore = create<AuthSlice>()((...a) => ({
  ...createAuthSlice(...a),
}))