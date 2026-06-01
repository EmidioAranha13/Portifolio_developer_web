import { GitHubCalendar } from "react-github-calendar";
import "react-github-calendar/tooltips.css";
import type { ThemeMode } from "../../utils/Types";
import type { InfoTexts } from "../../utils/infoTextsCollection";
import "./ProjectsPage.css";

const GITHUB_USERNAME = "EmidioAranha13";
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;

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
 * Página Projetos — heading em pílula + painel com calendário de contribuições GitHub.
 */
const ProjectsPage: React.FC<ProjectsPageProps> = ({ title, themeMode, infoTexts }) => {
  const page = infoTexts.projects_page;
  const colorScheme = themeMode === "day" ? "light" : "dark";

  return (
    <div className="projects-page">
      <div className="projects-page__heading glass-surface">
        <h1 className="projects-page__title">{title}</h1>
      </div>

      <div className="projects-page__content glass-surface">
        <section
          className="projects-page__contributions"
          aria-labelledby="projects-contributions-heading"
        >
          <div className="projects-page__contributions-header">
            <h2 id="projects-contributions-heading" className="projects-page__section-title">
              {page.contributions_title}
            </h2>
            <a
              className="projects-page__github-link"
              href={GITHUB_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {page.github_profile_label}
            </a>
          </div>

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
        </section>

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
            <p className="projects-page__stat-value" aria-label={page.stat_in_progress_label}>
              {page.stats.in_progress}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
