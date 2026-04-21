import { useCallback, useId, useState } from "react";
import "./MenuBoxSellection.css";

export type MenuBoxSellectionItem = {
  id: string;
  label: string;
  /** Placeholder até haver imagens reais. */
  sampleColor: string;
};

const DEFAULT_ITEMS: MenuBoxSellectionItem[] = [
  { id: "ex1", label: "Exemplo 1", sampleColor: "var(--green1)" },
  { id: "ex2", label: "Exemplo 2", sampleColor: "var(--orange1)" },
  { id: "ex3", label: "Exemplo 3", sampleColor: "var(--blue1)" },
];

type MenuBoxSellectionProps = {
  items?: MenuBoxSellectionItem[];
  /** Rótulo fixo no topo da coluna (não é aba), estilo cabeçalho tipo Formação. */
  bulletText?: string;
};

/**
 * Abas laterais (cada uma com `glass-surface`) + painel à direita com `glass-surface`.
 */
const MenuBoxSellection: React.FC<MenuBoxSellectionProps> = ({
  items = DEFAULT_ITEMS,
  bulletText = "Experiências",
}) => {
  const baseId = useId();
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? "");

  const active = items.find((item) => item.id === selectedId) ?? items[0];

  const selectTab = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const panelLabelledBy =
    active != null ? `${baseId}-bullet ${baseId}-tab-${active.id}` : `${baseId}-bullet`;

  return (
    <div className="menu-box-sellection">
      <div className="menu-box-sellection__sidebar">
        <div className="menu-box-sellection__bullet glass-surface">
          <h2 id={`${baseId}-bullet`} className="menu-box-sellection__bullet-title">
            {bulletText}
          </h2>
        </div>
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
                className={`menu-box-sellection__tab glass-surface${selected ? " menu-box-sellection__tab--selected" : ""}`}
                onClick={() => selectTab(item.id)}
              >
                <span
                  className="menu-box-sellection__tab-icon"
                  style={{ background: item.sampleColor }}
                  aria-hidden
                />
                <span className="menu-box-sellection__tab-label">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <section
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={panelLabelledBy}
        className="menu-box-sellection__panel glass-surface"
      >
        <h2 className="menu-box-sellection__panel-title">{active?.label}</h2>
        <div className="menu-box-sellection__panel-rule" aria-hidden />
        <div className="menu-box-sellection__panel-body">
          <p className="menu-box-sellection__panel-placeholder">
            Conteúdo associado a <strong>{active?.label}</strong>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default MenuBoxSellection;
