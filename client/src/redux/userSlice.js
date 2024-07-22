import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user || action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
