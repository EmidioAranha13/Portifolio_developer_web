import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { ProjectCarouselCardItem } from "../../utils/Types";
import arrowDown from "../../assets/arrow-down.png";
import "./CarouselSelector.css";

const SWIPE_THRESHOLD_PX = 48;
const MAX_VISIBLE_OFFSET = 4;

export type CarouselSelectorProps = {
  items: ProjectCarouselCardItem[];
  ariaLabel: string;
  prevLabel: string;
  nextLabel: string;
};

/**
 * Carrossel em arco (coverflow): card central maior; navegação por toque, clique ou botões laterais.
 */
const CarouselSelector: React.FC<CarouselSelectorProps> = ({
  items,
  ariaLabel,
  prevLabel,
  nextLabel,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const dragRef = useRef({ startX: 0, dragging: false });
  const count = items.length;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      const wrapped = ((index % count) + count) % count;
      setActiveIndex(wrapped);
    },
    [count],
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if ((event.target as HTMLElement).closest(".carousel-selector__card")) return;
    dragRef.current = { startX: event.clientX, dragging: true };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onCardPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    dragRef.current = { startX: event.clientX, dragging: true };
  };

  const onCardPointerUp = (
    event: ReactPointerEvent<HTMLButtonElement>,
    index: number,
  ) => {
    event.stopPropagation();
    if (!dragRef.current.dragging) return;
    const delta = event.clientX - dragRef.current.startX;
    dragRef.current.dragging = false;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) goTo(index);
    else if (delta > SWIPE_THRESHOLD_PX) goPrev();
    else goNext();
  };

  const onCardPointerCancel = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    dragRef.current.dragging = false;
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.dragging) return;
    const delta = event.clientX - dragRef.current.startX;
    dragRef.current.dragging = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (delta > SWIPE_THRESHOLD_PX) goPrev();
    else if (delta < -SWIPE_THRESHOLD_PX) goNext();
  };

  const onPointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current.dragging = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  if (count === 0) return null;

  return (
    <div className="carousel-selector" aria-roledescription="carousel">
      <div className="carousel-selector__controls">
        <button
          type="button"
          className="carousel-selector__nav carousel-selector__nav--prev"
          onClick={goPrev}
          aria-label={prevLabel}
        >
          <img
            className="carousel-selector__nav-icon carousel-selector__nav-icon--prev"
            src={arrowDown}
            alt=""
            aria-hidden
            decoding="async"
          />
        </button>

        <div
          className="carousel-selector__stage"
          role="group"
          aria-label={ariaLabel}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
        >
          <div className="carousel-selector__track">
            {items.map((item, index) => {
              let offset = index - activeIndex;
              if (offset > count / 2) offset -= count;
              if (offset < -count / 2) offset += count;

              const absOffset = Math.abs(offset);
              if (absOffset > MAX_VISIBLE_OFFSET) return null;

              const isActive = index === activeIndex;

              const hasImage = Boolean(item.imageSrc);

              return (
                <button
                  key={`${item.id}-${item.img ?? "color"}`}
                  type="button"
                  className={[
                    "carousel-selector__card",
                    isActive ? "carousel-selector__card--active" : "",
                    hasImage ? "carousel-selector__card--has-image" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={
                    {
                      "--card-offset": offset,
                      "--card-distance": Math.abs(offset),
                      "--card-color": item.color,
                    } as React.CSSProperties
                  }
                  onPointerDown={onCardPointerDown}
                  onPointerUp={(event) => onCardPointerUp(event, index)}
                  onPointerCancel={onCardPointerCancel}
                  aria-label={`${item.title}. ${item.description}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span
                    className="carousel-selector__card-media"
                    style={{ backgroundImage: `url(${item.imageSrc})` }}
                    aria-hidden
                  />
                  <span className="carousel-selector__card-wedge" aria-hidden />
                  <span className="carousel-selector__card-overlay" aria-hidden />
                  <span className="carousel-selector__card-content">
                    <span className="carousel-selector__card-title">{item.title}</span>
                    <span className="carousel-selector__card-description">{item.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          className="carousel-selector__nav carousel-selector__nav--next"
          onClick={goNext}
          aria-label={nextLabel}
        >
          <img
            className="carousel-selector__nav-icon carousel-selector__nav-icon--next"
            src={arrowDown}
            alt=""
            aria-hidden
            decoding="async"
          />
        </button>
      </div>
    </div>
  );
};

export default CarouselSelector;
