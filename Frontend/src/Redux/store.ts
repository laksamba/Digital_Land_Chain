import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice.ts';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});