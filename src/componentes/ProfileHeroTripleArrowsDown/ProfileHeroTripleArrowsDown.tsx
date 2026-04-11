import {
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import "./ProfileHeroTripleArrowsDown.css";

/** Quantidade de setas na onda do pílula horizontal / por coluna no mobile. */
const WAVE_ARROW_COUNT = 9;

/** Colunas no mobile: 1ª, 3ª e 5ª numa fase; 2ª e 4ª defasadas. */
const MOBILE_WAVE_GROUPS = 5;

const MOBILE_ALTERNATE_LANE_PHASE = 0.5;

/** Igual ao empilhamento no CSS (margin-top −0.7 × altura). */
const ARROW_STACK_OVERLAP = 0.7;

const MIN_VERTICAL_ARROWS = 12;
const MAX_VERTICAL_ARROWS = 160;

export type ProfileHeroTripleArrowsOrientation = "horizontal" | "vertical";

function approxArrowSizePx(): number {
  if (typeof window === "undefined") return 34;
  return Math.min(42, Math.max(26, window.innerWidth * 0.08));
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
      const step = arrowPx * (1 - ARROW_STACK_OVERLAP);
      const n = Math.ceil((h - arrowPx) / step) + 1;
      setCount(
        Math.max(MIN_VERTICAL_ARROWS, Math.min(MAX_VERTICAL_ARROWS, n))
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

type ProfileHeroTripleArrowsDownProps = {
  orientation?: ProfileHeroTripleArrowsOrientation;
};

const ProfileHeroTripleArrowsDown: React.FC<
  ProfileHeroTripleArrowsDownProps
> = ({ orientation = "horizontal" }) => {
  const verticalRef = useRef<HTMLDivElement>(null);
  const verticalCount = useVerticalArrowCount(
    verticalRef,
    orientation === "vertical"
  );

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
          <ArrowWaveTrack
            waveCount={WAVE_ARROW_COUNT}
            className="profile-hero-triple-arrows-down__track profile-hero-triple-arrows-down__track--desktop"
          />
          <div className="profile-hero-triple-arrows-down__row">
            {Array.from({ length: MOBILE_WAVE_GROUPS }, (_, g) => (
              <ArrowWaveTrack
                key={g}
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

export default ProfileHeroTripleArrowsDown;
