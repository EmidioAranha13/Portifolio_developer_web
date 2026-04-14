import OpaqueBoxTest from "../../utils/testesDeComponentes/OpaqueBoxTest";
import "./EducationPage.css";

type EducationPageProps = {
  title: string;
};

/**
 * Página Formação: placeholder padrão + teste de vidro abaixo.
 */
const EducationPage: React.FC<EducationPageProps> = ({ title }) => {
  return (
    <div className="education-page">
      <section className="page-placeholder">
        <h2>{title}</h2>
      </section>
      <OpaqueBoxTest />
    </div>
  );
};

export default EducationPage;
