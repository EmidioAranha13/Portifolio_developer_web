import "./SearchField.css";

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  iconSrc?: string;
  iconAlt?: string;
  className?: string;
};

const SearchField: React.FC<SearchFieldProps> = ({
  value,
  onChange,
  placeholder = "Pesquisar...",
  ariaLabel = "Pesquisar",
  iconSrc,
  iconAlt = "",
  className,
}) => {
  return (
    <div className={`search-field${className ? ` ${className}` : ""}`}>
      {iconSrc ? <img src={iconSrc} alt={iconAlt} aria-hidden className="search-field__icon" /> : null}
      <input
        type="text"
        className="search-field__input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
    </div>
  );
};

export default SearchField;
