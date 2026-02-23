import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { createAuthSlice, type AuthSlice } from "./slices/auth.slice";

export const useBoundStore = create<AuthSlice>()(
  devtools((...args) => ({
    ...createAuthSlice(...args)
  }))
)