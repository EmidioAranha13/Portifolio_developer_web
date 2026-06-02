import { GitHubCalendar } from "react-github-calendar";
import "react-github-calendar/tooltips.css";
import CarouselSelector from "../../componentes/CarouselSelector/CarouselSelector";
import ProfileSectionRail from "../../componentes/ProfileSectionRail/ProfileSectionRail";
import type { ProjectCarouselCardItem, ThemeMode } from "../../utils/Types";
import type { InfoTexts } from "../../utils/infoTextsCollection";
import { PROJECT_DEFAULT_IMAGE, PROJECT_IMAGES } from "../../utils/projectAssets";
import arrow1 from "../../assets/arrow-1.png";
import "./ProjectsPage.css";

const GITHUB_USERNAME = "EmidioAranha13";

/** Cores do heatmap alinhadas ao degradê do portfólio (noite / dia). */
const CONTRIBUTION_THEME = {
  dark: ["#101010", "#0a3d52", "#01689d", "#3fa874", "#9cd65d"],
  light: ["#e2e9fc", "#f5b8d4", "#c9a0e8", "#7a8ae8", "#13b4b9"],
};

type ProjectsPageProps = {
  title: string;
  themeMode: ThemeMode;
  infoTexts: InfoTexts;
};

/**
 * Página Projetos — heading em pílula + painéis com ProfileSectionRail.
 */
const ProjectsPage: React.FC<ProjectsPageProps> = ({ title, themeMode, infoTexts }) => {
  const page = infoTexts.projects_page;
  const colorScheme = themeMode === "day" ? "light" : "dark";
  const carouselItems: ProjectCarouselCardItem[] = page.carousel_cards.map((card) => ({
    ...card,
    imageSrc: card.img ? PROJECT_IMAGES[card.img] : PROJECT_DEFAULT_IMAGE,
  }));

  return (
    <div className="projects-page">
      <div className="projects-page__heading glass-surface">
        <h1 className="projects-page__title">{title}</h1>
      </div>

      <div className="projects-page__content glass-surface">
        <ProfileSectionRail
          imageSrc={arrow1}
          className="projects-page__rail projects-page__rail--contributions"
        >
          <div className="projects-page__heading-stack">
            <h2
              id="projects-contributions-heading"
              className="projects-page__section-title"
            >
              <span className="projects-page__section-title-text">
                {page.contributions_title}
              </span>
            </h2>
            <div className="projects-page__heading-rule" aria-hidden="true" />
          </div>

          <section
            className="projects-page__contributions-body"
            aria-labelledby="projects-contributions-heading"
          >
            <div className="projects-page__calendar-wrap">
              <GitHubCalendar
                username={GITHUB_USERNAME}
                colorScheme={colorScheme}
                theme={CONTRIBUTION_THEME}
                blockSize={12}
                blockMargin={4}
                blockRadius={3}
                fontSize={14}
                showTotalCount
                showColorLegend
                showMonthLabels
                labels={{
                  totalCount: page.contributions_total,
                  legend: {
                    less: page.contributions_less,
                    more: page.contributions_more,
                  },
                }}
                errorMessage={page.contributions_error}
              />
            </div>

            <div className="projects-page__stats" role="group" aria-label={page.stat_total_label}>
              <div className="projects-page__stat">
                <p className="projects-page__stat-label">{page.stat_total_label}</p>
                <p className="projects-page__stat-value" aria-label={page.stat_total_label}>
                  {page.stats.total}
                </p>
              </div>
              <div className="projects-page__stat-divider" aria-hidden="true" />
              <div className="projects-page__stat">
                <p className="projects-page__stat-label">{page.stat_completed_label}</p>
                <p className="projects-page__stat-value" aria-label={page.stat_completed_label}>
                  {page.stats.completed}
                </p>
              </div>
              <div className="projects-page__stat-divider" aria-hidden="true" />
              <div className="projects-page__stat">
                <p className="projects-page__stat-label">{page.stat_personal_label}</p>
                <p className="projects-page__stat-value" aria-label={page.stat_personal_label}>
                  {page.stats.personal}
                </p>
              </div>
              <div className="projects-page__stat-divider" aria-hidden="true" />
              <div className="projects-page__stat">
                <p className="projects-page__stat-label">{page.stat_in_progress_label}</p>
                <p
                  className="projects-page__stat-value"
                  aria-label={page.stat_in_progress_label}
                >
                  {page.stats.in_progress}
                </p>
              </div>
            </div>
          </section>
        </ProfileSectionRail>

        <ProfileSectionRail
          imageSrc={arrow1}
          className="projects-page__rail projects-page__rail--my-projects"
        >
          <div className="projects-page__heading-stack">
            <h2 id="projects-my-projects-heading" className="projects-page__section-title">
              <span className="projects-page__section-title-text">{page.my_projects_title}</span>
            </h2>
            <div className="projects-page__heading-rule" aria-hidden="true" />
          </div>

          <section
            className="projects-page__my-projects-body"
            aria-labelledby="projects-my-projects-heading"
          >
            <CarouselSelector
              items={carouselItems}
              ariaLabel={page.carousel_aria_label}
              prevLabel={page.carousel_prev_label}
              nextLabel={page.carousel_next_label}
            />
          </section>
        </ProfileSectionRail>
      </div>
    </div>
  );
};

export default ProjectsPage;
