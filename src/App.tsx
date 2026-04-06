import { useEffect, useState } from "react";
import LiquidGlassBalls from "./componentes/LiquidGlassBalls/LiquidGlassBalls";
import LoadingScreen from "./componentes/LoadingScreen/LoadingScreen";
import StyledHeader from "./componentes/StyledHeader/StyledHeader";
import "./App.css";

type GlassPreset = "soft" | "crystal" | "liquid-strong";

/**
 * Componente raiz da aplicação.
 * Renderiza o fundo de bolas de vidro e escuta teclas para trocar preset visual.
 *
 * @returns JSX da tela inicial do portfólio.
 */
function App() {
  const [preset, setPreset] = useState<GlassPreset>("liquid-strong");
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

  return (
    <div className="App">
      {!loaderDone && (
        <LoadingScreen
          isContentReady={assetsReady}
          onFinish={() => setLoaderDone(true)}
        />
      )}

      <StyledHeader />
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
