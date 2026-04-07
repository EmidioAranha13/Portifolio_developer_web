import { useState } from "react";
import "./StyledHeader.css";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import LanguageSelector, { type LanguageCode } from "../LanguageSelector/LanguageSelector";

const HEADER_TABS = [
  "Sobre Mim",
  "Formação",
  "Experiências",
  "Habilidades",
  "Certificados",
  "Projetos",
  "Contatos",
] as const;

type StyledHeaderProps = {
  themeMode: "day" | "night";
  onThemeChange: (mode: "day" | "night") => void;
  language: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
};

/**
 * Cabeçalho estilizado usado na camada de conteúdo principal.
 * Renderiza uma barra de abas com destaque no item selecionado.
 *
 * @returns Elemento de header com navegação por abas.
 */
const StyledHeader: React.FC<StyledHeaderProps> = ({
  themeMode,
  onThemeChange,
  language,
  onLanguageChange,
}) => {
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
      <div className="header-controls">
        <ThemeToggle mode={themeMode} onChange={onThemeChange} />
        <LanguageSelector value={language} onChange={onLanguageChange} />
      </div>
    </header>
  );
};

export default StyledHeader;
