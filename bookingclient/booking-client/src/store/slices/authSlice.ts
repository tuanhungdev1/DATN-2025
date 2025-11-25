// src/store/slices/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserProfile } from "@/types/auth.types";
import { authApi } from "@/services/endpoints/auth.api";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  requiresTwoFactor: boolean;
  pendingEmail: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  requiresTwoFactor: false,
  pendingEmail: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.requiresTwoFactor = false;
      state.pendingEmail = null;
    },
    updateUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
    },
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.requiresTwoFactor = false;
    },
    setPendingEmail: (state, action: PayloadAction<string>) => {
      state.pendingEmail = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle login
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        if (payload.data) {
          state.user = payload.data ?? null;
          state.isAuthenticated = true;
          state.requiresTwoFactor = false;
        }
      }
    );

    builder.addMatcher(
      authApi.endpoints.googleLogin.matchFulfilled,
      (state, { payload }) => {
        if (payload.data) {
          state.user = payload.data;
          state.isAuthenticated = true;
          state.requiresTwoFactor = false;
          state.pendingEmail = null;
        }
      }
    );

    // Handle Facebook Login
    builder.addMatcher(
      authApi.endpoints.facebookLogin.matchFulfilled,
      (state, { payload }) => {
        if (payload.data) {
          state.user = payload.data;
          state.isAuthenticated = true;
          state.requiresTwoFactor = false;
          state.pendingEmail = null;
        }
      }
    );

    builder.addMatcher(
      authApi.endpoints.loginAdmin.matchFulfilled,
      (state, { payload }) => {
        if (payload.data) {
          state.user = payload.data ?? null;
          state.isAuthenticated = true;
          state.requiresTwoFactor = false;
        }
      }
    );

    // Handle verify 2FA
    builder.addMatcher(
      authApi.endpoints.verify2FA.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.data ?? null;
        state.isAuthenticated = true;
        state.requiresTwoFactor = false;
        state.pendingEmail = null;
      }
    );

    // Handle logout
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.requiresTwoFactor = false;
      state.pendingEmail = null;
    });

    // Handle get current user
    builder.addMatcher(
      authApi.endpoints.getCurrentUser.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.data ?? null;
        state.isAuthenticated = true;
      }
    );

    // Handle get current user error
    builder.addMatcher(
      authApi.endpoints.getCurrentUser.matchRejected,
      (state) => {
        state.user = null;
        state.isAuthenticated = false;
      }
    );
  },
});

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isAuthenticated"],
  blacklist: ["pendingEmail", "requiresTwoFactor"],
};

export const { logout, setUser, setPendingEmail, updateUser } =
  authSlice.actions;
export default persistReducer(persistConfig, authSlice.reducer);
