import { createSlice } from "@reduxjs/toolkit";

let saved = null;

try {
  saved = JSON.parse(
    localStorage.getItem("attendanceAuth") || "null"
  );
} catch {
  localStorage.removeItem("attendanceAuth");
}

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: saved?.user || null,
    token: saved?.token || null,
  },

  reducers: {
    setCredentials(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;

      localStorage.setItem(
        "attendanceAuth",
        JSON.stringify(action.payload)
      );
    },

    logout(state) {
      state.user = null;
      state.token = null;

      localStorage.removeItem("attendanceAuth");
    },
  },
});

export const {
  setCredentials,
  logout,
} = authSlice.actions;

export default authSlice.reducer;