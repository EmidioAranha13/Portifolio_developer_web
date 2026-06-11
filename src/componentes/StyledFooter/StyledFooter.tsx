import type { StyledFooterProps } from "../../utils/Types";
import "./StyledFooter.css";

/**
 * Rodapé estilizado da aplicação com identidade visual do cabeçalho.
 *
 * @returns Elemento de footer com texto institucional.
 */
const StyledFooter: React.FC<StyledFooterProps> = ({ text, controls }) => {
  return (
    <footer className="styled-footer" aria-label="Rodapé">
      {controls ? <div className="styled-footer__controls">{controls}</div> : null}
      <p className="styled-footer-text">{text}</p>
    </footer>
  );
};

export default StyledFooter;
