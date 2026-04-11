import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import LiquidGlassBalls from "./componentes/LiquidGlassBalls/LiquidGlassBalls";
import LoadingScreen from "./componentes/LoadingScreen/LoadingScreen";
import StyledHeader from "./componentes/StyledHeader/StyledHeader";
import StyledFooter from "./componentes/StyledFooter/StyledFooter";
import type { LanguageCode } from "./componentes/LanguageSelector/LanguageSelector";
import { infoTextsCollection } from "./utils/infoTextsCollection";
import ProfilePage from "./pages/profile/ProfilePage";
import EducationPage from "./pages/education/EducationPage";
import type { RootState } from "./store/index";
import type { SectionKey } from "./store/uiSlice";
import "./App.css";

type GlassPreset = "soft" | "crystal" | "liquid-strong";
type ThemeMode = "day" | "night";
const DEFAULT_LANGUAGE: LanguageCode = "BR";

/** Chave no `localStorage` para lembrar o tema escolhido pelo usuário. */
const THEME_STORAGE_KEY = "portfolio-theme";

/**
 * Lê o tema salvo de forma segura (SSR / modo privado / valor inválido).
 *
 * @returns Modo de tema persistido ou o padrão noturno.
 */
function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "night";
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw === "day" || raw === "night") return raw;
  } catch {
    /* storage indisponível */
  }
  return "night";
}

/**
 * Componente raiz da aplicação.
 * Renderiza o fundo de bolas de vidro e escuta teclas para trocar preset visual.
 *
 * @returns JSX da tela inicial do portfólio.
 */
function App() {
  const [preset, setPreset] = useState<GlassPreset>("liquid-strong");
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => readStoredTheme());
  const [language, setLanguage] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [assetsReady, setAssetsReady] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);
  const languageKey = language.toLowerCase() as keyof typeof infoTextsCollection;
  const infoTexts = infoTextsCollection[languageKey];
  const activeSection = useSelector((state: RootState) => state.ui.activeSection);
  const tabTitleBySection: Record<SectionKey, string> = {
    about: infoTexts.about,
    education: infoTexts.education,
    experience: infoTexts.experience,
    skills: infoTexts.skills,
    certifications: infoTexts.certifications,
    projects: infoTexts.projects,
    contact: infoTexts.contact,
  };

  useEffect(() => {
    /**
     * Alterna o preset de vidro pelos atalhos de teclado:
     * 1 = soft, 2 = crystal, 3 = liquid-strong.
     * Ignora teclas quando o foco está em campos de digitação.
     *
     * @param event Evento de teclado disparado pela janela.
     * @returns void
     */
    const handlePresetKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingField =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable;

      if (isTypingField) return;

      if (event.key === "1") setPreset("soft");
      if (event.key === "2") setPreset("crystal");
      if (event.key === "3") setPreset("liquid-strong");
    };

    window.addEventListener("keydown", handlePresetKey);
    return () => window.removeEventListener("keydown", handlePresetKey);
  }, []);

  useEffect(() => {
    /**
     * Aguarda o carregamento total da página para liberar a UI principal.
     *
     * @returns void
     */
    const handleLoaded = () => setAssetsReady(true);

    if (document.readyState === "complete") {
      handleLoaded();
      return;
    }

    window.addEventListener("load", handleLoaded, { once: true });
    return () => window.removeEventListener("load", handleLoaded);
  }, []);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    /**
     * Persiste o tema atual sempre que o usuário (ou código) alterar `themeMode`.
     *
     * @returns void
     */
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    } catch {
      /* quota / privado */
    }
  }, [themeMode]);

  const handleLoaderFinish = useCallback(() => {
    document.documentElement.classList.remove("is-loading-screen");
    document.body.classList.remove("is-loading-screen");
    window.scrollTo(0, 0);
    setLoaderDone(true);
  }, []);

  useLayoutEffect(() => {
    if (loaderDone) return undefined;
    const html = document.documentElement;
    const body = document.body;
    html.classList.add("is-loading-screen");
    body.classList.add("is-loading-screen");
    return () => {
      html.classList.remove("is-loading-screen");
      body.classList.remove("is-loading-screen");
    };
  }, [loaderDone]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeSection]);

  return (
    <div className={`App app-shell theme-${themeMode}`}>
      {!loaderDone && (
        <LoadingScreen
          themeMode={themeMode}
          isContentReady={assetsReady}
          onFinish={handleLoaderFinish}
        />
      )}

      <StyledHeader
        themeMode={themeMode}
        onThemeChange={setThemeMode}
        language={language}
        onLanguageChange={setLanguage}
        tabLabels={tabTitleBySection}
      />
      <main className="app-main">
        <LiquidGlassBalls preset={preset}>
          <div className="content">
            <div key={activeSection} className="page-fade">
              {activeSection === "about" ? (
                <ProfilePage infoTexts={infoTexts} languageKey={languageKey} />
              ) : activeSection === "education" ? (
                <EducationPage />
              ) : (
                <section className="page-placeholder">
                  <h2>{tabTitleBySection[activeSection]}</h2>
                </section>
              )}
            </div>
          </div>
          {/* <div className="preset-hint">
          <span>{`Preset: ${preset}`}</span>
          <span>1 soft | 2 crystal | 3 liquid-strong</span>
        </div> */}
        </LiquidGlassBalls>
      </main>
      <StyledFooter text={infoTexts.footerRights} />
    </div>
  );
}

export default App;
