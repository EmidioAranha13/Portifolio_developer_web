import { useId, useRef, type CSSProperties } from "react";
import ArrowBoxScrollRail from "../ArrowBox/ArrowBoxScrollRail";
import CustomBulletButton from "../CustomBulletButton/CustomBulletButton";
import closeIcon from "../../assets/error1.png";
import type { ProjectWithImage, SkillPageSkill } from "../../utils/Types";
import { getTechTagStyle } from "../../utils/projectTechTagStyles";
import { PROJECT_DEFAULT_IMAGE } from "../../utils/projectAssets";
import { ModalShell } from "./ModalShell";
import "./ProjectAboutModal.css";

export type ProjectAboutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectWithImage;
  closeLabel: string;
  screensLabel: string;
  githubLabel: string;
  liveLabel: string;
  technologiesLabel: string;
  /** Habilidades da página Skills (mesmo idioma) para cores das tags. */
  skillsCatalog: readonly SkillPageSkill[];
};

const resolveScreenSrc = (screen: ProjectWithImage["screens"][number]): string =>
  screen.src ?? PROJECT_DEFAULT_IMAGE;

const hasProjectLink = (url: string): boolean => url.trim().length > 0;

/**
 * Modal do projeto: cabeçalho (`cabeçalho.*`), tags, descrição e galeria de telas.
 */
const ProjectAboutModal: React.FC<ProjectAboutModalProps> = ({
  isOpen,
  onClose,
  project,
  closeLabel,
  screensLabel,
  githubLabel,
  liveLabel,
  technologiesLabel,
  skillsCatalog,
}) => {
  const titleId = useId();
  const scrollRef = useRef<HTMLDivElement>(null);
  const headerSrc = project.headerImageSrc;
  const showGithub = hasProjectLink(project.project_github_link);
  const showTest = hasProjectLink(project.project_test_link);
  const closeIconStyle = {
    "--project-about-close-icon": `url("${closeIcon}")`,
  } as CSSProperties;

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      titleId={titleId}
      title={project.title}
      closeLabel={closeLabel}
      panelLayout="content"
      variant="success"
      showFooter={false}
      allowDismiss
      panelClassName="project-about-modal"
      panelStyle={
        project.color
          ? ({ "--project-about-accent": project.color } as React.CSSProperties)
          : undefined
      }
      titleTrailing={
        <button
          type="button"
          className="project-about-modal__close"
          style={closeIconStyle}
          onClick={onClose}
          aria-label={closeLabel}
        >
          <span className="project-about-modal__close-icon" aria-hidden="true" />
        </button>
      }
      layoutWrapClassName="project-about-modal__frame"
      layoutAside={
        isOpen ? (
          <div className="project-about-modal__rail-slot">
            <ArrowBoxScrollRail
              scrollRootRef={scrollRef}
              contentSyncKey={project.title}
              placement="local"
            />
          </div>
        ) : null
      }
    >
      <div className="project-about-modal__scroll-host">
        <div ref={scrollRef} className="project-about-modal__scroll styled-scrollbars">
          <div className="project-about-modal__scroll-inner">
            <header className="project-about-modal__header">
              {headerSrc ? (
                <img
                  className="project-about-modal__header-image"
                  src={headerSrc}
                  alt=""
                  decoding="async"
                />
              ) : null}
              {showGithub || showTest ? (
                <div className="project-about-modal__header-actions">
                  {showGithub ? (
                    <CustomBulletButton
                      label={githubLabel}
                      variant="outline"
                      icon="githubRound"
                      href={project.project_github_link.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ) : null}
                  {showTest ? (
                    <CustomBulletButton
                      label={liveLabel}
                      variant="outline"
                      icon="live"
                      href={project.project_test_link.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ) : null}
                </div>
              ) : null}
              <div className="project-about-modal__header-border" aria-hidden="true" />
            </header>

            <div className="project-about-modal__inner">
          {project.technologies.length > 0 ? (
            <div className="project-about-modal__tech-row">
              <span className="project-about-modal__tech-label">{technologiesLabel}</span>
              <div
                className="project-about-modal__tech-tags"
                role="list"
                aria-label={technologiesLabel}
              >
              {project.technologies.map((tech) => {
                const tagStyle = getTechTagStyle(tech, skillsCatalog);
                const hasSkillColors = Object.keys(tagStyle).length > 0;
                return (
                  <span
                    key={tech}
                    className={`project-about-modal__tech-tag${
                      hasSkillColors ? " project-about-modal__tech-tag--skill" : ""
                    }`}
                    style={tagStyle}
                    role="listitem"
                  >
                    {tech}
                  </span>
                );
              })}
              </div>
            </div>
          ) : null}

          <div className="project-about-modal__description">
            {project.paragraphs.map((paragraph, index) => (
              <p key={index} className="project-about-modal__paragraph">
                {paragraph}
              </p>
            ))}
          </div>

          <section
            className="project-about-modal__screens"
            aria-labelledby={`${titleId}-screens`}
          >
            <div className="project-about-modal__section-heading">
              <h3 id={`${titleId}-screens`} className="project-about-modal__section-title">
                <span className="project-about-modal__section-title-text">{screensLabel}</span>
              </h3>
              <div className="project-about-modal__section-rule" aria-hidden="true" />
            </div>
            <div className="project-about-modal__screens-grid">
              {project.screens.map((screen, index) => (
                <figure key={index} className="project-about-modal__screen-card">
                  <img
                    className="project-about-modal__screen-image"
                    src={resolveScreenSrc(screen)}
                    alt=""
                    decoding="async"
                  />
                </figure>
              ))}
            </div>
            </section>
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
};

export default ProjectAboutModal;
