import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { demoUsers } from '../../data/mockBookstore';
import type { RootState } from '../index';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<string>) {
      state.isAuthenticated = true;
      state.userId = action.payload;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isAuthenticated = false;
      state.userId = null;
      state.error = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.userId = null;
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
});

export const { loginSuccess, loginFailure, logout, clearAuthError } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthError = (state: RootState) => state.auth.error;

export function attemptLogin(username: string, password: string) {
  const user = demoUsers.find(
    (u) =>
      (u.name.toLowerCase() === username.trim().toLowerCase() ||
        u.email.toLowerCase() === username.trim().toLowerCase()) &&
      u.password === password,
  );
  return user ?? null;
}
