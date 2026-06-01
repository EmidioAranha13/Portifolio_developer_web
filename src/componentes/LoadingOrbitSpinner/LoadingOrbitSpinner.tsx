import "./LoadingOrbitSpinner.css";

type LoadingOrbitSpinnerProps = {
  /** Texto só para leitores de tela (não é exibido visualmente). */
  label?: string;
  className?: string;
};

/**
 * Três esferas em órbita: vidro neutro (liquid glass) com contorno em degradê do tema.
 */
const LoadingOrbitSpinner: React.FC<LoadingOrbitSpinnerProps> = ({
  label = "Carregando…",
  className,
}) => {
  const rootClass = ["loading-orbit-spinner", className].filter(Boolean).join(" ");

  return (
    <div className={rootClass} role="status" aria-live="polite" aria-label={label}>
      <div className="loading-orbit-spinner__stage" aria-hidden="true">
        <div className="loading-orbit-spinner__ball loading-orbit-spinner__ball--1">
          <div className="loading-orbit-spinner__ball-glass" />
        </div>
        <div className="loading-orbit-spinner__ball loading-orbit-spinner__ball--2">
          <div className="loading-orbit-spinner__ball-glass" />
        </div>
        <div className="loading-orbit-spinner__ball loading-orbit-spinner__ball--3">
          <div className="loading-orbit-spinner__ball-glass" />
        </div>
      </div>
    </div>
  );
};

export default LoadingOrbitSpinner;
