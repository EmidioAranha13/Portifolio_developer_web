import { useMemo, useState } from "react";
import type { ThemeMode, ThemeToggleProps } from "../../utils/Types";
import "./ThemeToggle.css";

/**
 * Toggle visual de tema com imagens de manhã/noite.
 * O trilho alterna entre os fundos e o botão alterna entre Sol/Lua.
 *
 * @param props Propriedades do componente.
 * @param props.defaultMode Modo inicial do toggle.
 * @param props.onChange Callback chamado ao trocar o modo.
 * @returns JSX do botão toggle.
 */
const ThemeToggle: React.FC<ThemeToggleProps> = ({
  defaultMode = "day",
  mode,
  onChange,
}) => {
  const [internalMode, setInternalMode] = useState<ThemeMode>(defaultMode);

  const assets = useMemo(
    () => ({
      dayTrack: new URL("../../assets/Manhã.png", import.meta.url).href,
      nightTrack: new URL("../../assets/Noite.png", import.meta.url).href,
      sunThumb: new URL("../../assets/Sol.png", import.meta.url).href,
      moonThumb: new URL("../../assets/Lua.png", import.meta.url).href,
    }),
    []
  );

  const currentMode = mode ?? internalMode;
  const isNight = currentMode === "night";

  /**
   * Alterna o estado visual entre manhã e noite.
   *
   * @returns void
   */
  const handleToggle = () => {
    const nextMode = isNight ? "day" : "night";
    if (!mode) setInternalMode(nextMode);
    onChange?.(nextMode);
  };

  return (
    <button
      type="button"
      className={`theme-toggle ${isNight ? "night" : "day"}`}
      onClick={handleToggle}
      aria-label={`Alternar para modo ${isNight ? "manhã" : "noite"}`}
      style={{
        backgroundImage: `url("${isNight ? assets.nightTrack : assets.dayTrack}")`,
      }}
    >
      <span className="theme-toggle-thumb">
        <img
          src={isNight ? assets.moonThumb : assets.sunThumb}
          alt={isNight ? "Lua" : "Sol"}
        />
      </span>
    </button>
  );
};

export default ThemeToggle;
