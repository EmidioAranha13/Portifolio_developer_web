import "./FormTextField.css";

type FormTextFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email";
  placeholder?: string;
  ariaLabel?: string;
  autoComplete?: string;
  className?: string;
};

const FormTextField: React.FC<FormTextFieldProps> = ({
  id,
  value,
  onChange,
  type = "text",
  placeholder,
  ariaLabel,
  autoComplete,
  className,
}) => {
  return (
    <div className={`form-text-field${className ? ` ${className}` : ""}`}>
      <input
        id={id}
        type={type}
        className="form-text-field__input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        autoComplete={autoComplete}
      />
    </div>
  );
};

export default FormTextField;
