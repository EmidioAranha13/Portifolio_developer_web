import {
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import type {
  ArrowBoxOrientation,
  ArrowBoxProps,
  ScrollbarThumbPhase,
} from "../../utils/Types";
import "./ArrowBox.css";

export type { ArrowBoxOrientation, ScrollbarThumbPhase };

/** Quantidade de setas na onda do pílula horizontal / por coluna no mobile. */
const WAVE_ARROW_COUNT = 9;
const DESKTOP_WAVE_ARROW_COUNT = 11;
const DESKTOP_WAVE_GROUPS = 11;

/** Colunas no mobile: 1ª, 3ª e 5ª numa fase; 2ª e 4ª defasadas. */
const MOBILE_WAVE_GROUPS = 5;

const MOBILE_ALTERNATE_LANE_PHASE = 0.5;

/** Igual ao empilhamento no CSS (margin-top −0.7 × altura). */
const ARROW_STACK_OVERLAP = 0.7;

const MIN_VERTICAL_ARROWS = 12;
const MAX_VERTICAL_ARROWS = 160;
const MIN_SCROLLBAR_ARROWS = 14;
const MAX_SCROLLBAR_ARROWS = 220;

function approxArrowSizePx(): number {
  if (typeof window === "undefined") return 34;
  return Math.min(42, Math.max(26, window.innerWidth * 0.08));
}

function scrollbarArrowSizePx(el: HTMLElement): number {
  const w = el.clientWidth;
  return Math.round(Math.max(11, Math.min(24, w * 0.92)));
}

function computeVerticalArrowCount(
  heightPx: number,
  arrowPx: number,
  min: number,
  max: number
): number {
  if (heightPx < 20) return min;
  const step = arrowPx * (1 - ARROW_STACK_OVERLAP);
  const n = Math.ceil((heightPx - arrowPx) / step) + 3;
  return Math.max(min, Math.min(max, n));
}

function useVerticalArrowCount(
  rootRef: RefObject<HTMLDivElement | null>,
  enabled: boolean
): number {
  const [count, setCount] = useState(40);

  useLayoutEffect(() => {
    if (!enabled) return;
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const h = el.clientHeight;
      if (h < 24) return;
      const arrowPx = approxArrowSizePx();
      setCount(
        computeVerticalArrowCount(
          h,
          arrowPx,
          MIN_VERTICAL_ARROWS,
          MAX_VERTICAL_ARROWS
        )
      );
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [enabled]);

  return count;
}

/** Contagens para thumb da scrollbar (coluna cheia ou duas metades). */
function useScrollbarThumbArrowCounts(
  rootRef: RefObject<HTMLDivElement | null>,
  enabled: boolean,
  phase: ScrollbarThumbPhase
): { single: number; topHalf: number; bottomHalf: number } {
  const [single, setSingle] = useState(32);
  const [topHalf, setTopHalf] = useState(16);
  const [bottomHalf, setBottomHalf] = useState(16);

  useLayoutEffect(() => {
    if (!enabled) return;
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const h = Math.max(0, el.clientHeight - 8);
      const arrowPx = scrollbarArrowSizePx(el);
      if (phase === "middle") {
        const halfH = Math.max(18, (h - 4) / 2);
        setTopHalf(
          computeVerticalArrowCount(
            halfH,
            arrowPx,
            MIN_SCROLLBAR_ARROWS,
            MAX_SCROLLBAR_ARROWS
          )
        );
        setBottomHalf(
          computeVerticalArrowCount(
            halfH,
            arrowPx,
            MIN_SCROLLBAR_ARROWS,
            MAX_SCROLLBAR_ARROWS
          )
        );
      } else {
        setSingle(
          computeVerticalArrowCount(
            h,
            arrowPx,
            MIN_SCROLLBAR_ARROWS,
            MAX_SCROLLBAR_ARROWS
          )
        );
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [enabled, phase]);

  return { single, topHalf, bottomHalf };
}

function waveDelayCss(
  arrowIndex: number,
  totalInWave: number,
  lanePhaseShift = 0
): string {
  if (totalInWave <= 1) {
    return `calc(var(--profile-hero-wave-period) * ${lanePhaseShift})`;
  }
  const wavePart = -(totalInWave - 1 - arrowIndex) / totalInWave;
  return `calc(var(--profile-hero-wave-period) * (${wavePart} + ${lanePhaseShift}))`;
}

function ArrowWaveTrack({
  waveCount,
  className,
  lanePhaseShift = 0,
}: {
  waveCount: number;
  className?: string;
  lanePhaseShift?: number;
}) {
  return (
    <div className={className}>
      {Array.from({ length: waveCount }, (_, i) => (
        <span
          key={i}
          className="profile-hero-triple-arrows-down__arrow"
          style={{
            animationDelay: waveDelayCss(i, waveCount, lanePhaseShift),
          }}
        />
      ))}
    </div>
  );
}

const ArrowBox: React.FC<
  ArrowBoxProps
> = ({
  orientation = "horizontal",
  verticalVariant = "hero",
  scrollbarScrollPhase = "top",
}) => {
  const verticalRef = useRef<HTMLDivElement>(null);
  const isHeroVertical =
    orientation === "vertical" && verticalVariant === "hero";

  const verticalCount = useVerticalArrowCount(verticalRef, isHeroVertical);

  const isScrollbarVertical =
    orientation === "vertical" && verticalVariant === "scrollbar";
  const { single, topHalf, bottomHalf } = useScrollbarThumbArrowCounts(
    verticalRef,
    isScrollbarVertical,
    scrollbarScrollPhase
  );

  if (isScrollbarVertical) {
    const phase = scrollbarScrollPhase;
    const rootClass = [
      "profile-hero-triple-arrows-down",
      "profile-hero-triple-arrows-down--vertical",
      "profile-hero-triple-arrows-down--scrollbar-thumb",
      phase === "bottom" ? "profile-hero-triple-arrows-down--arrows-up" : "",
    ]
      .filter(Boolean)
      .join(" ");

    if (phase === "middle") {
      return (
        <div
          ref={verticalRef}
          className={rootClass}
          aria-hidden="true"
        >
          <div className="profile-hero-triple-arrows-down__panel">
            <div className="profile-hero-triple-arrows-down__viewport profile-hero-triple-arrows-down__viewport--split">
              <div className="profile-hero-triple-arrows-down__split-half profile-hero-triple-arrows-down__split-half--up">
                <ArrowWaveTrack
                  waveCount={topHalf}
                  className="profile-hero-triple-arrows-down__track profile-hero-triple-arrows-down__track--vertical profile-hero-triple-arrows-down__track--split-up"
                />
              </div>
              <div className="profile-hero-triple-arrows-down__split-half profile-hero-triple-arrows-down__split-half--down">
                <ArrowWaveTrack
                  waveCount={bottomHalf}
                  className="profile-hero-triple-arrows-down__track profile-hero-triple-arrows-down__track--vertical profile-hero-triple-arrows-down__track--split-down"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div ref={verticalRef} className={rootClass} aria-hidden="true">
        <div className="profile-hero-triple-arrows-down__panel">
          <div className="profile-hero-triple-arrows-down__viewport profile-hero-triple-arrows-down__viewport--scrollbar-fill">
            <ArrowWaveTrack
              waveCount={single}
              className="profile-hero-triple-arrows-down__track profile-hero-triple-arrows-down__track--vertical profile-hero-triple-arrows-down__track--scrollbar-fill"
            />
          </div>
        </div>
      </div>
    );
  }

  if (orientation === "vertical") {
    return (
      <div
        ref={verticalRef}
        className="profile-hero-triple-arrows-down profile-hero-triple-arrows-down--vertical"
        aria-hidden="true"
      >
        <div className="profile-hero-triple-arrows-down__panel">
          <div className="profile-hero-triple-arrows-down__viewport">
            <ArrowWaveTrack
              waveCount={verticalCount}
              className="profile-hero-triple-arrows-down__track profile-hero-triple-arrows-down__track--vertical"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-hero-triple-arrows-down" aria-hidden="true">
      <div className="profile-hero-triple-arrows-down__panel">
        <div className="profile-hero-triple-arrows-down__viewport">
          <div className="profile-hero-triple-arrows-down__row profile-hero-triple-arrows-down__row--desktop">
            {Array.from({ length: DESKTOP_WAVE_GROUPS }, (_, g) => (
              <ArrowWaveTrack
                key={`desktop-${g}`}
                waveCount={DESKTOP_WAVE_ARROW_COUNT}
                className="profile-hero-triple-arrows-down__track profile-hero-triple-arrows-down__track--desktop-lane"
                lanePhaseShift={
                  g % 2 === 0 ? 0 : MOBILE_ALTERNATE_LANE_PHASE
                }
              />
            ))}
          </div>
          <div className="profile-hero-triple-arrows-down__row profile-hero-triple-arrows-down__row--mobile">
            {Array.from({ length: MOBILE_WAVE_GROUPS }, (_, g) => (
              <ArrowWaveTrack
                key={`mobile-${g}`}
                waveCount={WAVE_ARROW_COUNT}
                className="profile-hero-triple-arrows-down__track profile-hero-triple-arrows-down__track--mobile"
                lanePhaseShift={
                  g % 2 === 0 ? 0 : MOBILE_ALTERNATE_LANE_PHASE
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArrowBox;
