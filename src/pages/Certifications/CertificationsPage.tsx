import { useState } from "react";
import CardBox from "../../componentes/CardBox/CardBox";
import type { InfoTexts } from "../../utils/infoTextsCollection";
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
  file: string;
};

/** Fragmento de URL para o visualizador embutido: sem barra de ferramentas / painéis laterais. */
const PDF_VIEW_ONLY_HASH = "#toolbar=0&navpanes=0&scrollbar=0&view=FitH";

const CERTIFICATES: CertificateItem[] = [
  {
    id: "c1",
    title: "Bacharel em Ciência da Computação",
    institution: "UFAM (Universidade Federal do Amazonas)",
    resume: "Certificado de conclusão de curso de Bacharelado em Ciência da Computação pela Universidade Federal do Amazonas (UFAM).",
    file: c1,
  },
  {
    id: "c2",
    title: "DevTitans",
    institution: "UFAM (Universidade Federal do Amazonas)",
    resume: "Descrição do certificado em breve.",
    file: c2,
  },
  {
    id: "c3",
    title: "Certificado 3",
    institution: "Instituição 3",
    resume: "Descrição do certificado em breve.",
    file: c3,
  },
  {
    id: "c4",
    title: "Certificado 4",
    institution: "Instituição 4",
    resume: "Descrição do certificado em breve.",
    file: c4,
  },
  {
    id: "c5",
    title: "Certificado 5",
    institution: "Instituição 5",
    resume: "Descrição do certificado em breve.",
    file: c5,
  },
  {
    id: "c6",
    title: "Certificado 6",
    institution: "Instituição 6",
    resume: "Descrição do certificado em breve.",
    file: c6,
  },
  {
    id: "c7",
    title: "Certificado 7",
    institution: "Instituição 7",
    resume: "Descrição do certificado em breve.",
    file: c7,
  },
];

const CertificationsPage: React.FC<CertificationsPageProps> = ({ title }) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeCertificate = CERTIFICATES.find((item) => item.id === activeId) ?? null;

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
              {/* iframe com parâmetros para esconder toolbar e scrollbar nativos do browser */}
              <div className="cert-page__preview-wrapper" aria-hidden="true">
                <iframe
                  src={`${cert.file}${PDF_VIEW_ONLY_HASH}`}
                  title={cert.title}
                  className="cert-page__preview"
                  tabIndex={-1}
                />
              </div>
            </CardBox>
          </button>
        ))}
      </section>

      {activeCertificate ? (
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
            {/* Coluna esquerda: PDF */}
            <div className="cert-page__modal-pdf-col">
              <iframe
                src={`${activeCertificate.file}${PDF_VIEW_ONLY_HASH}`}
                title={activeCertificate.title}
                className="cert-page__modal-pdf"
              />
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
                <p className="cert-page__modal-institution">
                  {activeCertificate.institution}
                </p>
                <h2 className="cert-page__modal-cert-title">
                  {activeCertificate.title}
                </h2>
                <div className="cert-page__modal-divider" aria-hidden />
                <p className="cert-page__modal-resume">
                  {activeCertificate.resume}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CertificationsPage;
