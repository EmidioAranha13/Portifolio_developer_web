import { useEffect, useState } from "react";
import LiquidGlassBalls from "./componentes/LiquidGlassBalls/LiquidGlassBalls";
import LoadingScreen from "./componentes/LoadingScreen/LoadingScreen";
import StyledHeader from "./componentes/StyledHeader/StyledHeader";
import "./App.css";

type GlassPreset = "soft" | "crystal" | "liquid-strong";
type ThemeMode = "day" | "night";

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
  const [assetsReady, setAssetsReady] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);

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

  return (
    <div className={`App theme-${themeMode}`}>
      {!loaderDone && (
        <LoadingScreen
          themeMode={themeMode}
          isContentReady={assetsReady}
          onFinish={() => setLoaderDone(true)}
        />
      )}

      <StyledHeader themeMode={themeMode} onThemeChange={setThemeMode} />
      <LiquidGlassBalls preset={preset}>
        <div className="content">
          <h1>Bem Vindo !</h1>
        </div>
        {/* <div className="preset-hint">
          <span>{`Preset: ${preset}`}</span>
          <span>1 soft | 2 crystal | 3 liquid-strong</span>
        </div> */}
      </LiquidGlassBalls>
    </div>
  );
}

export default App;
