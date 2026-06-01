import "./FormTextField.css";

type FormTextFieldProps = {
  id: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel";
  placeholder?: string;
  ariaLabel?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  pattern?: string;
  title?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
  className?: string;
};

const FormTextField: React.FC<FormTextFieldProps> = ({
  id,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  ariaLabel,
  autoComplete,
  required = false,
  disabled = false,
  pattern,
  title,
  inputMode,
  className,
}) => {
  return (
    <div className={`form-text-field${className ? ` ${className}` : ""}`}>
      <input
        id={id}
        name={name}
        type={type}
        className="form-text-field__input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        pattern={pattern}
        title={title}
        inputMode={inputMode}
      />
    </div>
  );
};

export default FormTextField;
