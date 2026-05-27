import type { CertificateId } from "./Types";
import cert1 from "../assets/certifies/Certificado_1.png";
import cert2 from "../assets/certifies/Certificado_2.png";
import cert3 from "../assets/certifies/Certificado_3.png";
import cert4 from "../assets/certifies/Certificado_4.png";
import cert5 from "../assets/certifies/Certificado_5.png";
import cert6 from "../assets/certifies/Certificado_6.png";
import cert7 from "../assets/certifies/Certificado_7.png";
import c1 from "../assets/certifies/C1.pdf";
import c2 from "../assets/certifies/C2.pdf";
import c3 from "../assets/certifies/C3.pdf";
import c4 from "../assets/certifies/C4.pdf";
import c5 from "../assets/certifies/C5.pdf";
import c6 from "../assets/certifies/C6.pdf";
import c7 from "../assets/certifies/C7.pdf";

/** Mapa id → URL da imagem PNG do certificado. */
export const CERTIFICATE_IMAGES: Record<CertificateId, string> = {
  c1: cert1,
  c2: cert2,
  c3: cert3,
  c4: cert4,
  c5: cert5,
  c6: cert6,
  c7: cert7,
};

/** PDFs para uso futuro (ex.: página de Contato). */
export const CERTIFICATE_PDFS: Record<CertificateId, string> = {
  c1,
  c2,
  c3,
  c4,
  c5,
  c6,
  c7,
};
