import { useMemo, useState } from "react";
import CardBox from "../../componentes/CardBox/CardBox";
import SearchField from "../../componentes/SearchField/SearchField";
import StyledSelector from "../../componentes/StyledSelector/StyledSelector";
import type { InfoTexts } from "../../utils/infoTextsCollection";
import type { SkillBadgeKey, SkillCardItem, SkillCardLine } from "../../utils/Types";
import filterIcon from "../../assets/filter.png";
import searchIcon from "../../assets/search.png";
import reactBadge from "../../assets/skills-badges/react.png";
import reactNativeBadge from "../../assets/skills-badges/react_native.png";
import javascriptBadge from "../../assets/skills-badges/javascript.png";
import typescriptBadge from "../../assets/skills-badges/typescript.png";
import htmlBadge from "../../assets/skills-badges/html.png";
import cssBadge from "../../assets/skills-badges/css.png";
import reduxBadge from "../../assets/skills-badges/redux.png";
import materialUiBadge from "../../assets/skills-badges/materialUi.png";
import bootstrapBadge from "../../assets/skills-badges/bootstrap.png";
import handlebarsBadge from "../../assets/skills-badges/handlebars.png";
import styleDictionaryBadge from "../../assets/skills-badges/style_dictionary.png";
import styledComponentsBadge from "../../assets/skills-badges/styled_components.png";
import nodeBadge from "../../assets/skills-badges/node.png";
import expressBadge from "../../assets/skills-badges/express.png";
import sequelizeBadge from "../../assets/skills-badges/sequelize.png";
import restApiBadge from "../../assets/skills-badges/rest_api.png";
import graphqlBadge from "../../assets/skills-badges/GraphQL.png";
import springBootBadge from "../../assets/skills-badges/spring_boot.png";
import dockerBadge from "../../assets/skills-badges/LogosDocker.png";
import awsBadge from "../../assets/skills-badges/aws.png";
import figmaBadge from "../../assets/skills-badges/Figma.png";
import sqlBadge from "../../assets/skills-badges/sql.png";
import mysqlBadge from "../../assets/skills-badges/mysql.png";
import mssqlBadge from "../../assets/skills-badges/mssql.png";
import postgresqlBadge from "../../assets/skills-badges/postgre_sql.png";
import androidStudioBadge from "../../assets/skills-badges/android_studio.png";
import kotlinBadge from "../../assets/skills-badges/kotlin.png";
import jetpackComposeBadge from "../../assets/skills-badges/jeckpack_compose.png";
import javaBadge from "../../assets/skills-badges/java.png";
import cFamilyBadge from "../../assets/skills-badges/cplus_c_csharp.png";
import rustBadge from "../../assets/skills-badges/rust.png";
import pythonBadge from "../../assets/skills-badges/python.png";
import gitGithubBadge from "../../assets/skills-badges/git_github.png";
import bpmnBadge from "../../assets/skills-badges/bpmn.png";
import umlBadge from "../../assets/skills-badges/uml.png";
import storybookBadge from "../../assets/skills-badges/storybook.png";
import pandasBadge from "../../assets/skills-badges/pandas.png";
import jestBadge from "../../assets/skills-badges/jest.png";
import agileBadge from "../../assets/skills-badges/agile.png";
import defaultBadge from "../../assets/skills-badges/default.png";
import "./SkillPage.css";

type SkillPageProps = {
  title: string;
  infoTexts?: InfoTexts;
};

const SKILL_BADGE_SRC: Record<SkillBadgeKey, string> = {
  react: reactBadge,
  react_native: reactNativeBadge,
  javascript: javascriptBadge,
  typescript: typescriptBadge,
  html: htmlBadge,
  css: cssBadge,
  redux: reduxBadge,
  material_ui: materialUiBadge,
  bootstrap: bootstrapBadge,
  handlebars: handlebarsBadge,
  style_dictionary: styleDictionaryBadge,
  styled_components: styledComponentsBadge,
  node: nodeBadge,
  express: expressBadge,
  sequelize: sequelizeBadge,
  rest_api: restApiBadge,
  graphql: graphqlBadge,
  spring_boot: springBootBadge,
  docker: dockerBadge,
  aws: awsBadge,
  figma: figmaBadge,
  sql: sqlBadge,
  mysql: mysqlBadge,
  mssql: mssqlBadge,
  postgresql: postgresqlBadge,
  android_studio: androidStudioBadge,
  kotlin: kotlinBadge,
  jetpack_compose: jetpackComposeBadge,
  java: javaBadge,
  c_family: cFamilyBadge,
  rust: rustBadge,
  python: pythonBadge,
  git_github: gitGithubBadge,
  bpmn: bpmnBadge,
  uml: umlBadge,
  storybook: storybookBadge,
  pandas: pandasBadge,
  jest: jestBadge,
  agile: agileBadge,
  default: defaultBadge,
};

const BOOSTED_BADGES = new Set<SkillBadgeKey>([
  "styled_components",
  "node",
  "sequelize",
  "spring_boot",
  "docker",
  "mysql",
  "mssql",
  "postgresql",
  "kotlin",
  "java",
  "c_family",
  "rust",
  "git_github",
  "uml",
  "pandas",
]);

function resolveSkillImageSrcs(skill: {
  badges?: SkillBadgeKey[];
  img: string;
}): string[] {
  const fromBadges = (skill.badges ?? []).map((key) => SKILL_BADGE_SRC[key]).filter(Boolean);
  if (fromBadges.length > 0) return fromBadges;
  const trimmed = skill.img.trim();
  return trimmed.length > 0 ? [trimmed] : [];
}

const SkillPage: React.FC<SkillPageProps> = ({ title, infoTexts }) => {
  const [selectedLine, setSelectedLine] = useState<string>("all");
  const [query, setQuery] = useState("");

  const cards: SkillCardItem[] = (infoTexts?.skill_page?.skills ?? []).map((skill, index) => ({
    id: `skill-${index}`,
    title: skill.title,
    description: skill.description,
    years: skill.years,
    projects: skill.projects,
    lines: [...new Set(skill.types)],
    badgeKeys: [...new Set(skill.badges ?? [])],
    imageSrcs: resolveSkillImageSrcs(skill),
  }));

  const filteredCards = useMemo(
    () =>
      cards.filter((card) => {
        const matchLine =
          selectedLine === "all" ? true : card.lines.includes(selectedLine as SkillCardLine);
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
              { value: "devops", label: "DevOps" },
              { value: "design", label: "Design" },
              { value: "management", label: "Management" },
              { value: "database", label: "Database" },
            ]}
            optionClassNameByValue={{
              frontend: "skill-page__selector-option--frontend",
              backend: "skill-page__selector-option--backend",
              mobile: "skill-page__selector-option--mobile",
              devops: "skill-page__selector-option--devops",
              design: "skill-page__selector-option--design",
              management: "skill-page__selector-option--management",
              database: "skill-page__selector-option--database",
            }}
          />

          <div className="skill-page__search">
            <SearchField
              value={query}
              onChange={setQuery}
              placeholder="Pesquisar habilidade..."
              ariaLabel="Pesquisar habilidade"
              iconSrc={searchIcon}
            />
          </div>
        </div>
      </div>

      <section className="skill-page__grid" aria-label="Cards de habilidades">
        <p className="skill-page__count">Itens Listados: {filteredCards.length}</p>
        {filteredCards.length === 0 ? (
          <CardBox className="skill-page__empty-card">
            <p className="skill-page__empty-text">Nenhum item encontrado</p>
          </CardBox>
        ) : (
          filteredCards.map((card) => (
            <CardBox key={card.id} className="skill-page__card">
              <div className="skill-page__card-media">
                <div className="skill-page__line-tags">
                  {card.lines.map((line, tagIndex) => (
                    <span
                      key={`${card.id}-${line}-${tagIndex}`}
                      className={`skill-page__line-tag skill-page__line-tag--${line}`}
                    >
                      {line[0].toUpperCase() + line.slice(1)}
                    </span>
                  ))}
                </div>
                <div
                  className={`skill-page__image-wrapper${
                    card.imageSrcs.length > 1 ? " skill-page__image-wrapper--multi" : ""
                  }${
                    card.badgeKeys.some((badgeKey) => BOOSTED_BADGES.has(badgeKey))
                      ? " skill-page__image-wrapper--boosted"
                      : ""
                  }`}
                  aria-hidden
                >
                  {card.imageSrcs.length === 0 ? (
                    <span className="skill-page__image-default" />
                  ) : card.imageSrcs.length === 1 ? (
                    <img src={card.imageSrcs[0]} alt="" className="skill-page__image" />
                  ) : (
                    <div className="skill-page__badge-composite">
                      {card.imageSrcs.map((src, i) => (
                        <img key={`${card.id}-badge-${i}`} src={src} alt="" className="skill-page__image" />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="skill-page__content">
                <h2 className="skill-page__card-title">{card.title}</h2>
                <p className="skill-page__card-text">{card.description}</p>
                <div className="skill-page__card-footer">
                  <p className="skill-page__years">
                    <strong>Experiência:</strong> {card.years}
                  </p>
                  <p className="skill-page__projects">
                    <strong>Em projetos:</strong> {card.projects}
                  </p>
                </div>
              </div>
            </CardBox>
          ))
        )}
      </section>
    </div>
  );
};

export default SkillPage;
