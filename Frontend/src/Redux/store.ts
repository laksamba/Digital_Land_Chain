import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice.ts';
import landReducer from './landSlice.ts';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    land: landReducer, 
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;