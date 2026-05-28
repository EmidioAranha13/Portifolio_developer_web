import "./FormTextArea.css";

const MESSAGE_MAX_LENGTH = 3000;

type FormTextAreaProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  maxLength?: number;
  className?: string;
};

const FormTextArea: React.FC<FormTextAreaProps> = ({
  id,
  value,
  onChange,
  placeholder,
  ariaLabel,
  maxLength = MESSAGE_MAX_LENGTH,
  className,
}) => {
  return (
    <div className={`form-text-area${className ? ` ${className}` : ""}`}>
      <textarea
        id={id}
        className="form-text-area__input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        maxLength={maxLength}
        rows={6}
      />
    </div>
  );
};

export default FormTextArea;
export { MESSAGE_MAX_LENGTH };
