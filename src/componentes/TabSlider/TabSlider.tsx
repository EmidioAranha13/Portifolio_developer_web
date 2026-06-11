import { useCallback, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import "./TabSlider.css";

export type TabSliderProps = {
  tabs: readonly string[];
  activeIndex: number;
  onChange: (index: number) => void;
  ariaLabel?: string;
};

type IndicatorMetrics = {
  left: number;
  width: number;
};

const EMPTY_INDICATOR: IndicatorMetrics = { left: 0, width: 0 };

/**
 * Abas com título em degradê; seleção indicada por sublinhado animado.
 */
const TabSlider: React.FC<TabSliderProps> = ({
  tabs,
  activeIndex,
  onChange,
  ariaLabel,
}) => {
  const baseId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState<IndicatorMetrics>(EMPTY_INDICATOR);

  const updateIndicator = useCallback(() => {
    const track = trackRef.current;
    const tab = tabRefs.current[activeIndex];
    if (!track || !tab) {
      setIndicator(EMPTY_INDICATOR);
      return;
    }

    const trackRect = track.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();

    setIndicator({
      left: tabRect.left - trackRect.left,
      width: tabRect.width,
    });
  }, [activeIndex]);

  useLayoutEffect(() => {
    updateIndicator();

    const list = listRef.current;
    const track = trackRef.current;
    if (!list || !track) return;

    const observer = new ResizeObserver(() => {
      updateIndicator();
    });

    observer.observe(list);
    observer.observe(track);
    for (const tab of tabRefs.current) {
      if (tab) observer.observe(tab);
    }

    window.addEventListener("resize", updateIndicator);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
  }, [tabs, updateIndicator]);

  if (tabs.length === 0) return null;

  const indicatorStyle = {
    "--tab-slider-indicator-left": `${indicator.left}px`,
    "--tab-slider-indicator-width": `${indicator.width}px`,
  } as CSSProperties;

  return (
    <div className="tab-slider">
      <div
        ref={listRef}
        className="tab-slider__list"
        role="tablist"
        aria-label={ariaLabel}
      >
        {tabs.map((label, index) => {
          const isActive = index === activeIndex;
          const tabId = `${baseId}-tab-${index}`;
          return (
            <button
              key={`${label}-${index}`}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              id={tabId}
              className={`tab-slider__tab${isActive ? " tab-slider__tab--active" : ""}`}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(index)}
            >
              <span className="tab-slider__tab-text">{label}</span>
            </button>
          );
        })}
      </div>

      <div
        ref={trackRef}
        className="tab-slider__track"
        style={indicatorStyle}
        aria-hidden="true"
      >
        <span className="tab-slider__indicator" />
        <span className="tab-slider__rule" />
      </div>
    </div>
  );
};

export default TabSlider;
