import "./StyledFooter.css";

type StyledFooterProps = {
  text: string;
};

/**
 * Rodapé estilizado da aplicação com identidade visual do cabeçalho.
 *
 * @returns Elemento de footer com texto institucional.
 */
const StyledFooter: React.FC<StyledFooterProps> = ({ text }) => {
  return (
    <footer className="styled-footer" aria-label="Rodapé">
      <p className="styled-footer-text">{text}</p>
    </footer>
  );
};

export default StyledFooter;
