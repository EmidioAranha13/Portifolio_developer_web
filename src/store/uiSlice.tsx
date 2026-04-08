import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type SectionKey =
  | "about"
  | "education"
  | "experience"
  | "skills"
  | "certifications"
  | "projects"
  | "contact";

const initialState = {
  isSidebarOpen: false,
  activeSection: "about" as SectionKey,
};

/**
 * Slice de estado para controles de UI globais.
 * Centraliza ações relacionadas ao estado de abertura da sidebar.
 */
export const uiSlice = createSlice({
  name: "ui",
  initialState,     
  reducers: {
    /**
     * Inverte o estado atual da sidebar.
     *
     * @param state Estado atual do slice de UI.
     * @returns void
     */
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },

    /**
     * Define explicitamente se a sidebar está aberta ou fechada.
     *
     * @param state Estado atual do slice de UI.
     * @param action Action com o novo estado booleano da sidebar.
     * @returns void
     */
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.isSidebarOpen = action.payload;
    },

    /**
     * Define a seção ativa atual do site.
     *
     * @param state Estado atual do slice de UI.
     * @param action Action com a chave da seção ativa.
     * @returns void
     */
    setActiveSection(state, action: PayloadAction<SectionKey>) {
      state.activeSection = action.payload;
    },
  },
});

/** Actions exportadas para manipular o estado de UI. */
export const { toggleSidebar, setSidebarOpen, setActiveSection } = uiSlice.actions;

/** Reducer principal do slice de UI. */
export default uiSlice.reducer;