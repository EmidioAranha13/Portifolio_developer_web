import { useEffect, useState } from "react";
import "./LoadingScreen.css";

type LoadingScreenProps = {
  onFinish: () => void;
  isContentReady: boolean;
};

/**
 * Tela de carregamento com animação de órbita e colisão.
 * O componente finaliza chamando onFinish para liberar a renderização principal.
 *
 * @param props Propriedades do componente.
 * @param props.onFinish Callback executado após a animação.
 * @param props.isContentReady Indica se a página principal já está carregada.
 * @returns JSX do overlay de carregamento.
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinish, isContentReady }) => {
  const [stage, setStage] = useState<"orbit" | "collision" | "reveal" | "done">("orbit");

  useEffect(() => {
    if (stage === "orbit") {
      const timer = window.setTimeout(() => setStage("collision"), 1500);
      return () => window.clearTimeout(timer);
    }

    if (stage === "collision" && isContentReady) {
      const timer = window.setTimeout(() => setStage("reveal"), 520);
      return () => window.clearTimeout(timer);
    }

    if (stage === "reveal") {
      const timer = window.setTimeout(() => setStage("done"), 920);
      return () => window.clearTimeout(timer);
    }

    if (stage !== "done") return undefined;
    onFinish();
    return undefined;
  }, [stage, onFinish, isContentReady]);

  return (
    <div className={`loading-screen stage-${stage}`}>
      <div className="loading-cover" />

      <div className="loading-orbit-container">
        <div className={`loading-ball loading-orbit-ball loading-blue ${stage !== "orbit" ? "to-center" : ""}`} />
        <div className={`loading-ball loading-orbit-ball loading-yellow ${stage !== "orbit" ? "to-center" : ""}`} />
        <div className={`loading-ball loading-orbit-ball loading-magenta ${stage !== "orbit" ? "to-center" : ""}`} />
      </div>

      {(stage === "collision" || stage === "reveal") && <div className="loading-portal-core" />}

      <p className="loading-text">
        {isContentReady ? "Abrindo experiência..." : "Carregando portifólio..."}
      </p>
    </div>
  );
};

export default LoadingScreen;
