import {

  useCallback,

  useEffect,

  useId,

  useMemo,

  useRef,

  useState,

  type CSSProperties,

  type TransitionEvent,

} from "react";

import ArrowBoxScrollRail from "../ArrowBox/ArrowBoxScrollRail";

import CardBox from "../CardBox/CardBox";

import CustomBulletButton from "../CustomBulletButton/CustomBulletButton";

import TabSlider from "../TabSlider/TabSlider";

import arrowDown from "../../assets/arrow-down.png";

import closeIcon from "../../assets/error1.png";

import type {
  ProjectDocItem,
  ProjectScreenItem,
  ProjectScreenshotPlatform,
  ProjectWithImage,
  SkillPageSkill,
} from "../../utils/Types";

import { getTechTagStyle } from "../../utils/projectTechTagStyles";

import { PROJECT_DEFAULT_IMAGE } from "../../utils/projectAssets";

import { ModalShell } from "./ModalShell";

import "./ProjectAboutModal.css";



export type ProjectAboutModalProps = {

  isOpen: boolean;

  onClose: () => void;

  project: ProjectWithImage;

  closeLabel: string;

  screensWebLabel: string;

  screensMobileLabel: string;

  screensEmptyLabel: string;

  docsLabel: string;

  openDocLabel: string;

  screenPrevLabel: string;

  screenNextLabel: string;

  githubLabel: string;

  liveLabel: string;

  technologiesLabel: string;

  /** Habilidades da página Skills (mesmo idioma) para cores das tags. */

  skillsCatalog: readonly SkillPageSkill[];

};



const resolveScreenSrc = (screen: ProjectScreenItem): string =>

  screen.src ?? PROJECT_DEFAULT_IMAGE;



const hasProjectLink = (url: string): boolean => url.trim().length > 0;



const buildLoopScreens = (screens: readonly ProjectScreenItem[]): ProjectScreenItem[] => {
  if (screens.length <= 1) return [...screens];
  return [screens[screens.length - 1], ...screens, screens[0]];
};

const toRealScreenIndex = (trackIndex: number, screenCount: number): number => {
  if (screenCount <= 1) return 0;
  if (trackIndex === 0) return screenCount - 1;
  if (trackIndex === screenCount + 1) return 0;
  return trackIndex - 1;
};

type MobileDeviceFrameProps = {
  caseSrc: string;
  screen: ProjectScreenItem;
};

const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({ caseSrc, screen }) => (
  <div className="project-about-modal__mobile-device">
    <img
      className="project-about-modal__mobile-device-screen"
      src={resolveScreenSrc(screen)}
      alt=""
      decoding="async"
    />
    <img
      className="project-about-modal__mobile-device-case"
      src={caseSrc}
      alt=""
      aria-hidden
      decoding="async"
    />
  </div>
);



type ProjectModalTab =
  | {
      type: "screens";
      platform: ProjectScreenshotPlatform;
      label: string;
      screens: readonly ProjectScreenItem[];
    }
  | {
      type: "docs";
      label: string;
      docs: readonly ProjectDocItem[];
    };

type ProjectDocsGridProps = {
  docs: readonly ProjectDocItem[];
  openDocLabel: string;
};

const ProjectDocsGrid: React.FC<ProjectDocsGridProps> = ({ docs, openDocLabel }) => (
  <div className="project-about-modal__docs-grid" role="list">
    {docs.map((doc) => (
      <a
        key={doc.src}
        className="project-about-modal__doc-card-link"
        href={doc.src}
        target="_blank"
        rel="noopener noreferrer"
        role="listitem"
        aria-label={`${openDocLabel}: ${doc.title}`}
      >
        <CardBox className="project-about-modal__doc-card">
          <p className="project-about-modal__doc-card-title">{doc.title}</p>
          <div className="project-about-modal__doc-preview-wrapper" aria-hidden="true">
            {doc.previewSrc ? (
              <img src={doc.previewSrc} alt="" className="project-about-modal__doc-preview" />
            ) : (
              <div
                className={`project-about-modal__doc-preview-fallback project-about-modal__doc-preview-fallback--${doc.kind}`}
              >
                <span>{doc.kind === "pdf" ? "PDF" : "Slides"}</span>
              </div>
            )}
          </div>
        </CardBox>
      </a>
    ))}
  </div>
);



type ProjectScreenCarouselProps = {

  screens: readonly ProjectScreenItem[];

  carouselLabel: string;

  screenPrevLabel: string;

  screenNextLabel: string;

  caseSrc?: string;

};



const ProjectScreenCarousel: React.FC<ProjectScreenCarouselProps> = ({

  screens,

  carouselLabel,

  screenPrevLabel,

  screenNextLabel,

  caseSrc,

}) => {

  const screenTrackRef = useRef<HTMLDivElement>(null);

  const screenLoopResetRef = useRef(false);

  const trackIndexRef = useRef(0);

  const [trackIndex, setTrackIndex] = useState(0);

  const [screenSlideAnimated, setScreenSlideAnimated] = useState(true);

  const screenCount = screens.length;

  const loopScreens = useMemo(() => buildLoopScreens(screens), [screens]);

  const loopTrackCount = screenCount > 1 ? screenCount + 2 : screenCount;

  const activeScreenIndex = toRealScreenIndex(trackIndex, screenCount);



  trackIndexRef.current = trackIndex;



  const resetLoopTrack = useCallback((targetIndex: number) => {

    screenLoopResetRef.current = true;

    setScreenSlideAnimated(false);

    setTrackIndex(targetIndex);

    window.requestAnimationFrame(() => {

      window.requestAnimationFrame(() => {

        setScreenSlideAnimated(true);

        screenLoopResetRef.current = false;

      });

    });

  }, []);



  useEffect(() => {

    screenLoopResetRef.current = false;

    setScreenSlideAnimated(false);

    setTrackIndex(screenCount > 1 ? 1 : 0);

    const frameId = window.requestAnimationFrame(() => {

      setScreenSlideAnimated(true);

    });

    return () => window.cancelAnimationFrame(frameId);

  }, [screens, screenCount]);



  const goToPrevScreen = useCallback(() => {

    if (screenCount <= 1 || screenLoopResetRef.current) return;

    setScreenSlideAnimated(true);

    setTrackIndex((current) => current - 1);

  }, [screenCount]);



  const goToNextScreen = useCallback(() => {

    if (screenCount <= 1 || screenLoopResetRef.current) return;

    setScreenSlideAnimated(true);

    setTrackIndex((current) => current + 1);

  }, [screenCount]);



  const handleScreenTrackTransitionEnd = useCallback(

    (event: TransitionEvent<HTMLDivElement>) => {

      if (event.propertyName !== "transform") return;

      if (event.target !== screenTrackRef.current) return;

      if (screenCount <= 1) return;



      const current = trackIndexRef.current;

      if (current === screenCount + 1) {

        resetLoopTrack(1);

        return;

      }



      if (current === 0) {

        resetLoopTrack(screenCount);

      }

    },

    [resetLoopTrack, screenCount],

  );



  useEffect(() => {

    if (screenCount <= 1) return;

    if (trackIndex !== 0 && trackIndex !== screenCount + 1) return;

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;



    resetLoopTrack(trackIndex === 0 ? screenCount : 1);

  }, [resetLoopTrack, screenCount, trackIndex]);



  if (screenCount === 0) return null;



  return (

    <div className="project-about-modal__screens-carousel" aria-roledescription="carousel">

      {screenCount > 1 ? (

        <button

          type="button"

          className="project-about-modal__screen-nav project-about-modal__screen-nav--prev"

          onClick={goToPrevScreen}

          aria-label={screenPrevLabel}

        >

          <img

            className="project-about-modal__screen-nav-icon project-about-modal__screen-nav-icon--prev"

            src={arrowDown}

            alt=""

            aria-hidden

            decoding="async"

          />

        </button>

      ) : null}



      <div

        className="project-about-modal__screen-viewport"

        aria-live="polite"

        aria-label={`${carouselLabel} ${activeScreenIndex + 1} / ${screenCount}`}

      >

        <div

          ref={screenTrackRef}

          className={`project-about-modal__screen-track${

            screenSlideAnimated ? " project-about-modal__screen-track--animated" : ""

          }`}

          style={

            {

              "--screen-count": loopTrackCount,

              transform: `translateX(calc(-100% * ${trackIndex} / ${loopTrackCount}))`,

            } as CSSProperties

          }

          onTransitionEnd={handleScreenTrackTransitionEnd}

        >

          {loopScreens.map((screen, index) => (

            <figure

              key={`screen-loop-${index}`}

              className={`project-about-modal__screen-slide${

                caseSrc ? " project-about-modal__screen-slide--mobile" : ""

              }`}

              aria-hidden={index !== trackIndex}

            >

              {caseSrc ? (

                <MobileDeviceFrame caseSrc={caseSrc} screen={screen} />

              ) : (

                <img

                  className="project-about-modal__screen-image"

                  src={resolveScreenSrc(screen)}

                  alt=""

                  decoding="async"

                />

              )}

            </figure>

          ))}

        </div>

      </div>



      {screenCount > 1 ? (

        <button

          type="button"

          className="project-about-modal__screen-nav project-about-modal__screen-nav--next"

          onClick={goToNextScreen}

          aria-label={screenNextLabel}

        >

          <img

            className="project-about-modal__screen-nav-icon project-about-modal__screen-nav-icon--next"

            src={arrowDown}

            alt=""

            aria-hidden

            decoding="async"

          />

        </button>

      ) : null}

    </div>

  );

};



/**

 * Modal do projeto: cabeçalho (`cabeçalho.*`), tags, descrição e galeria de telas.

 */

const ProjectAboutModal: React.FC<ProjectAboutModalProps> = ({

  isOpen,

  onClose,

  project,

  closeLabel,

  screensWebLabel,

  screensMobileLabel,

  screensEmptyLabel,

  docsLabel,

  openDocLabel,

  screenPrevLabel,

  screenNextLabel,

  githubLabel,

  liveLabel,

  technologiesLabel,

  skillsCatalog,

}) => {

  const titleId = useId();

  const scrollRef = useRef<HTMLDivElement>(null);

  const [activeModalTabIndex, setActiveModalTabIndex] = useState(0);



  const modalTabs = useMemo((): ProjectModalTab[] => {
    const tabs: ProjectModalTab[] = [];

    for (const platform of project.screens) {
      if (platform === "docs") {
        tabs.push({
          type: "docs",
          label: docsLabel,
          docs: project.docAssets,
        });
        continue;
      }

      tabs.push({
        type: "screens",
        platform,
        label: platform === "web" ? screensWebLabel : screensMobileLabel,
        screens: project.screenAssets[platform],
      });
    }

    return tabs;
  }, [
    docsLabel,
    project.docAssets,
    project.screenAssets,
    project.screens,
    screensMobileLabel,
    screensWebLabel,
  ]);



  const activeModalTab = modalTabs[activeModalTabIndex] ?? modalTabs[0];



  useEffect(() => {

    setActiveModalTabIndex(0);

  }, [project.id]);



  useEffect(() => {

    if (activeModalTabIndex >= modalTabs.length) {

      setActiveModalTabIndex(0);

    }

  }, [activeModalTabIndex, modalTabs.length]);



  const showGithub = hasProjectLink(project.project_github_link);

  const showTest = hasProjectLink(project.project_test_link);

  const closeIconStyle = {

    "--project-about-close-icon": `url("${closeIcon}")`,

  } as CSSProperties;

  const headerSrc = project.headerImageSrc;



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



              {modalTabs.length > 0 ? (

                <section

                  className="project-about-modal__screens"

                  aria-labelledby={`${titleId}-screens`}

                >

                  <div className="project-about-modal__section-heading" id={`${titleId}-screens`}>

                    <TabSlider

                      tabs={modalTabs.map((tab) => tab.label)}

                      activeIndex={activeModalTabIndex}

                      onChange={setActiveModalTabIndex}

                    />

                  </div>

                  <div className="project-about-modal__screens-panel">
                    {activeModalTab?.type === "screens" ? (
                      activeModalTab.screens.length > 0 ? (
                        <ProjectScreenCarousel
                          key={`${project.id}-${activeModalTab.platform}`}
                          screens={activeModalTab.screens}
                          carouselLabel={activeModalTab.label}
                          screenPrevLabel={screenPrevLabel}
                          screenNextLabel={screenNextLabel}
                          caseSrc={
                            activeModalTab.platform === "mobile"
                              ? project.mobileCaseSrc
                              : undefined
                          }
                        />
                      ) : (
                        <p className="project-about-modal__screens-empty">{screensEmptyLabel}</p>
                      )
                    ) : activeModalTab?.type === "docs" ? (
                      activeModalTab.docs.length > 0 ? (
                        <ProjectDocsGrid
                          docs={activeModalTab.docs}
                          openDocLabel={openDocLabel}
                        />
                      ) : (
                        <p className="project-about-modal__screens-empty">{screensEmptyLabel}</p>
                      )
                    ) : null}
                  </div>

                </section>

              ) : null}

            </div>

          </div>

        </div>

      </div>

    </ModalShell>

  );

};



export default ProjectAboutModal;


