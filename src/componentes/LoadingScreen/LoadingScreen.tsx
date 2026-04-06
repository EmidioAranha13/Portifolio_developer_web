import { useEffect, useState } from "react";
import "./LoadingScreen.css";

type LoadingScreenProps = {
  onFinish: () => void;
  isContentReady: boolean;
  mode?: "portfolio" | "experience";
};

/**
 * Tela de carregamento com animação de órbita e colisão.
 * O componente finaliza chamando onFinish para liberar a renderização principal.
 *
 * @param props Propriedades do componente.
 * @param props.onFinish Callback executado após a animação.
 * @param props.isContentReady Indica se a página principal já está carregada.
 * @param props.mode Define o contexto do loading (portfólio ou experiência).
 * @returns JSX do overlay de carregamento.
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onFinish,
  isContentReady,
  mode = "portfolio",
}) => {
  const [stage, setStage] = useState<"orbit" | "collision" | "portal" | "reveal" | "done">("orbit");
  const loadingText = mode === "experience" ? "Abrindo experiência..." : "Carregando portifólio...";

  useEffect(() => {
    if (stage === "orbit") {
      const timer = window.setTimeout(() => setStage("collision"), 1500);
      return () => window.clearTimeout(timer);
    }

    if (stage === "collision") {
      const timer = window.setTimeout(() => setStage("portal"), 520);
      return () => window.clearTimeout(timer);
    }

    if (stage === "portal" && isContentReady) {
      const timer = window.setTimeout(() => setStage("reveal"), 260);
      return () => window.clearTimeout(timer);
    }

    if (stage === "reveal") {
      const timer = window.setTimeout(() => setStage("done"), 1800);
      return () => window.clearTimeout(timer);
    }

    if (stage !== "done") return undefined;
    onFinish();
    return undefined;
  }, [stage, onFinish, isContentReady]);

  return (
    <div className={`loading-screen stage-${stage}`}>
      <div className="loading-surface">
        <div className="loading-orbit-container">
          <div className={`loading-ball loading-orbit-ball loading-blue ${stage !== "orbit" ? "to-center" : ""}`} />
          <div className={`loading-ball loading-orbit-ball loading-yellow ${stage !== "orbit" ? "to-center" : ""}`} />
          <div className={`loading-ball loading-orbit-ball loading-magenta ${stage !== "orbit" ? "to-center" : ""}`} />
        </div>

        <p className="loading-text">{loadingText}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
