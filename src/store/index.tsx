import { configureStore } from "@reduxjs/toolkit";
import uiReducer from './uiSlice.tsx';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
  },  
});         

// Tipos para usar no projeto
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;