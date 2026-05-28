import "./LoadingOrbitSpinner.css";

type LoadingOrbitSpinnerProps = {
  /** Texto só para leitores de tela (não é exibido visualmente). */
  label?: string;
  className?: string;
};

/**
 * Três bolas em órbita — mesmo visual do LoadingScreen, sem fundo nem colisão.
 */
const LoadingOrbitSpinner: React.FC<LoadingOrbitSpinnerProps> = ({
  label = "Carregando…",
  className,
}) => {
  const rootClass = ["loading-orbit-spinner", className].filter(Boolean).join(" ");

  return (
    <div className={rootClass} role="status" aria-live="polite" aria-label={label}>
      <div className="loading-orbit-spinner__stage" aria-hidden="true">
        <div className="loading-orbit-spinner__ball loading-orbit-spinner__ball--blue" />
        <div className="loading-orbit-spinner__ball loading-orbit-spinner__ball--yellow" />
        <div className="loading-orbit-spinner__ball loading-orbit-spinner__ball--magenta" />
      </div>
    </div>
  );
};

export default LoadingOrbitSpinner;
