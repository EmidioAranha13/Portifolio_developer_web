import { useCallback, useId, useState } from "react";
import CarouselPhoto from "../CarouselPhoto/CarouselPhoto";
import type { MenuBoxSellectionItem } from "../../utils/Types";
import "./MenuBoxSellection.css";

export type { MenuBoxSellectionItem };

const DEFAULT_ITEMS: MenuBoxSellectionItem[] = [
  {
    id: "ex1",
    label: "Exemplo 1",
    role: "Cargo exemplo",
    time_working: "Período exemplo",
    photos: [],
    actions: [],
    projects: [
      { project: "Projeto exemplo", resume: "Resumo exemplo", tasks_executed: "Funções no projeto" },
    ],
  },
  {
    id: "ex2",
    label: "Exemplo 2",
    role: "Cargo exemplo",
    time_working: "Período exemplo",
    photos: [],
    actions: [],
    projects: [
      { project: "Projeto exemplo", resume: "Resumo exemplo", tasks_executed: "Funções no projeto" },
    ],
  },
  {
    id: "ex3",
    label: "Exemplo 3",
    role: "Cargo exemplo",
    time_working: "Período exemplo",
    photos: [],
    actions: [],
    projects: [
      { project: "Projeto exemplo", resume: "Resumo exemplo", tasks_executed: "Funções no projeto" },
    ],
  },
];

type MenuBoxSellectionProps = {
  items?: MenuBoxSellectionItem[];
  roleTitle?: string;
  actionsTitle?: string;
  projectsTitle?: string;
};

/**
 * Abas laterais (cada uma com `glass-surface`) + painel à direita com `glass-surface`.
 */
const MenuBoxSellection: React.FC<MenuBoxSellectionProps> = ({
  items = DEFAULT_ITEMS,
  roleTitle = "Cargo",
  actionsTitle = "Atribuições",
  projectsTitle = "Projetos Relevantes",
}) => {
  const baseId = useId();
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? "");

  const active = items.find((item) => item.id === selectedId) ?? items[0];

  const selectTab = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const activeActions = active?.actions ?? [];
  const activeProjects = active?.projects ?? [];

  const formatAction = (text: string, isLast: boolean): string => {
    const base = text.trim().replace(/[.;]+$/g, "");
    return `${base}${isLast ? "." : ";"}`;
  };

  return (
    <div className="menu-box-sellection">
      <div className="menu-box-sellection__sidebar">
        <nav className="menu-box-sellection__list" role="tablist" aria-label="Seleção de conteúdo">
          {items.map((item) => {
            const selected = item.id === selectedId;
            return (
              <button
                key={item.id}
                id={`${baseId}-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                aria-label={item.label}
                className={`menu-box-sellection__tab glass-surface${selected ? " menu-box-sellection__tab--selected" : ""}`}
                onClick={() => selectTab(item.id)}
              >
                <span className="menu-box-sellection__tab-icon" aria-hidden>
                  {item.imageSrc ? (
                    <img
                      className="menu-box-sellection__tab-icon-image"
                      src={item.imageSrc}
                      alt=""
                    />
                  ) : null}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <section
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={active ? `${baseId}-tab-${active.id}` : undefined}
        className="menu-box-sellection__panel glass-surface"
      >
        <h2 className="menu-box-sellection__panel-title">
          <span className="menu-box-sellection__panel-title-text">{active?.label}</span>
        </h2>
        <div className="menu-box-sellection__panel-rule" aria-hidden />
        <div className="menu-box-sellection__panel-body">
          <p className="menu-box-sellection__panel-role">
            <strong>{roleTitle}: </strong>
            {active?.role}
          </p>
          <p className="menu-box-sellection__panel-time-working">{active?.time_working}</p>
          <CarouselPhoto photos={active?.photos ?? []} />

          <div className="menu-box-sellection__panel-group">
            <p className="menu-box-sellection__panel-group-title">{actionsTitle}:</p>
            <ul className="menu-box-sellection__panel-actions">
              {activeActions.map((action, index) => (
                <li key={`${active?.id}-action-${index}`} className="menu-box-sellection__panel-action-item">
                  <span className="menu-box-sellection__panel-action-dot" aria-hidden>
                    •
                  </span>
                  <span>{formatAction(action, index === activeActions.length - 1)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="menu-box-sellection__panel-group">
            <p className="menu-box-sellection__panel-group-title menu-box-sellection__panel-group-title--projects">
              {projectsTitle}:
            </p>
            <div className="menu-box-sellection__panel-projects">
              {activeProjects.map((project, index) => (
                <div key={`${active?.id}-project-${index}`} className="menu-box-sellection__panel-project-item">
                  <p className="menu-box-sellection__panel-project-index">({index + 1})</p>
                  <div className="menu-box-sellection__panel-project-content">
                    <p className="menu-box-sellection__panel-project-name">{project.project}</p>
                    <p className="menu-box-sellection__panel-project-resume">{project.resume}</p>
                    <p className="menu-box-sellection__panel-project-tasks">
                      <strong>Responsabilidade: </strong>
                      {project.tasks_executed}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MenuBoxSellection;
