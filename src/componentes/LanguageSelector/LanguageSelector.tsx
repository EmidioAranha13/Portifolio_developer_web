import { useMemo, useRef, useState } from "react";
import type { LanguageCode, LanguageOption, LanguageSelectorProps } from "../../utils/Types";
import "./LanguageSelector.css";

export type { LanguageCode };

const OPTIONS: LanguageOption[] = [
  {
    code: "BR",
    label: "PT-BR",
    flagUrl: new URL("../../assets/BR.png", import.meta.url).href,
  },
  {
    code: "EN",
    label: "EN",
    flagUrl: new URL("../../assets/EN.png", import.meta.url).href,
  },
  {
    code: "JA",
    label: "JA",
    flagUrl: new URL("../../assets/JA.png", import.meta.url).href,
  },
];

/**
 * Seletor de idioma em formato cápsula.
 * Exibe idioma selecionado com divisor e bandeira circular.
 *
 * @param props Propriedades do seletor.
 * @param props.value Idioma controlado externamente.
 * @param props.defaultValue Idioma inicial quando não-controlado.
 * @param props.onChange Callback para troca de idioma.
 * @returns JSX do seletor de idioma.
 */
const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  defaultValue = "BR",
  onChange,
}) => {
  const [internalValue, setInternalValue] = useState<LanguageCode>(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedCode = value ?? internalValue;

  const selectedOption = useMemo(
    () => OPTIONS.find((option) => option.code === selectedCode) ?? OPTIONS[0],
    [selectedCode]
  );

  /**
   * Aplica a troca de idioma.
   *
   * @param nextCode Próximo idioma selecionado.
   * @returns void
   */
  const selectLanguage = (nextCode: LanguageCode) => {
    if (!value) setInternalValue(nextCode);
    onChange?.(nextCode);
    setIsOpen(false);
  };

  return (
    <div className="language-selector" ref={containerRef}>
      <button
        type="button"
        className="language-selector-trigger"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Selecionar idioma"
      >
        <span className="language-selector-code">{selectedOption.code}</span>
        <span className="language-selector-divider">|</span>
        <img
          className="language-selector-flag"
          src={selectedOption.flagUrl}
          alt={`Bandeira ${selectedOption.label}`}
        />
      </button>

      {isOpen && (
        <div
          className="language-selector-menu glass-surface"
          role="listbox"
          aria-label="Idiomas"
        >
          {OPTIONS.map((option) => (
            <button
              key={option.code}
              type="button"
              className={`language-selector-option ${option.code === selectedCode ? "active" : ""}`}
              onClick={() => selectLanguage(option.code)}
              role="option"
              aria-selected={option.code === selectedCode}
            >
              <span>{option.code}</span>
              <span className="language-selector-divider">|</span>
              <img
                className="language-selector-flag"
                src={option.flagUrl}
                alt={`Bandeira ${option.label}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
