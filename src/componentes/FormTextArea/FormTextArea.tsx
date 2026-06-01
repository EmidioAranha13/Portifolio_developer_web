import "./FormTextArea.css";

const MESSAGE_MAX_LENGTH = 1000;

type FormTextAreaProps = {
  id: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

const FormTextArea: React.FC<FormTextAreaProps> = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  ariaLabel,
  ariaDescribedBy,
  maxLength = MESSAGE_MAX_LENGTH,
  required = false,
  disabled = false,
  className,
}) => {
  return (
    <div className={`form-text-area${className ? ` ${className}` : ""}`}>
      <textarea
        id={id}
        name={name}
        className="form-text-area__input"
        value={value}
        onChange={(event) => onChange(event.target.value.slice(0, maxLength))}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        aria-describedby={ariaDescribedBy}
        maxLength={maxLength}
        required={required}
        disabled={disabled}
        rows={6}
      />
    </div>
  );
};

export default FormTextArea;
export { MESSAGE_MAX_LENGTH };
