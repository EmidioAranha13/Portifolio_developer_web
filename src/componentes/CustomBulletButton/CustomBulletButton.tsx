import type { CSSProperties } from "react";
import type {
  CustomBulletButtonButtonProps,
  CustomBulletButtonProps,
} from "../../utils/Types";
import "./CustomBulletButton.css";

/**
 * Botão reutilizável da seção hero com variantes visuais e ícone à direita.
 * Renderiza `<button>` por padrão e `<a>` quando `href` é informado.
 *
 * @param props Propriedades do botão customizado.
 * @param props.label Texto exibido no botão.
 * @param props.variant Variante visual (primary ou outline).
 * @param props.icon Tipo de ícone exibido no botão.
 * @returns JSX do botão estilizado.
 */
const CustomBulletButton: React.FC<CustomBulletButtonProps> = (props) => {
  const { label, variant, icon, className } = props;
  const iconUrl =
    icon === "download"
      ? new URL("../../assets/download.png", import.meta.url).href
      : new URL("../../assets/paperPlane.png", import.meta.url).href;

  const iconStyle = { "--button-icon-url": `url("${iconUrl}")` } as CSSProperties;

  const classes = `custom-bullet-button custom-bullet-button-${variant}${className ? ` ${className}` : ""}`;

  const content = (
    <span className="custom-bullet-button-content">
      <span className="custom-bullet-button-label">{label}</span>
      <span className="custom-bullet-button-icon-wrap" aria-hidden="true">
        <span className="custom-bullet-button-icon" style={iconStyle} />
      </span>
    </span>
  );

  if ("href" in props && props.href) {
    const { href, ...linkProps } = props;
    return (
      <a href={href} className={classes} {...linkProps}>
        {content}
      </a>
    );
  }

  const { type = "button", ...buttonProps } = props as CustomBulletButtonButtonProps;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  );
};

export default CustomBulletButton;
