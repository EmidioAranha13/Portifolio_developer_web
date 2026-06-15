import { useMemo, useState } from "react";
import CardBox from "../../componentes/CardBox/CardBox";
import { CertificateAboutModal } from "../../componentes/modal";
import type { InfoTexts } from "../../utils/infoTextsCollection";
import { CERTIFICATE_IMAGES } from "../../utils/certificateAssets";
import type { CertificateCardItem } from "../../utils/Types";
import "./CertificationsPage.css";

type CertificationsPageProps = {
  title: string;
  infoTexts?: InfoTexts;
};

const CertificationsPage: React.FC<CertificationsPageProps> = ({ title, infoTexts }) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const certificates: CertificateCardItem[] = useMemo(
    () =>
      (infoTexts?.certificate_page?.certificates ?? []).map((cert) => ({
        ...cert,
        imgSrc: CERTIFICATE_IMAGES[cert.img],
      })),
    [infoTexts],
  );

  const activeCertificate = certificates.find((item) => item.id === activeId) ?? null;
  const modalLabels = infoTexts?.certificate_page?.modal ?? {
    close_label: "Fechar modal",
    zoom_in_label: "Aumentar zoom",
    zoom_out_label: "Diminuir zoom",
  };

  return (
    <div className="cert-page">
      <div className="cert-page__heading glass-surface">
        <h1 className="cert-page__title">{title}</h1>
      </div>

      <section className="cert-page__grid" aria-label="Certificados">
        {certificates.map((cert) => (
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
                <img src={cert.imgSrc} alt="" className="cert-page__preview" />
              </div>
            </CardBox>
          </button>
        ))}
      </section>

      <CertificateAboutModal
        isOpen={activeCertificate !== null}
        onClose={() => setActiveId(null)}
        certificate={activeCertificate}
        closeLabel={modalLabels.close_label}
        zoomInLabel={modalLabels.zoom_in_label}
        zoomOutLabel={modalLabels.zoom_out_label}
      />
    </div>
  );
};

export default CertificationsPage;
