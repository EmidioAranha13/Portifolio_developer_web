import { useLayoutEffect, useRef, type ReactNode } from "react";
import "./TreeRail.css";

export type TreeRailSide = "left" | "right";

export type TreeRailEntry = {
  id: string;
  kind: "root" | "knot";
  label: string;
  side?: TreeRailSide;
  leafTitle?: string;
  leafSubtitle?: string;
};

type TreeRailProps = {
  entries: TreeRailEntry[];
  /** Título (ex.: Formação) — o rail liga-se visualmente a este bloco e mede o topo do spine. */
  heading?: ReactNode;
};

function updateSpineVars(
  rail: HTMLElement,
  headingEl: HTMLElement | null,
  lastNodeEl: HTMLElement | null
) {
  const railRect = rail.getBoundingClientRect();
  let topPx = 0;
  if (headingEl) {
    const h = headingEl.getBoundingClientRect();
    topPx = Math.max(0, h.bottom - railRect.top - 2);
  }

  let bottomPx = 0;
  if (lastNodeEl) {
    const n = lastNodeEl.getBoundingClientRect();
    const centerY = n.top + n.height / 2;
    bottomPx = Math.max(0, railRect.bottom - centerY);
  }

  rail.style.setProperty("--tree-spine-top", `${topPx}px`);
  rail.style.setProperty("--tree-spine-bottom", `${bottomPx}px`);
}

/**
 * Rail vertical com roots e knots; knots podem abrir branch para folhas laterais.
 */
const TreeRail: React.FC<TreeRailProps> = ({ entries, heading }) => {
  const railRef = useRef<HTMLElement>(null);
  const headingWrapRef = useRef<HTMLDivElement>(null);
  const lastNodeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail || typeof ResizeObserver === "undefined") return;

    const measure = () => {
      updateSpineVars(rail, headingWrapRef.current, lastNodeRef.current);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(rail);
    if (headingWrapRef.current) ro.observe(headingWrapRef.current);
    if (lastNodeRef.current) ro.observe(lastNodeRef.current);

    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [entries, heading]);

  return (
    <section ref={railRef} className="tree-rail" aria-label="Linha do tempo de formação">
      <div className="tree-rail__spine" aria-hidden="true" />

      {heading ? (
        <div ref={headingWrapRef} className="tree-rail__heading">
          {heading}
        </div>
      ) : null}

      {entries.map((entry, index) => {
        const isLast = index === entries.length - 1;
        const hasLeaf = entry.kind === "knot" && entry.side && entry.leafTitle;
        const branchClass = hasLeaf ? `tree-rail__node--branch-${entry.side}` : "";

        return (
          <div key={entry.id} className={`tree-rail__row tree-rail__row--${entry.kind}`}>
            <div className="tree-rail__side tree-rail__side--left">
              {hasLeaf && entry.side === "left" ? (
                <div className="tree-rail__leaf-shell tree-rail__leaf-shell--left">
                  <article className="tree-rail__leaf-card glass-surface">
                    <h3 className="tree-rail__leaf-title">{entry.leafTitle}</h3>
                    {entry.leafSubtitle ? (
                      <p className="tree-rail__leaf-subtitle">{entry.leafSubtitle}</p>
                    ) : null}
                  </article>
                </div>
              ) : null}
            </div>

            <div
              ref={isLast ? lastNodeRef : undefined}
              className={`tree-rail__node tree-rail__node--${entry.kind} ${branchClass}`.trim()}
            >
              {entry.label}
            </div>

            <div className="tree-rail__side tree-rail__side--right">
              {hasLeaf && entry.side === "right" ? (
                <div className="tree-rail__leaf-shell tree-rail__leaf-shell--right">
                  <article className="tree-rail__leaf-card glass-surface">
                    <h3 className="tree-rail__leaf-title">{entry.leafTitle}</h3>
                    {entry.leafSubtitle ? (
                      <p className="tree-rail__leaf-subtitle">{entry.leafSubtitle}</p>
                    ) : null}
                  </article>
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default TreeRail;
