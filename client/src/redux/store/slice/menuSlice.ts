import { createSlice } from "@reduxjs/toolkit";

type MenuState = {
  menuItem: string;
};

const initialState: MenuState = {
  menuItem: "",
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenuItem: (state, action) => {
      state.menuItem = action.payload;
    },
  },
});

export default menuSlice.reducer;
export const { setMenuItem } = menuSlice.actions;

