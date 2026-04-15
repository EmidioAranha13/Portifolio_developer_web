import TreeRail, { type TreeRailEntry } from "../../componentes/TreeRail/TreeRail";
import "./EducationPage.css";

type EducationPageProps = {
  title: string;
};

const TREE_RAIL_EXAMPLE: TreeRailEntry[] = [
  { id: "root-2016", kind: "root", label: "2016" },
  {
    id: "knot-mai",
    kind: "knot",
    label: "Mai",
    side: "right",
    leafTitle: "N1",
  },
  {
    id: "knot-set",
    kind: "knot",
    label: "Set",
    side: "left",
    leafTitle: "N2",
  },
  { id: "root-2022", kind: "root", label: "2022" },
  {
    id: "knot-jul",
    kind: "knot",
    label: "Jul",
    side: "right",
    leafTitle: "N3",
  },
  {
    id: "knot-out",
    kind: "knot",
    label: "Out",
    side: "left",
    leafTitle: "N4",
  },
];

/**
 * Página Formação: rail em árvore de formações.
 */
const EducationPage: React.FC<EducationPageProps> = ({ title }) => {
  return (
    <div className="education-page">
      <TreeRail
        heading={
          <div className="education-page__heading glass-surface">
            <h2 className="education-page__title">{title}</h2>
          </div>
        }
        entries={TREE_RAIL_EXAMPLE}
      />
    </div>
  );
};

export default EducationPage;
