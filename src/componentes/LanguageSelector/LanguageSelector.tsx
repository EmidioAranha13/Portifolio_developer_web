import { useState } from "react";
import StyledSelector from "../StyledSelector/StyledSelector";
import type { LanguageCode, LanguageOption, LanguageSelectorProps } from "../../utils/Types";

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
  const selectedCode = value ?? internalValue;

  /**
   * Aplica a troca de idioma.
   *
   * @param nextCode Próximo idioma selecionado.
   * @returns void
   */
  const selectLanguage = (nextCode: LanguageCode) => {
    if (!value) setInternalValue(nextCode);
    onChange?.(nextCode);
  };

  return (
    <StyledSelector
      value={selectedCode}
      options={OPTIONS.map((option) => ({
        value: option.code,
        label: option.code,
        iconSrc: option.flagUrl,
        iconAlt: `Bandeira ${option.label}`,
      }))}
      onChange={(nextCode) => selectLanguage(nextCode as LanguageCode)}
      ariaLabel="Selecionar idioma"
      variant="default"
      className="language-selector"
    />
  );
};

export default LanguageSelector;
