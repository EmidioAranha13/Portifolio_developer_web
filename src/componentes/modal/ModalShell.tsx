import { useEffect, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";

export type ModalVariant = "success" | "error" | "processing";

export type ModalPanelLayout = "feedback" | "content";

export type ModalShellProps = {
  isOpen: boolean;
  onClose: () => void;
  titleId: string;
  title: string;
  closeLabel: string;
  children: ReactNode;
  showFooter: boolean;
  allowDismiss: boolean;
  variant?: ModalVariant;
  panelLayout?: ModalPanelLayout;
  footerActionClassName?: string;
  showTitleSlot?: boolean;
  panelRef?: RefObject<HTMLDivElement | null>;
  contentMeasureRef?: RefObject<HTMLDivElement | null>;
  panelStyle?: React.CSSProperties;
  panelClassName?: string;
  /** Conteúdo à direita do título (ex.: botão fechar). */
  titleTrailing?: ReactNode;
  /** Irmão à direita do painel (ex.: scroll customizado). */
  layoutAside?: ReactNode;
  /** Classe do wrapper flex painel + layoutAside. */
  layoutWrapClassName?: string;
};

/**
 * Camada base do modal (backdrop + painel + rodapé opcional).
 * Modais específicos compõem este shell com seu conteúdo.
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
  panelLayout = "feedback",
  footerActionClassName,
  showTitleSlot = true,
  panelRef,
  contentMeasureRef,
  panelStyle,
  panelClassName,
  titleTrailing,
  layoutAside,
  layoutWrapClassName,
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

  const layoutClass =
    panelLayout === "feedback"
      ? `app-modal--feedback app-modal--${variant}`
      : "app-modal--content";

  const panel = (
    <div
      ref={panelRef}
      className={`app-modal glass-surface ${layoutClass} ${panelClassName ?? ""}`.trim()}
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
            <div
              className={`app-modal__title-slot${
                titleTrailing ? " app-modal__title-slot--split" : ""
              }`}
            >
              <h3 id={titleId} className="app-modal__title app-modal__title--visible">
                {title || "\u00a0"}
              </h3>
              {titleTrailing ?? null}
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
  );

  return createPortal(
    <div
      className="app-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (!allowDismiss) return;
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {layoutAside ? (
        <div
          className={`app-modal-backdrop__layout ${layoutWrapClassName ?? ""}`.trim()}
        >
          {panel}
          {layoutAside}
        </div>
      ) : (
        panel
      )}
    </div>,
    document.body,
  );
};
