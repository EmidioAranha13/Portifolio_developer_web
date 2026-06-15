import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { CertificateCardItem } from "../../utils/Types";
import { ModalShell } from "./ModalShell";
import "./CertificateAboutModal.css";

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

export type CertificateAboutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  certificate: CertificateCardItem | null;
  closeLabel: string;
  zoomInLabel: string;
  zoomOutLabel: string;
};

/**
 * Modal de detalhe do certificado (imagem com zoom + painel de informações).
 */
const CertificateAboutModal: React.FC<CertificateAboutModalProps> = ({
  isOpen,
  onClose,
  certificate,
  closeLabel,
  zoomInLabel,
  zoomOutLabel,
}) => {
  const titleId = useId();
  const [zoomLevel, setZoomLevel] = useState(MIN_ZOOM);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const modalImageRef = useRef<HTMLImageElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setZoomLevel(MIN_ZOOM);
    setNaturalSize(null);
  }, [certificate?.id, isOpen]);

  useEffect(() => {
    const image = modalImageRef.current;
    if (!image || !certificate || !isOpen) return;

    const syncNaturalSize = () => {
      if (image.naturalWidth > 0 && image.naturalHeight > 0) {
        setNaturalSize({
          width: image.naturalWidth,
          height: image.naturalHeight,
        });
      }
    };

    image.addEventListener("load", syncNaturalSize);
    syncNaturalSize();

    return () => image.removeEventListener("load", syncNaturalSize);
  }, [certificate, isOpen]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !certificate || !isOpen) return;

    const syncViewportSize = () => {
      setViewportSize({
        width: viewport.clientWidth,
        height: viewport.clientHeight,
      });
    };

    syncViewportSize();
    const observer = new ResizeObserver(syncViewportSize);
    observer.observe(viewport);

    return () => observer.disconnect();
  }, [certificate, isOpen]);

  const fitScale = useMemo(() => {
    if (!naturalSize || viewportSize.width <= 0 || viewportSize.height <= 0) return 1;

    return Math.min(
      viewportSize.width / naturalSize.width,
      viewportSize.height / naturalSize.height,
      1,
    );
  }, [naturalSize, viewportSize]);

  const displaySize = useMemo(() => {
    if (!naturalSize) return null;

    return {
      width: naturalSize.width * fitScale * zoomLevel,
      height: naturalSize.height * fitScale * zoomLevel,
    };
  }, [fitScale, naturalSize, zoomLevel]);

  const handleZoomIn = () => {
    setZoomLevel((current) => Math.min(MAX_ZOOM, Number((current + ZOOM_STEP).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoomLevel((current) => Math.max(MIN_ZOOM, Number((current - ZOOM_STEP).toFixed(2))));
  };

  if (!certificate) return null;

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      titleId={titleId}
      title={certificate.title}
      closeLabel={closeLabel}
      panelLayout="content"
      variant="success"
      showFooter={false}
      showTitleSlot={false}
      allowDismiss
      panelClassName="certificate-about-modal"
    >
      <div className="certificate-about-modal__layout">
        <h2 id={titleId} className="certificate-about-modal__sr-title">
          {certificate.title}
        </h2>

        <div className="certificate-about-modal__pdf-col">
          <div className="certificate-about-modal__zoom-controls">
            <button
              type="button"
              className="certificate-about-modal__zoom-btn certificate-about-modal__zoom-btn--out"
              onClick={handleZoomOut}
              disabled={zoomLevel <= MIN_ZOOM || !naturalSize}
              aria-label={zoomOutLabel}
            >
              −
            </button>
            <button
              type="button"
              className="certificate-about-modal__zoom-btn certificate-about-modal__zoom-btn--in"
              onClick={handleZoomIn}
              disabled={zoomLevel >= MAX_ZOOM || !naturalSize}
              aria-label={zoomInLabel}
            >
              +
            </button>
          </div>
          <div className="certificate-about-modal__viewport" ref={viewportRef}>
            <img
              ref={modalImageRef}
              key={certificate.id}
              src={certificate.imgSrc}
              alt={certificate.title}
              className="certificate-about-modal__image"
              style={
                displaySize
                  ? {
                      width: `${displaySize.width}px`,
                      height: `${displaySize.height}px`,
                    }
                  : undefined
              }
              draggable={false}
            />
          </div>
        </div>

        <div className="certificate-about-modal__info-col">
          <button
            type="button"
            className="certificate-about-modal__close"
            onClick={onClose}
            aria-label={closeLabel}
          >
            ×
          </button>
          <div className="certificate-about-modal__info-body">
            <p className="certificate-about-modal__institution">{certificate.institution}</p>
            <h3 className="certificate-about-modal__cert-title">{certificate.title}</h3>
            <div className="certificate-about-modal__divider" aria-hidden />
            <p className="certificate-about-modal__resume">{certificate.resume}</p>
          </div>
        </div>
      </div>
    </ModalShell>
  );
};

export default CertificateAboutModal;
