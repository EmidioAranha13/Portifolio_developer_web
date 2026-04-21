import type { InfoTexts } from "../../utils/infoTextsCollection";
import MenuBoxSellection from "../../componentes/MenuBoxSellection/MenuBoxSellection";
import "./ExperiencePage.css";

type ExperiencePageProps = {
  title: string;
  /** Opcional até a página consumir cópias de `infoTexts`. */
  infoTexts?: InfoTexts;
};

/**
 * Página Experiências — layout principal via {@link MenuBoxSellection}.
 */
const ExperiencePage: React.FC<ExperiencePageProps> = ({ title }) => {
  return (
    <div className="experience-page">
      <h1 className="experience-page__sr-only">{title}</h1>
      <MenuBoxSellection bulletText={title} />
    </div>
  );
};

export default ExperiencePage;
