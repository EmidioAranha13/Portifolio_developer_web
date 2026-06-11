import { useState } from "react";
import type { BackgroundBallsMode, BackgroundBallsToggleProps } from "../../utils/Types";
import "./BackgroundBallsToggle.css";

const LABEL_BY_MODE: Record<BackgroundBallsMode, string> = {
  "liquid-glass": "LiquidGlass",
  "floating-orbit": "BubbleBalls",
};

/**
 * Toggle de fundo animado: mini-bola deslizante + rótulo do modo ativo (estilo ThemeToggle).
 */
const BackgroundBallsToggle: React.FC<BackgroundBallsToggleProps> = ({
  defaultMode = "liquid-glass",
  mode,
  onChange,
}) => {
  const [internalMode, setInternalMode] = useState<BackgroundBallsMode>(defaultMode);
  const currentMode = mode ?? internalMode;
  const isFloating = currentMode === "floating-orbit";

  const handleToggle = () => {
    const nextMode: BackgroundBallsMode = isFloating ? "liquid-glass" : "floating-orbit";
    if (!mode) setInternalMode(nextMode);
    onChange?.(nextMode);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <button
      type="button"
      className={`background-balls-toggle${isFloating ? " background-balls-toggle--floating" : " background-balls-toggle--liquid"}`}
      onClick={handleToggle}
      onMouseDown={handleMouseDown}
      aria-label={`Alternar para fundo ${isFloating ? "LiquidGlass" : "BubbleBalls"}. Atual: ${LABEL_BY_MODE[currentMode]}`}
      aria-pressed={isFloating}
    >
      <span className="background-balls-toggle__label">{LABEL_BY_MODE[currentMode]}</span>
      <span className="background-balls-toggle__thumb" aria-hidden="true">
        {isFloating ? (
          <span className="background-balls-toggle__ball background-balls-toggle__ball--orbit">
            <span className="background-balls-toggle__ball-glass" />
          </span>
        ) : (
          <span className="background-balls-toggle__ball background-balls-toggle__ball--liquid" />
        )}
      </span>
    </button>
  );
};

export default BackgroundBallsToggle;
