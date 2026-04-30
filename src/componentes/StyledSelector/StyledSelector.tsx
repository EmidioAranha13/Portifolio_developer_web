import { useMemo, useState } from "react";
import type { StyledSelectorProps } from "../../utils/Types";
import "./StyledSelector.css";

const StyledSelector: React.FC<StyledSelectorProps> = ({
  value,
  options,
  onChange,
  ariaLabel,
  variant = "default",
  className,
  optionClassNameByValue,
  startIconSrc,
  startIconAlt = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? options[0],
    [options, value],
  );

  return (
    <div className={`styled-selector${className ? ` ${className}` : ""}`}>
      <button
        type="button"
        className={`styled-selector__trigger styled-selector__trigger--${variant}`}
        onClick={() => setIsOpen((previous) => !previous)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
      >
        {startIconSrc ? <img src={startIconSrc} alt={startIconAlt} className="styled-selector__start-icon" /> : null}
        <span className="styled-selector__label">{selectedOption?.label}</span>
        {selectedOption?.iconSrc ? <span className="styled-selector__divider">|</span> : null}
        {selectedOption?.iconSrc ? (
          <img
            className="styled-selector__option-icon"
            src={selectedOption.iconSrc}
            alt={selectedOption.iconAlt ?? ""}
          />
        ) : null}
      </button>

      {isOpen ? (
        <div className="styled-selector__menu glass-surface" role="listbox" aria-label={ariaLabel}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={`styled-selector__option${option.value === value ? " is-active" : ""}${
                optionClassNameByValue?.[option.value] ? ` ${optionClassNameByValue[option.value]}` : ""
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              <span>{option.label}</span>
              {option.iconSrc ? <span className="styled-selector__divider">|</span> : null}
              {option.iconSrc ? (
                <img
                  className="styled-selector__option-icon"
                  src={option.iconSrc}
                  alt={option.iconAlt ?? ""}
                />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default StyledSelector;
