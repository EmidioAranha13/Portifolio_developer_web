import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import FloatingBalls from "./componentes/LiquidGlassBalls/FloatingBalls";
import LiquidGlassBalls from "./componentes/LiquidGlassBalls/LiquidGlassBalls";
import BackgroundBallsToggle from "./componentes/BackgroundBallsToggle/BackgroundBallsToggle";
import LoadingScreen from "./componentes/LoadingScreen/LoadingScreen";
import StyledHeader from "./componentes/StyledHeader/StyledHeader";
import StyledFooter from "./componentes/StyledFooter/StyledFooter";
import CardBox from "./componentes/CardBox/CardBox";
import type {
  BackgroundBallsMode,
  GlassPreset,
  LanguageCode,
  SectionKey,
  ThemeMode,
} from "./utils/Types";
import { infoTextsCollection } from "./utils/infoTextsCollection";
import ArrowBoxScrollRail from "./componentes/ArrowBox/ArrowBoxScrollRail";
import LoadingOrbitSpinner from "./componentes/LoadingOrbitSpinner/LoadingOrbitSpinner";
import type { RootState } from "./store/index";
import "./App.css";
import "./styles/glassSurface.css";

/**
 * Lazy load: cada `import()` vira um arquivo JS separado (chunk).
 * O navegador só baixa o chunk quando a seção é exibida pela primeira vez.
 */
const ProfilePage = lazy(() => import("./pages/Profile/ProfilePage"));
const EducationPage = lazy(() => import("./pages/Education/EducationPage"));
const ExperiencePage = lazy(() => import("./pages/Experience/ExperiencePage"));
const SkillPage = lazy(() => import("./pages/SkillPage/SkillPage"));
const CertificationsPage = lazy(() => import("./pages/Certifications/CertificationsPage"));
const ContactMePage = lazy(() => import("./pages/ContactMe/ContactMePage"));
const ProjectsPage = lazy(() => import("./pages/Projects/ProjectsPage"));

/** Exibido enquanto o chunk da página ainda está sendo baixado. */
function PageSectionFallback() {
  return (
    <div className="page-section-fallback" role="status" aria-live="polite" aria-busy="true">
      <CardBox className="page-section-fallback__card">
        <div className="page-section-fallback__content">
          <div className="page-section-fallback__spinner-wrap">
            <LoadingOrbitSpinner label="Carregando" />
          </div>
          <p className="page-section-fallback__label" aria-hidden="true">
            Carregando
          </p>
        </div>
      </CardBox>
    </div>
  );
}

const DEFAULT_LANGUAGE: LanguageCode = "BR";

/** Chave no `localStorage` para lembrar o tema escolhido pelo usuário. */
const THEME_STORAGE_KEY = "portfolio-theme";
const BACKGROUND_BALLS_STORAGE_KEY = "portfolio-background-balls";

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

function readStoredBackgroundBalls(): BackgroundBallsMode {
  if (typeof window === "undefined") return "liquid-glass";
  try {
    const raw = localStorage.getItem(BACKGROUND_BALLS_STORAGE_KEY);
    if (raw === "liquid-glass" || raw === "floating-orbit") return raw;
  } catch {
    /* storage indisponível */
  }
  return "liquid-glass";
}

/**
 * Componente raiz da aplicação.
 * Renderiza o fundo de bolas de vidro e escuta teclas para trocar preset visual.
 *
 * @returns JSX da tela inicial do portfólio.
 */
function App() {
  const [preset, setPreset] = useState<GlassPreset>("liquid-strong");
  const [backgroundBallsMode, setBackgroundBallsMode] = useState<BackgroundBallsMode>(() =>
    readStoredBackgroundBalls(),
  );
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => readStoredTheme());
  const [language, setLanguage] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [assetsReady, setAssetsReady] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-day", "theme-night");
    root.classList.add(themeMode === "day" ? "theme-day" : "theme-night");
  }, [themeMode]);

  useEffect(() => {
    try {
      localStorage.setItem(BACKGROUND_BALLS_STORAGE_KEY, backgroundBallsMode);
    } catch {
      /* quota / privado */
    }
  }, [backgroundBallsMode]);

  const handleLoaderFinish = useCallback(() => {
    containerRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setLoaderDone(true);
  }, []);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
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

      <main className="app-main">
        <div className="app-shell-layout">
          <div className="app-shell-layout__background" aria-hidden="true">
            {backgroundBallsMode === "liquid-glass" ? (
              <LiquidGlassBalls preset={preset} />
            ) : (
              <FloatingBalls />
            )}
          </div>
          <AppShellContent
            containerRef={containerRef}
            themeMode={themeMode}
            setThemeMode={setThemeMode}
            language={language}
            setLanguage={setLanguage}
            tabTitleBySection={tabTitleBySection}
            activeSection={activeSection}
            infoTexts={infoTexts}
            languageKey={languageKey}
            backgroundBallsMode={backgroundBallsMode}
            onBackgroundBallsModeChange={setBackgroundBallsMode}
          />
        </div>
        <ArrowBoxScrollRail scrollRootRef={containerRef} contentSyncKey={activeSection} />
      </main>
    </div>
  );
}

type AppShellContentProps = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  tabTitleBySection: Record<SectionKey, string>;
  activeSection: SectionKey;
  infoTexts: (typeof infoTextsCollection)[keyof typeof infoTextsCollection];
  languageKey: keyof typeof infoTextsCollection;
  backgroundBallsMode: BackgroundBallsMode;
  onBackgroundBallsModeChange: (mode: BackgroundBallsMode) => void;
};

function AppShellContent({
  containerRef,
  themeMode,
  setThemeMode,
  language,
  setLanguage,
  tabTitleBySection,
  activeSection,
  infoTexts,
  languageKey,
  backgroundBallsMode,
  onBackgroundBallsModeChange,
}: AppShellContentProps) {
  return (
    <div ref={containerRef} className="container styled-scrollbars">
      <StyledHeader
        themeMode={themeMode}
        onThemeChange={setThemeMode}
        language={language}
        onLanguageChange={setLanguage}
        tabLabels={tabTitleBySection}
      />
      <div className="content">
        <div className="page-fade">
          <Suspense fallback={<PageSectionFallback />}>
            {activeSection === "about" ? (
              <ProfilePage infoTexts={infoTexts} languageKey={languageKey} />
            ) : activeSection === "education" ? (
              <EducationPage title={tabTitleBySection.education} infoTexts={infoTexts} />
            ) : activeSection === "experience" ? (
              <ExperiencePage title={tabTitleBySection.experience} infoTexts={infoTexts} />
            ) : activeSection === "skills" ? (
              <SkillPage title={tabTitleBySection.skills} infoTexts={infoTexts} />
            ) : activeSection === "certifications" ? (
              <CertificationsPage title={tabTitleBySection.certifications} infoTexts={infoTexts} />
            ) : activeSection === "contact" ? (
              <ContactMePage title={tabTitleBySection.contact} infoTexts={infoTexts} />
            ) : activeSection === "projects" ? (
              <ProjectsPage
                title={tabTitleBySection.projects}
                themeMode={themeMode}
                infoTexts={infoTexts}
              />
            ) : (
              <CardBox className="page-placeholder-card">
                <section className="page-placeholder">
                  <h2>{tabTitleBySection[activeSection]}</h2>
                </section>
              </CardBox>
            )}
          </Suspense>
        </div>
      </div>
      <StyledFooter
        text={infoTexts.footerRights}
        controls={
          <BackgroundBallsToggle
            mode={backgroundBallsMode}
            onChange={onBackgroundBallsModeChange}
          />
        }
      />
    </div>
  );
}

export default App;
