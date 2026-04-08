import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./StyledHeader.css";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import LanguageSelector, { type LanguageCode } from "../LanguageSelector/LanguageSelector";
import type { RootState } from "../../store/index";
import { setActiveSection, type SectionKey } from "../../store/uiSlice";

const HEADER_TABS = [
  {
    key: "about",
    iconUrl: new URL("../../assets/aboutMe.png", import.meta.url).href,
  },
  {
    key: "education",
    iconUrl: new URL("../../assets/education.png", import.meta.url).href,
  },
  {
    key: "experience",
    iconUrl: new URL("../../assets/work.png", import.meta.url).href,
  },
  {
    key: "skills",
    iconUrl: new URL("../../assets/skills.png", import.meta.url).href,
  },
  {
    key: "certifications",
    iconUrl: new URL("../../assets/certified.png", import.meta.url).href,
  },
  {
    key: "projects",
    iconUrl: new URL("../../assets/projects.png", import.meta.url).href,
  },
  {
    key: "contact",
    iconUrl: new URL("../../assets/paperPlane2.png", import.meta.url).href,
  },
] as const;

type StyledHeaderProps = {
  themeMode: "day" | "night";
  onThemeChange: (mode: "day" | "night") => void;
  language: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
  tabLabels: Record<SectionKey, string>;
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
  tabLabels,
}) => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.ui.activeSection);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuIcon = new URL("../../assets/menu.png", import.meta.url).href;

  /**
   * Marca a aba ativa e fecha o drawer no mobile.
   *
   * @param tab Nome da aba selecionada.
   * @returns void
   */
  const handleTabClick = (tab: SectionKey) => {
    dispatch(setActiveSection(tab));
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="background">
      <button
        type="button"
        className="mobile-menu-trigger"
        aria-label="Abrir menu"
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-header-drawer"
        onClick={() => setIsMobileMenuOpen((previous) => !previous)}
      >
        <img src={menuIcon} alt="" aria-hidden="true" className="mobile-menu-icon" />
      </button>

      <nav className="tabs" aria-label="Seções do portfólio">
        {HEADER_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`tab-item ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => handleTabClick(tab.key)}
          >
            <span>{tabLabels[tab.key]}</span>
            <img src={tab.iconUrl} alt="" aria-hidden="true" className="tab-icon" />
          </button>
        ))}
      </nav>

      <div
        className={`mobile-drawer-backdrop ${isMobileMenuOpen ? "open" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <nav
        id="mobile-header-drawer"
        className={`mobile-drawer ${isMobileMenuOpen ? "open" : ""}`}
        aria-label="Menu mobile do portfólio"
      >
        {HEADER_TABS.map((tab) => (
          <button
            key={`mobile-${tab.key}`}
            type="button"
            className={`mobile-tab-item ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => handleTabClick(tab.key)}
          >
            <img
              src={tab.iconUrl}
              alt=""
              aria-hidden="true"
              className="mobile-tab-icon"
            />
            <span>{tabLabels[tab.key]}</span>
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
