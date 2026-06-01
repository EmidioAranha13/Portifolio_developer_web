import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import checkIcon from "../../assets/check1.png";
import errorIcon from "../../assets/error1.png";
import "./Modal.css";

export type ModalVariant = "success" | "error" | "processing";

/** Duração e curva únicas para fade, altura do card e spinner (evita dessincronia). */
const MOTION_MS = 380;
const FADE_MS = 280;
/** Texto: processamento some, depois resultado + botão entram. */
const TEXT_SEQUENCE_MS = FADE_MS * 2;
const ICON_MOTION_MS = 300;
/** Ícone entra na metade do fade-scale do spinner. */
const SPINNER_ICON_OVERLAP = 0.5;
const MOTION_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const motionStyle = {
  "--app-modal-motion-ms": `${MOTION_MS}ms`,
  "--app-modal-fade-ms": `${FADE_MS}ms`,
  "--app-modal-icon-ms": `${ICON_MOTION_MS}ms`,
  "--app-modal-motion-ease": MOTION_EASE,
} as React.CSSProperties;

type ModalPhase = "processing" | "exiting-processing" | "result";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  variant: ModalVariant;
  closeLabel: string;
  processingTitle: string;
  processingMessage: string;
  successTitle: string;
  successMessage: string;
  errorTitle: string;
  errorMessage: string;
};

type ModalShellProps = {
  isOpen: boolean;
  onClose: () => void;
  titleId: string;
  title: string;
  variant?: ModalVariant;
  closeLabel: string;
  children: ReactNode;
  showFooter: boolean;
  allowDismiss: boolean;
  footerActionClassName?: string;
  showTitleSlot?: boolean;
  panelRef?: React.RefObject<HTMLDivElement | null>;
  contentMeasureRef?: React.RefObject<HTMLDivElement | null>;
  panelStyle?: React.CSSProperties;
  panelClassName?: string;
};

/**
 * Camada base do modal (backdrop + painel + fechar).
 */
export const ModalShell: React.FC<ModalShellProps> = ({
  isOpen,
  onClose,
  titleId,
  title,
  variant = "success",
  closeLabel,
  children,
  showFooter,
  allowDismiss,
  footerActionClassName,
  showTitleSlot = true,
  panelRef,
  contentMeasureRef,
  panelStyle,
  panelClassName,
}) => {
  useEffect(() => {
    if (!isOpen || !allowDismiss) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose, allowDismiss]);

  useEffect(() => {
    if (!isOpen) return;

    const scrollContainer = document.querySelector(
      ".container.styled-scrollbars",
    ) as HTMLElement | null;
    const previousOverflow = scrollContainer?.style.overflow ?? "";

    if (scrollContainer) {
      scrollContainer.style.overflow = "hidden";
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.style.overflow = previousOverflow;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="app-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (!allowDismiss) return;
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className={`app-modal glass-surface app-modal--feedback app-modal--${variant} ${panelClassName ?? ""}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-busy={variant === "processing"}
        style={panelStyle}
      >
        {contentMeasureRef ? (
          <div ref={contentMeasureRef} className="app-modal__measure">
            {children}
          </div>
        ) : (
          <>
            {showTitleSlot ? (
              <div className="app-modal__title-slot">
                <h3 id={titleId} className="app-modal__title">
                  {title || "\u00a0"}
                </h3>
              </div>
            ) : null}
            <div className="app-modal__body">{children}</div>
            <div
              className={`app-modal__footer ${showFooter ? "app-modal__footer--visible" : ""}`}
            >
              <button
                type="button"
                className={`app-modal__action ${footerActionClassName ?? ""}`.trim()}
                onClick={onClose}
                tabIndex={showFooter ? 0 : -1}
                aria-hidden={!showFooter}
              >
                {closeLabel}
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
};

/**
 * Modal de feedback (sucesso, erro ou processamento) para o formulário de contato.
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  variant,
  closeLabel,
  processingTitle,
  processingMessage,
  successTitle,
  successMessage,
  errorTitle,
  errorMessage,
}) => {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const contentMeasureRef = useRef<HTMLDivElement>(null);
  const titleMeasureRef = useRef<HTMLHeadingElement>(null);
  const measureRafRef = useRef(0);
  const prevVariantRef = useRef<ModalVariant>(variant);
  const transitionTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [panelHeight, setPanelHeight] = useState<number | null>(null);
  const [panelMinWidth, setPanelMinWidth] = useState<number | null>(null);
  const [applyTitleFitWidth, setApplyTitleFitWidth] = useState(false);

  const [phase, setPhase] = useState<ModalPhase>(
    variant === "processing" ? "processing" : "result",
  );
  const [resultChromeVisible, setResultChromeVisible] = useState(
    variant !== "processing",
  );

  const clearTransitionTimers = () => {
    transitionTimersRef.current.forEach(clearTimeout);
    transitionTimersRef.current = [];
  };

  const schedulePhase = (next: ModalPhase, delay: number) => {
    const timer = setTimeout(() => setPhase(next), delay);
    transitionTimersRef.current.push(timer);
  };

  useEffect(() => {
    if (!isOpen) {
      clearTransitionTimers();
      setPhase("processing");
      prevVariantRef.current = "processing";
      return;
    }

    const prev = prevVariantRef.current;
    const becameResult =
      prev === "processing" && (variant === "success" || variant === "error");

    if (becameResult) {
      clearTransitionTimers();
      setPhase("exiting-processing");
      schedulePhase("result", TEXT_SEQUENCE_MS);
    } else if (variant === "processing") {
      clearTransitionTimers();
      setPhase("processing");
    }

    prevVariantRef.current = variant;
  }, [isOpen, variant]);

  useEffect(() => () => clearTransitionTimers(), []);

  useEffect(() => {
    if (!isOpen || phase === "processing") {
      setResultChromeVisible(false);
      return;
    }

    if (phase === "exiting-processing") {
      setResultChromeVisible(false);
      const timer = setTimeout(
        () => setResultChromeVisible(true),
        Math.round(FADE_MS * SPINNER_ICON_OVERLAP),
      );
      return () => clearTimeout(timer);
    }

    setResultChromeVisible(true);
  }, [isOpen, phase]);

  useEffect(() => {
    if (phase === "processing") {
      setApplyTitleFitWidth(false);
      return;
    }

    if (phase === "result") {
      setApplyTitleFitWidth(true);
      return;
    }

    setApplyTitleFitWidth(false);
    const timer = setTimeout(() => setApplyTitleFitWidth(true), FADE_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  const isResultPhase = phase === "result";
  const isExitingPhase = phase === "exiting-processing";
  const isProcessingPhase = phase === "processing";
  const showFooter = isExitingPhase || isResultPhase;
  const resultTitle = variant === "error" ? errorTitle : successTitle;
  const resultMessage = variant === "error" ? errorMessage : successMessage;

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const content = contentMeasureRef.current;
    if (!panel || !content || !isOpen) {
      setPanelHeight(null);
      setPanelMinWidth(null);
      return;
    }

    const measure = () => {
      cancelAnimationFrame(measureRafRef.current);
      measureRafRef.current = requestAnimationFrame(() => {
        const styles = getComputedStyle(panel);
        const paddingY =
          parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
        const paddingX =
          parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
        const borderY =
          parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth);
        const borderX =
          parseFloat(styles.borderLeftWidth) + parseFloat(styles.borderRightWidth);
        const nextHeight = Math.ceil(content.offsetHeight + paddingY + borderY);
        setPanelHeight((prev) => (prev === nextHeight ? prev : nextHeight));

        if (!applyTitleFitWidth) {
          setPanelMinWidth(null);
          return;
        }

        const titleEl = titleMeasureRef.current;
        const bodyRow = content.querySelector(".app-modal__body-row") as HTMLElement | null;
        const titleWidth = titleEl?.scrollWidth ?? 0;
        const bodyRowWidth = bodyRow?.scrollWidth ?? 0;
        const contentWidth = Math.max(titleWidth, bodyRowWidth);
        const maxWidth = Math.floor(window.innerWidth * 0.94);
        const nextWidth = Math.min(Math.ceil(contentWidth + paddingX + borderX), maxWidth);
        setPanelMinWidth((prev) => (prev === nextWidth ? prev : nextWidth));
      });
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(content);
    const titleEl = titleMeasureRef.current;
    if (titleEl) observer.observe(titleEl);
    return () => {
      cancelAnimationFrame(measureRafRef.current);
      observer.disconnect();
    };
  }, [
    isOpen,
    phase,
    variant,
    applyTitleFitWidth,
    showFooter,
    resultChromeVisible,
    processingMessage,
    resultTitle,
    resultMessage,
  ]);

  const shellVariant: ModalVariant =
    isResultPhase && variant !== "processing" ? variant : "processing";

  const allowDismiss = isResultPhase;
  const titleShown = isExitingPhase || isResultPhase;
  const isErrorResult = variant === "error";
  const resultIconMask = isErrorResult ? errorIcon : checkIcon;
  const showResultIcon = resultChromeVisible;
  const hideSpinnerWrap = isResultPhase;
  const spinnerExiting = isExitingPhase;
  const stageLayoutClass =
    isProcessingPhase
      ? "app-modal__stage--processing"
      : isExitingPhase
        ? "app-modal__stage--exiting"
        : "app-modal__stage--result";

  const titleClassName = [
    "app-modal__title",
    isProcessingPhase ? "app-modal__title--sr" : "app-modal__title--inline",
    !isProcessingPhase && titleShown ? "app-modal__title--visible" : "",
    !isProcessingPhase && !titleShown ? "app-modal__title--placeholder" : "",
    !isProcessingPhase && isErrorResult ? "app-modal__title--error" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      titleId={titleId}
      title=""
      variant={shellVariant}
      closeLabel={closeLabel}
      showFooter={false}
      allowDismiss={allowDismiss}
      footerActionClassName={variant === "error" ? "app-modal__action--error" : ""}
      showTitleSlot={false}
      panelRef={panelRef}
      contentMeasureRef={contentMeasureRef}
      panelClassName={
        [
          panelHeight != null ? "app-modal--sized" : "",
          applyTitleFitWidth ? "app-modal--title-fit" : "",
        ]
          .filter(Boolean)
          .join(" ") || undefined
      }
      panelStyle={{
        ...(panelHeight != null ? { height: panelHeight } : {}),
        ...(panelMinWidth != null ? { width: `min(${panelMinWidth}px, 94vw)` } : {}),
        ...motionStyle,
      }}
    >
      <div className={`app-modal__stage ${stageLayoutClass}`} style={motionStyle}>
        <h3 ref={titleMeasureRef} id={titleId} className={titleClassName}>
          {isProcessingPhase ? processingTitle : titleShown ? resultTitle : "\u00a0"}
        </h3>

        <div className="app-modal__body-row">
          <div
            className="app-modal__media"
            aria-hidden={!showResultIcon && !spinnerExiting && isProcessingPhase}
          >
            <div
              className={`app-modal__spinner-wrap ${
                spinnerExiting ? "app-modal__spinner-wrap--exiting" : ""
              } ${hideSpinnerWrap ? "app-modal__spinner-wrap--hidden" : ""}`}
            >
              <div className="app-modal__spinner" />
            </div>
            <div
              role="img"
              aria-hidden={!showResultIcon}
              className={`app-modal__result-icon ${
                isErrorResult ? "app-modal__result-icon--error" : "app-modal__result-icon--success"
              } ${showResultIcon ? "app-modal__result-icon--visible" : ""}`}
              style={{
                WebkitMaskImage: `url(${resultIconMask})`,
                maskImage: `url(${resultIconMask})`,
              }}
            />
          </div>

          <div className="app-modal__messages" aria-live="polite">
            <p
              className={`app-modal__message app-modal__message--processing app-modal__text-layer ${
                isResultPhase ? "app-modal__text-layer--out" : ""
              }`}
            >
              {processingMessage}
            </p>
            <p className="app-modal__message app-modal__message--result app-modal__text-layer">
              {resultMessage}
            </p>
          </div>
        </div>

        <footer
          className={`app-modal__footer app-modal__footer--in-column ${
            showFooter ? "app-modal__footer--visible" : ""
          }`}
        >
          <button
            type="button"
            className={`app-modal__action ${
              variant === "error" ? "app-modal__action--error" : ""
            }`.trim()}
            onClick={onClose}
            tabIndex={showFooter ? 0 : -1}
            aria-hidden={!showFooter}
          >
            {closeLabel}
          </button>
        </footer>
      </div>
    </ModalShell>
  );
};

export default Modal;
