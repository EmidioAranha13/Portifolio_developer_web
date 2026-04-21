import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { TreeRailEntry, TreeRailLeafLine, TreeRailProps, TreeRailSide } from "../../utils/Types";
import "./TreeRail.css";

export type { TreeRailEntry, TreeRailLeafLine, TreeRailSide };

function getScrollParent(el: HTMLElement | null): HTMLElement | null {
  if (!el) return null;
  let node: HTMLElement | null = el.parentElement;
  while (node) {
    const { overflowY } = window.getComputedStyle(node);
    if (overflowY === "auto" || overflowY === "scroll") return node;
    node = node.parentElement;
  }
  return null;
}

function TreeRailLeafCard({ leafTitle, leafBody }: { leafTitle?: string; leafBody: TreeRailLeafLine[] }) {
  const title = leafTitle?.trim() ?? "";
  const body = leafBody;

  return (
    <div className="tree-rail__leaf-card glass-surface">
      {title ? (
        <>
          <h3 className="tree-rail__leaf-title">{title}</h3>
          {body.length > 0 ? (
            <>
              <div className="tree-rail__leaf-divider" aria-hidden="true" />
              <div className="tree-rail__leaf-body">
                {body.map((line, i) => (
                  <p key={i} className="tree-rail__leaf-subtitle">
                    <strong className="tree-rail__leaf-field-label">{line.label}</strong>{" "}
                    <span>{line.value}</span>
                  </p>
                ))}
              </div>
            </>
          ) : null}
        </>
      ) : body.length > 0 ? (
        <div className="tree-rail__leaf-body">
          {body.map((line, i) => (
            <p key={i} className="tree-rail__leaf-subtitle">
              <strong className="tree-rail__leaf-field-label">{line.label}</strong>{" "}
              <span>{line.value}</span>
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

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
  const [introActive, setIntroActive] = useState(false);
  const [exitTransitionsReady, setExitTransitionsReady] = useState(false);
  const [motionReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    setExitTransitionsReady(false);
  }, [entries]);

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

  useEffect(() => {
    if (motionReduced) {
      setIntroActive(true);
      return;
    }
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setIntroActive(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [motionReduced]);

  useEffect(() => {
    if (!introActive) return;
    const rail = railRef.current;
    if (!rail) return;

    if (motionReduced) {
      rail.querySelectorAll(".tree-rail__row").forEach((row) => {
        row.classList.add("tree-rail__row--visible");
      });
      return;
    }

    const scrollRoot = getScrollParent(rail);
    const rows = [...rail.querySelectorAll(".tree-rail__row")] as HTMLElement[];

    const observer = new IntersectionObserver(
      (observed) => {
        for (const entry of observed) {
          const row = entry.target as HTMLElement;
          const idx = Number(row.dataset.rowIndex ?? 0);

          if (!entry.isIntersecting) {
            if (!row.classList.contains("tree-rail__row--visible")) continue;
            const hideDelayMs = Math.min(idx, 10) * 42;
            row.style.setProperty("--row-hide-delay", `${hideDelayMs}ms`);
            row.classList.remove("tree-rail__row--visible");
            continue;
          }

          if (row.classList.contains("tree-rail__row--visible")) continue;
          const delayMs = Math.min(idx, 10) * 60;
          row.style.removeProperty("--row-hide-delay");
          row.style.setProperty("--row-reveal-delay", `${delayMs}ms`);
          row.classList.add("tree-rail__row--visible");
          setExitTransitionsReady(true);
        }
      },
      {
        root: scrollRoot,
        rootMargin: "10% 0px 12% 0px",
        threshold: 0.06,
      }
    );

    rows.forEach((row, i) => {
      row.dataset.rowIndex = String(i);
      observer.observe(row);
    });

    return () => observer.disconnect();
  }, [introActive, entries, motionReduced]);

  const sectionClass = [
    "tree-rail",
    motionReduced ? "tree-rail--motion-off" : "",
    introActive ? "tree-rail--intro-active" : "",
    exitTransitionsReady ? "tree-rail--exit-ready" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section ref={railRef} className={sectionClass} aria-label="Linha do tempo de formação">
      <div className="tree-rail__spine" aria-hidden="true" />

      {heading ? (
        <div ref={headingWrapRef} className="tree-rail__heading">
          {heading}
        </div>
      ) : null}

      {entries.map((entry, index) => {
        const isLast = index === entries.length - 1;
        const body = entry.leafBody ?? [];
        const hasLeaf =
          entry.kind === "knot" &&
          entry.side &&
          (Boolean(entry.leafTitle?.trim()) || body.length > 0);
        const branchClass = hasLeaf ? `tree-rail__node--branch-${entry.side}` : "";

        return (
          <div key={entry.id} className={`tree-rail__row tree-rail__row--${entry.kind}`}>
            <div className="tree-rail__side tree-rail__side--left">
              {hasLeaf && entry.side === "left" ? (
                <div className="tree-rail__leaf-shell tree-rail__leaf-shell--left">
                  <TreeRailLeafCard leafTitle={entry.leafTitle} leafBody={body} />
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
                  <TreeRailLeafCard leafTitle={entry.leafTitle} leafBody={body} />
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
