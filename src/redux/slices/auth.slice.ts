import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type AuthState = {
  refreshToken: string | undefined;
  authToken: string | undefined;
  verifyToken: string | undefined;
  username: string | undefined;
};
const slice = createSlice({
  name: "auth",
  initialState: {
    authToken: undefined,
    username: undefined,
  } as AuthState,
  reducers: {
    setCredentials: (
      state,
      { payload: { token } }: PayloadAction<{ token: string }>
    ) => {
      state.authToken = token;
      localStorage.setItem("ems_tkn_", token);
    },
    tokenUpdated: (state) => {
      return state;
    },
    setForgetData: (
      state,
      { payload: { username } }: PayloadAction<{ username: string }>
    ) => {
      state.username = username;
    },
    setVerificationToken: (
      state,
      { payload: { verifyToken } }: PayloadAction<{ verifyToken: string }>
    ) => {
      state.verifyToken = verifyToken;
    },
    removeCredentials: (state) => {
      state.authToken = undefined;
      localStorage.removeItem("ems_tkn_");
    },
  },
});
export const {
  setCredentials,
  tokenUpdated,
  setForgetData,
  setVerificationToken,
  removeCredentials,
} = slice.actions;
export default slice.reducer;
