import type { InfoTexts } from "../../utils/infoTextsCollection";
import MenuBoxSellection from "../../componentes/MenuBoxSellection/MenuBoxSellection";
import type { MenuBoxSellectionItem } from "../../componentes/MenuBoxSellection/MenuBoxSellection";
import deltaLogo from "../../assets/DELTA.png";
import ictsLogo from "../../assets/ICTS.jpg";
import photoRotator1 from "../../assets/photo-rotator-1.jpg";
import photoRotator2 from "../../assets/photo-rotator-2.jpg";
import photoRotator3 from "../../assets/photo-rotator-3.jpg";
import photoRotator4 from "../../assets/photo-rotator-4.jpg";
import deltaProject1 from "../../assets/projects/Delta/project_1.png";
import deltaProject3 from "../../assets/projects/Delta/project_3.png";
import deltaProject4 from "../../assets/projects/Delta/project_4.png";
import deltaProject7 from "../../assets/projects/Delta/project_7.png";
import deltaProject8 from "../../assets/projects/Delta/project_8.png";
import deltaProject9 from "../../assets/projects/Delta/project_9.png";
import deltaProject10 from "../../assets/projects/Delta/project_10.png";
import deltaProject11 from "../../assets/projects/Delta/project_11.png";
import deltaProject12 from "../../assets/projects/Delta/project_12.png";
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

  const photoById: Record<string, string> = {
    photo1: photoRotator1,
    photo2: photoRotator2,
    photo3: photoRotator3,
    photo4: photoRotator4,
    delta_project_1: deltaProject1,
    delta_project_3: deltaProject3,
    delta_project_4: deltaProject4,
    delta_project_7: deltaProject7,
    delta_project_8: deltaProject8,
    delta_project_9: deltaProject9,
    delta_project_10: deltaProject10,
    delta_project_11: deltaProject11,
    delta_project_12: deltaProject12,
  };

  const experienceItems: MenuBoxSellectionItem[] | undefined = infoTexts?.experience_page.items.map(
    (item) => ({
      ...item,
      imageSrc: logoByExperienceId[item.id],
      photos: item.photos
        .map((photoKey) => photoById[photoKey])
        .filter((photo): photo is string => photo != null),
    }),
  );

  return (
    <div className="experience-page">
      <div className="experience-page__heading glass-surface">
        <h1 className="experience-page__title">{title}</h1>
      </div>
      <MenuBoxSellection
        items={experienceItems}
        roleTitle={infoTexts?.experience_page.role_title}
        actionsTitle={infoTexts?.experience_page.actions_title}
        projectsTitle={infoTexts?.experience_page.projects_title}
      />
    </div>
  );
};

export default ExperiencePage;
