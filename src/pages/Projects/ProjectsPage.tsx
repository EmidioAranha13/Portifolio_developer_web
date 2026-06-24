import { useEffect, useRef, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";
import "react-github-calendar/tooltips.css";
import CarouselSelector from "../../componentes/CarouselSelector/CarouselSelector";
import { ProjectAboutModal } from "../../componentes/modal";
import ProfileSectionRail from "../../componentes/ProfileSectionRail/ProfileSectionRail";
import type { Project, ProjectWithImage, ThemeMode } from "../../utils/Types";
import type { InfoTexts } from "../../utils/infoTextsCollection";
import { enrichProjectWithAssets } from "../../utils/projectAssets";
import arrow1 from "../../assets/arrow-1.png";
import "./ProjectsPage.css";

const GITHUB_USERNAME = "EmidioAranha13";

const CALENDAR_LOADING_ANIMATION = "react-activity-calendar--loading-animation";
const CALENDAR_READY_STABLE_FRAMES = 3;
const PROJECT_CARD_MOBILE_MAX_WIDTH_PX = 640;

const calendarHasLoadingSkeleton = (calendar: Element): boolean => {
  const rects = calendar.querySelectorAll("rect");
  for (const rect of rects) {
    const animationName = getComputedStyle(rect).animationName;
    if (animationName.includes(CALENDAR_LOADING_ANIMATION)) {
      return true;
    }
  }
  return false;
};

const calendarHasContributionSummary = (calendar: Element): boolean => {
  const footer = calendar.querySelector(".react-activity-calendar__footer");
  const text = (footer?.textContent ?? calendar.textContent ?? "").replace(/\s/g, "");
  return text.length > 0 && /\d/.test(text);
};

const isGitHubCalendarReady = (root: HTMLElement, errorMessage: string): boolean => {
  const calendar = root.querySelector(".react-activity-calendar");
  if (!calendar) {
    const text = root.textContent?.trim() ?? "";
    return text.length > 0 && text.includes(errorMessage);
  }

  if (calendarHasLoadingSkeleton(calendar)) return false;

  const calendarText = calendar.textContent?.trim() ?? "";
  if (calendarText.includes(errorMessage)) return true;

  return calendarHasContributionSummary(calendar);
};

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
  const [aboutProjectId, setAboutProjectId] = useState<number | null>(null);
  const [calendarReady, setCalendarReady] = useState(false);
  const [isProjectCardMobile, setIsProjectCardMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(`(max-width: ${PROJECT_CARD_MOBILE_MAX_WIDTH_PX}px)`).matches,
  );
  const calendarWrapRef = useRef<HTMLDivElement>(null);
  const colorScheme = themeMode === "day" ? "light" : "dark";

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${PROJECT_CARD_MOBILE_MAX_WIDTH_PX}px)`);
    const sync = () => setIsProjectCardMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const root = calendarWrapRef.current;
    if (!root) return;

    let cancelled = false;
    let stableReadyFrames = 0;
    let rafId = 0;

    setCalendarReady(false);

    const observer = new MutationObserver(() => {
      evaluateReady();
    });

    const evaluateReady = () => {
      if (cancelled) return;

      if (isGitHubCalendarReady(root, page.contributions_error)) {
        stableReadyFrames += 1;
        if (stableReadyFrames >= CALENDAR_READY_STABLE_FRAMES) {
          setCalendarReady(true);
          observer.disconnect();
          return;
        }
      } else {
        stableReadyFrames = 0;
      }

      rafId = window.requestAnimationFrame(evaluateReady);
    };

    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    rafId = window.requestAnimationFrame(evaluateReady);

    return () => {
      cancelled = true;
      stableReadyFrames = 0;
      observer.disconnect();
      window.cancelAnimationFrame(rafId);
    };
  }, [colorScheme, page.contributions_error]);
  const projectItems: ProjectWithImage[] = page.projects.map((project) =>
    enrichProjectWithAssets(project as Project, isProjectCardMobile ? "mobile" : "web"),
  );
  const aboutProject =
    aboutProjectId != null
      ? (projectItems.find((item) => item.id === aboutProjectId) ?? null)
      : null;

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
            <div
              ref={calendarWrapRef}
              className={`projects-page__calendar-wrap${
                calendarReady ? "" : " projects-page__calendar-wrap--loading"
              }`}
            >
              <GitHubCalendar
                key={colorScheme}
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
              {!calendarReady ? (
                <div
                  className="projects-page__calendar-loading"
                  role="status"
                  aria-live="polite"
                  aria-busy="true"
                  aria-label={page.contributions_calendar_loading_label}
                >
                  <div className="projects-page__calendar-loading-scrim" aria-hidden="true" />
                  <div className="projects-page__calendar-loading-spinner" aria-hidden="true" />
                </div>
              ) : null}
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
              items={projectItems}
              ariaLabel={page.carousel_aria_label}
              prevLabel={page.carousel_prev_label}
              nextLabel={page.carousel_next_label}
              learnMoreLabel={page.carousel_learn_more_label}
              summaryLabel={page.carousel_summary_label}
              onActiveCardOpen={(item) => setAboutProjectId(item.id)}
            />
          </section>
        </ProfileSectionRail>
      </div>

      {aboutProject ? (
        <ProjectAboutModal
          isOpen={aboutProjectId !== null}
          onClose={() => setAboutProjectId(null)}
          project={aboutProject}
          closeLabel={page.project_modal_close_label}
          screensWebLabel={page.project_modal_screens_web_label}
          screensMobileLabel={page.project_modal_screens_mobile_label}
          screensEmptyLabel={page.project_modal_screens_empty_label}
          docsLabel={page.project_modal_docs_label}
          openDocLabel={page.project_modal_open_doc_label}
          screenPrevLabel={page.project_modal_screen_prev_label}
          screenNextLabel={page.project_modal_screen_next_label}
          githubLabel={page.project_modal_github_label}
          liveLabel={page.project_modal_live_label}
          technologiesLabel={page.project_modal_technologies_label}
          skillsCatalog={infoTexts.skill_page.skills}
        />
      ) : null}
    </div>
  );
};

export default ProjectsPage;
