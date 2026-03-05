import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { persist, createJSONStorage } from "zustand/middleware";

import { createAuthSlice, type AuthSlice } from "./slices/auth.slice";
import { createCartSlice, type CartSlice } from "./slices/cart.slice";

export const useBoundStore = create<AuthSlice & CartSlice>()(
  devtools(
    persist(
      (...args) => ({
        ...createAuthSlice(...args),
        ...createCartSlice(...args),
      }),
      {
        name: "equifit-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          items: state.items,
        }),
      }
    )
  )
);