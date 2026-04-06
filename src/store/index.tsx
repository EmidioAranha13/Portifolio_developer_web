import { configureStore } from "@reduxjs/toolkit";
import uiReducer from './uiSlice.tsx';

/**
 * Store global do Redux da aplicação.
 * Registra todos os reducers de domínio utilizados no app.
 */
export const store = configureStore({
  reducer: {
    ui: uiReducer,
  },  
});         

/** Tipo do estado raiz inferido a partir da store. */
export type RootState = ReturnType<typeof store.getState>;

/** Tipo de dispatch inferido da store. */
export type AppDispatch = typeof store.dispatch;