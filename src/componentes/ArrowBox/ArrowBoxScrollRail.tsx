import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import ArrowBox from "./ArrowBox";
import type { ArrowBoxScrollRailProps, ScrollbarThumbPhase } from "../../utils/Types";
import "./ArrowBoxScrollRail.css";

const MIN_THUMB_PX = 80;
const MIN_WIDTH_PX = 861;

function initialUseArrowsBar(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia(`(min-width: ${MIN_WIDTH_PX}px)`).matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Barra de scroll customizada: o “thumb” reutiliza o visual do
 * {@link ArrowBox} em orientação vertical.
 * Ativo em viewport ≥861px e sem `prefers-reduced-motion`.
 * Monta com a shell principal (incl. durante o loader) para não haver troca de scrollbar.
 */
export default function ArrowBoxScrollRail({
  scrollRootRef,
  contentSyncKey,
}: ArrowBoxScrollRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [useArrowsBar, setUseArrowsBar] = useState(initialUseArrowsBar);
  const [railVisible, setRailVisible] = useState(false);
  const [scrollPhase, setScrollPhase] = useState<ScrollbarThumbPhase>("top");
  const canScrollRef = useRef(false);
  const dragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartScroll = useRef(0);

  useLayoutEffect(() => {
    const mqW = window.matchMedia(`(min-width: ${MIN_WIDTH_PX}px)`);
    const mqR = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setUseArrowsBar(mqW.matches && !mqR.matches);
    sync();
    mqW.addEventListener("change", sync);
    mqR.addEventListener("change", sync);
    return () => {
      mqW.removeEventListener("change", sync);
      mqR.removeEventListener("change", sync);
    };
  }, []);

  const syncThumbAndChrome = useCallback(() => {
    const root = scrollRootRef.current;
    const rail = railRef.current;
    const thumb = thumbRef.current;
    if (!root) return;

    const { scrollTop, scrollHeight, clientHeight } = root;
    const maxScroll = Math.max(0, scrollHeight - clientHeight);
    const canScroll = maxScroll > 2;
    canScrollRef.current = canScroll;
    setRailVisible(canScroll);

    if (!canScroll) {
      setScrollPhase((p) => (p === "top" ? p : "top"));
    } else {
      const edge = Math.min(56, Math.max(8, maxScroll * 0.035));
      let next: ScrollbarThumbPhase = "middle";
      if (scrollTop <= edge) next = "top";
      else if (scrollTop >= maxScroll - edge) next = "bottom";
      setScrollPhase((p) => (p === next ? p : next));
    }

    if (!rail || !thumb || !canScroll) {
      if (thumb) {
        thumb.style.setProperty("--thumb-h", "0px");
        thumb.style.setProperty("--thumb-top", "0px");
      }
      return;
    }

    const trackH = rail.clientHeight;
    const thumbH = Math.max(
      MIN_THUMB_PX,
      Math.min(trackH * 0.82, (clientHeight / scrollHeight) * trackH)
    );
    const travel = Math.max(0, trackH - thumbH);
    const top = travel > 0 ? (scrollTop / maxScroll) * travel : 0;

    thumb.style.setProperty("--thumb-h", `${thumbH}px`);
    thumb.style.setProperty("--thumb-top", `${top}px`);
  }, [scrollRootRef]);

  useLayoutEffect(() => {
    if (!useArrowsBar) return;
    const root = scrollRootRef.current;
    if (!root) return;

    syncThumbAndChrome();
    root.addEventListener("scroll", syncThumbAndChrome, { passive: true });
    const roRoot = new ResizeObserver(syncThumbAndChrome);
    roRoot.observe(root);
    const contentEl = root.querySelector(".content");
    const roContent =
      contentEl instanceof HTMLElement ? new ResizeObserver(syncThumbAndChrome) : null;
    if (contentEl instanceof HTMLElement && roContent) roContent.observe(contentEl);

    const rail = railRef.current;
    const roRail = rail ? new ResizeObserver(syncThumbAndChrome) : null;
    if (rail && roRail) roRail.observe(rail);

    window.addEventListener("resize", syncThumbAndChrome);

    return () => {
      root.removeEventListener("scroll", syncThumbAndChrome);
      roRoot.disconnect();
      roContent?.disconnect();
      roRail?.disconnect();
      window.removeEventListener("resize", syncThumbAndChrome);
    };
  }, [useArrowsBar, scrollRootRef, syncThumbAndChrome]);

  useEffect(() => {
    if (!useArrowsBar) return;
    let raf2 = 0;
    let raf3 = 0;
    const raf1 = requestAnimationFrame(() => {
      syncThumbAndChrome();
      raf2 = requestAnimationFrame(() => {
        syncThumbAndChrome();
        raf3 = requestAnimationFrame(() => syncThumbAndChrome());
      });
    });
    const t = window.setTimeout(() => syncThumbAndChrome(), 120);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      cancelAnimationFrame(raf3);
      window.clearTimeout(t);
    };
  }, [useArrowsBar, contentSyncKey, syncThumbAndChrome]);

  const onThumbPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!canScrollRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    const root = scrollRootRef.current;
    if (!root) return;
    dragging.current = true;
    dragStartY.current = e.clientY;
    dragStartScroll.current = root.scrollTop;
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onThumbPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current || !canScrollRef.current) return;
    const root = scrollRootRef.current;
    const rail = railRef.current;
    const thumb = thumbRef.current;
    if (!root || !rail || !thumb) return;

    const trackH = rail.clientHeight;
    const thumbH = thumb.getBoundingClientRect().height;
    const maxScroll = Math.max(0, root.scrollHeight - root.clientHeight);
    const travel = Math.max(0, trackH - thumbH);
    if (travel <= 0 || maxScroll <= 0) return;

    const dy = e.clientY - dragStartY.current;
    root.scrollTop = Math.min(
      maxScroll,
      Math.max(0, dragStartScroll.current + (dy / travel) * maxScroll)
    );
    syncThumbAndChrome();
  };

  const onThumbPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* já libertado */
    }
  };

  const onTrackPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!canScrollRef.current || e.button !== 0) return;
    const rail = railRef.current;
    const thumb = thumbRef.current;
    const root = scrollRootRef.current;
    if (!rail || !thumb || !root) return;

    const railRect = rail.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    const y = e.clientY - railRect.top;
    const thumbTop = thumbRect.top - railRect.top;
    const thumbH = thumbRect.height;

    if (y >= thumbTop && y <= thumbTop + thumbH) return;

    const maxScroll = Math.max(0, root.scrollHeight - root.clientHeight);
    const page = root.clientHeight * 0.85;
    if (y < thumbTop) {
      root.scrollTop = Math.max(0, root.scrollTop - page);
    } else {
      root.scrollTop = Math.min(maxScroll, root.scrollTop + page);
    }
    syncThumbAndChrome();
  };

  if (!useArrowsBar) return null;

  return (
    <div
      ref={railRef}
      className={`app-arrows-scroll-rail ${railVisible ? "" : "app-arrows-scroll-rail--hidden"}`}
      aria-hidden="true"
    >
      <div
        className="app-arrows-scroll-rail__track"
        onPointerDown={onTrackPointerDown}
      />
      <div
        ref={thumbRef}
        className="app-arrows-scroll-rail__thumb"
        onPointerDown={onThumbPointerDown}
        onPointerMove={onThumbPointerMove}
        onPointerUp={onThumbPointerUp}
        onPointerCancel={onThumbPointerUp}
        style={
          {
            "--thumb-h": `${MIN_THUMB_PX}px`,
            "--thumb-top": "0px",
          } as CSSProperties
        }
      >
        <ArrowBox
          orientation="vertical"
          verticalVariant="scrollbar"
          scrollbarScrollPhase={scrollPhase}
        />
      </div>
    </div>
  );
}
