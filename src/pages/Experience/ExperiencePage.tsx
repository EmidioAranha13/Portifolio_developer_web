import type { InfoTexts } from "../../utils/infoTextsCollection";
import MenuBoxSellection from "../../componentes/MenuBoxSellection/MenuBoxSellection";
import type { MenuBoxSellectionItem } from "../../componentes/MenuBoxSellection/MenuBoxSellection";
import deltaLogo from "../../assets/DELTA.png";
import ictsLogo from "../../assets/ICTS.jpg";
import "./ExperiencePage.css";

type ExperiencePageProps = {
  title: string;
  /** Opcional até a página consumir cópias de `infoTexts`. */
  infoTexts?: InfoTexts;
};

/**
 * Página Experiências — layout principal via {@link MenuBoxSellection}.
 */
const ExperiencePage: React.FC<ExperiencePageProps> = ({ title, infoTexts }) => {
  const logoByExperienceId: Record<string, string | undefined> = {
    delta: deltaLogo,
    icts: ictsLogo,
    freelance: undefined,
  };

  const experienceItems: MenuBoxSellectionItem[] | undefined = infoTexts?.experience_page.items.map(
    (item) => ({
      ...item,
      imageSrc: logoByExperienceId[item.id],
    }),
  );

  return (
    <div className="experience-page">
      <div className="experience-page__heading glass-surface">
        <h1 className="experience-page__title">{title}</h1>
      </div>
      <MenuBoxSellection items={experienceItems} />
    </div>
  );
};

export default ExperiencePage;
