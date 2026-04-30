import { useMemo, useState } from "react";
import CardBox from "../../componentes/CardBox/CardBox";
import StyledSelector from "../../componentes/StyledSelector/StyledSelector";
import type { InfoTexts } from "../../utils/infoTextsCollection";
import type { SkillCardItem, SkillCardLine } from "../../utils/Types";
import filterIcon from "../../assets/filter.png";
import searchIcon from "../../assets/search.png";
import "./SkillPage.css";

type SkillPageProps = {
  title: string;
  infoTexts?: InfoTexts;
};

const DEFAULT_SKILL_TEXT = "Descrição da habilidade em breve.";
const SKILL_LINES: SkillCardLine[] = ["frontend", "backend", "mobile", "cloud"];

const SkillPage: React.FC<SkillPageProps> = ({ title, infoTexts }) => {
  const skillsFromProfile = infoTexts?.profile_page.globalSkills ?? [];
  const [selectedLine, setSelectedLine] = useState<string>("all");
  const [query, setQuery] = useState("");

  const cards: SkillCardItem[] =
    skillsFromProfile.length > 0
      ? skillsFromProfile.map((skill, index) => ({
          id: `skill-${index}`,
          title: skill,
          description: DEFAULT_SKILL_TEXT,
          years: `${Math.max(1, 5 - (index % 4))} anos`,
          line: SKILL_LINES[index % SKILL_LINES.length],
        }))
      : [
          { id: "s1", title: "Frontend", description: DEFAULT_SKILL_TEXT, years: "5 anos", line: "frontend" },
          { id: "s2", title: "Backend", description: DEFAULT_SKILL_TEXT, years: "4 anos", line: "backend" },
          { id: "s3", title: "Mobile", description: DEFAULT_SKILL_TEXT, years: "3 anos", line: "mobile" },
          { id: "s4", title: "Cloud", description: DEFAULT_SKILL_TEXT, years: "2 anos", line: "cloud" },
        ];

  const filteredCards = useMemo(
    () =>
      cards.filter((card) => {
        const matchLine = selectedLine === "all" ? true : card.line === selectedLine;
        const normalizedQuery = query.trim().toLowerCase();
        const matchQuery =
          normalizedQuery.length === 0
            ? true
            : `${card.title} ${card.description}`.toLowerCase().includes(normalizedQuery);
        return matchLine && matchQuery;
      }),
    [cards, query, selectedLine],
  );

  return (
    <div className="skill-page">
      <div className="skill-page__topbar">
        <div className="skill-page__heading glass-surface">
          <h1 className="skill-page__title">{title}</h1>
        </div>

        <div className="skill-page__filters">
          <StyledSelector
            value={selectedLine}
            onChange={setSelectedLine}
            ariaLabel="Filtrar por linha de frente"
            variant="theme-gradient"
            startIconSrc={filterIcon}
            startIconAlt="Filtro"
            className="skill-page__selector"
            options={[
              { value: "all", label: "Todas" },
              { value: "frontend", label: "Frontend" },
              { value: "backend", label: "Backend" },
              { value: "mobile", label: "Mobile" },
              { value: "cloud", label: "Cloud" },
            ]}
            optionClassNameByValue={{
              frontend: "skill-page__selector-option--frontend",
              backend: "skill-page__selector-option--backend",
              mobile: "skill-page__selector-option--mobile",
              cloud: "skill-page__selector-option--cloud",
            }}
          />

          <div className="skill-page__search">
            <img src={searchIcon} alt="" aria-hidden className="skill-page__search-icon" />
            <input
              type="text"
              className="skill-page__search-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Pesquisar habilidade..."
              aria-label="Pesquisar habilidade"
            />
            <button type="button" className="skill-page__search-button">
              Buscar
            </button>
          </div>
        </div>
      </div>

      <section className="skill-page__grid" aria-label="Cards de habilidades">
        {filteredCards.map((card) => (
          <CardBox key={card.id} className="skill-page__card">
            <span className={`skill-page__line-tag skill-page__line-tag--${card.line}`}>
              {card.line[0].toUpperCase() + card.line.slice(1)}
            </span>
            <div className="skill-page__image-wrapper" aria-hidden>
              {card.imageSrc ? (
                <img src={card.imageSrc} alt="" className="skill-page__image" />
              ) : (
                <span className="skill-page__image-default" />
              )}
            </div>

            <div className="skill-page__content">
              <h2 className="skill-page__card-title">{card.title}</h2>
              <p className="skill-page__card-text">{card.description}</p>
              <p className="skill-page__years">
                <strong>Experiência:</strong> {card.years}
              </p>
            </div>
          </CardBox>
        ))}
      </section>
    </div>
  );
};

export default SkillPage;
