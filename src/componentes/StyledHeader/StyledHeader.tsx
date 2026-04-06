import { useState } from "react";
import "./StyledHeader.css";

const HEADER_TABS = [
  "Sobre Mim",
  "Formação",
  "Experiências",
  "Habilidades",
  "Certificados",
  "Projetos",
  "Contatos",
] as const;

/**
 * Cabeçalho estilizado usado na camada de conteúdo principal.
 * Renderiza uma barra de abas com destaque no item selecionado.
 *
 * @returns Elemento de header com navegação por abas.
 */
const StyledHeader: React.FC = () => {
  const [activeTab, setActiveTab] = useState<(typeof HEADER_TABS)[number]>("Sobre Mim");

  return (
    <header className="background">
      <nav className="tabs" aria-label="Seções do portfólio">
        {HEADER_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`tab-item ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default StyledHeader;
