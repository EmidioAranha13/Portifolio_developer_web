import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CardBox from "../../componentes/CardBox/CardBox";
import type { InfoTexts } from "../../utils/infoTextsCollection";
import cert1 from "../../assets/certifies/Certificado_1.png";
import cert2 from "../../assets/certifies/Certificado_2.png";
import cert3 from "../../assets/certifies/Certificado_3.png";
import cert4 from "../../assets/certifies/Certificado_4.png";
import cert5 from "../../assets/certifies/Certificado_5.png";
import cert6 from "../../assets/certifies/Certificado_6.png";
import cert7 from "../../assets/certifies/Certificado_7.png";
import c1 from "../../assets/certifies/C1.pdf";
import c2 from "../../assets/certifies/C2.pdf";
import c3 from "../../assets/certifies/C3.pdf";
import c4 from "../../assets/certifies/C4.pdf";
import c5 from "../../assets/certifies/C5.pdf";
import c6 from "../../assets/certifies/C6.pdf";
import c7 from "../../assets/certifies/C7.pdf";
import "./CertificationsPage.css";

type CertificationsPageProps = {
  title: string;
  infoTexts?: InfoTexts;
};

type CertificateItem = {
  id: string;
  title: string;
  institution: string;
  resume: string;
  img: string;
};

export const CERTIFICATE_PDFS: Record<string, string> = {
  c1,
  c2,
  c3,
  c4,
  c5,
  c6,
  c7,
};

const CERTIFICATES: CertificateItem[] = [
  {
    id: "c1",
    title: "Bacharel em Ciência da Computação",
    institution: "UFAM (Universidade Federal do Amazonas)",
    resume: "Certificado de conclusão de curso de Bacharelado em Ciência da Computação pela Universidade Federal do Amazonas (UFAM).",
    img: cert1,
  },
  {
    id: "c2",
    title: "DevTitans",
    institution: "UFAM (Universidade Federal do Amazonas)",
    resume: "Descrição do certificado em breve.",
    img: cert2,
  },
  {
    id: "c3",
    title: "Certificado 3",
    institution: "Instituição 3",
    resume: "Descrição do certificado em breve.",
    img: cert3,
  },
  {
    id: "c4",
    title: "Certificado 4",
    institution: "Instituição 4",
    resume: "Descrição do certificado em breve.",
    img: cert4,
  },
  {
    id: "c5",
    title: "Certificado 5",
    institution: "Instituição 5",
    resume: "Descrição do certificado em breve.",
    img: cert5,
  },
  {
    id: "c6",
    title: "Certificado 6",
    institution: "Instituição 6",
    resume: "Descrição do certificado em breve.",
    img: cert6,
  },
  {
    id: "c7",
    title: "Certificado 7",
    institution: "Instituição 7",
    resume: "Descrição do certificado em breve.",
    img: cert7,
  },
];

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

const CertificationsPage: React.FC<CertificationsPageProps> = ({ title }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(MIN_ZOOM);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const modalImageRef = useRef<HTMLImageElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const activeCertificate = CERTIFICATES.find((item) => item.id === activeId) ?? null;

  useEffect(() => {
    setZoomLevel(MIN_ZOOM);
    setNaturalSize(null);
  }, [activeId]);

  useEffect(() => {
    if (!activeId) return;

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
  }, [activeId]);

  useEffect(() => {
    const image = modalImageRef.current;
    if (!image || !activeCertificate) return;

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
  }, [activeCertificate]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !activeCertificate) return;

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
  }, [activeCertificate]);

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

  return (
    <div className="cert-page">
      <div className="cert-page__heading glass-surface">
        <h1 className="cert-page__title">{title}</h1>
      </div>

      <section className="cert-page__grid" aria-label="Certificados">
        {CERTIFICATES.map((cert) => (
          <button
            key={cert.id}
            type="button"
            className="cert-page__card-button"
            onClick={() => setActiveId(cert.id)}
            aria-label={`Abrir certificado: ${cert.title}`}
          >
            <CardBox className="cert-page__card">
              <p className="cert-page__card-title">{cert.title}</p>
              <div className="cert-page__preview-wrapper" aria-hidden="true">
                <img
                  src={cert.img}
                  alt=""
                  className="cert-page__preview"
                />
              </div>
            </CardBox>
          </button>
        ))}
      </section>

      {activeCertificate
        ? createPortal(
            <div
              className="cert-page__modal-backdrop"
              onClick={() => setActiveId(null)}
              role="presentation"
            >
              <div
                className="cert-page__modal"
                role="dialog"
                aria-modal="true"
                aria-label={activeCertificate.title}
                onClick={(event) => event.stopPropagation()}
              >
                {/* Coluna esquerda: imagem do certificado */}
                <div className="cert-page__modal-pdf-col">
                  <div className="cert-page__modal-zoom-controls glass-surface">
                    <button
                      type="button"
                      className="cert-page__modal-zoom-btn cert-page__modal-zoom-btn--out"
                      onClick={handleZoomOut}
                      disabled={zoomLevel <= MIN_ZOOM || !naturalSize}
                      aria-label="Diminuir zoom"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      className="cert-page__modal-zoom-btn cert-page__modal-zoom-btn--in"
                      onClick={handleZoomIn}
                      disabled={zoomLevel >= MAX_ZOOM || !naturalSize}
                      aria-label="Aumentar zoom"
                    >
                      +
                    </button>
                  </div>
                  <div className="cert-page__modal-viewport" ref={viewportRef}>
                    <img
                      ref={modalImageRef}
                      key={activeCertificate.id}
                      src={activeCertificate.img}
                      alt={activeCertificate.title}
                      className="cert-page__modal-pdf"
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

                {/* Coluna direita: informações + botão fechar */}
                <div className="cert-page__modal-info-col">
                  <button
                    type="button"
                    className="cert-page__modal-close"
                    onClick={() => setActiveId(null)}
                    aria-label="Fechar modal"
                  >
                    ×
                  </button>
                  <div className="cert-page__modal-info-body">
                    <h2 className="cert-page__modal-cert-title">
                      {activeCertificate.title}
                    </h2>
                    <p className="cert-page__modal-institution">
                      {activeCertificate.institution}
                    </p>
                    <div className="cert-page__modal-divider" aria-hidden />
                    <p className="cert-page__modal-resume">
                      {activeCertificate.resume}
                    </p>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
};

export default CertificationsPage;
