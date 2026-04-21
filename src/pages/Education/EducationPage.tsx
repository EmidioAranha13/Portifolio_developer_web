import { useMemo } from "react";
import TreeRail, {
  type TreeRailEntry,
  type TreeRailLeafLine,
  type TreeRailSide,
} from "../../componentes/TreeRail/TreeRail";
import type { EducationActivity, EducationLeafLabels, InfoTexts } from "../../utils/infoTextsCollection";
import "./EducationPage.css";

type EducationPageProps = {
  title: string;
  infoTexts: InfoTexts;
};

const LEAF_BODY_FIELD_ORDER: (keyof EducationLeafLabels)[] = [
  "institution",
  "degree",
  "period",
  "location",
  "description",
  "scholar",
  "extra",
];

function slug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function activityToLeafLines(activity: EducationActivity, leafLabels: EducationLeafLabels): TreeRailLeafLine[] {
  const lines: TreeRailLeafLine[] = [];
  for (const key of LEAF_BODY_FIELD_ORDER) {
    const value = activity[key].trim();
    if (!value) continue;
    lines.push({ label: leafLabels[key], value });
  }
  return lines;
}

function toTreeEntries(infoTexts: InfoTexts): TreeRailEntry[] {
  const educationPage = infoTexts.education_page;
  const educationItems = educationPage?.education ?? [];
  const leafLabels = educationPage?.leafLabels;
  const entries: TreeRailEntry[] = [];
  let activityCount = 0;

  educationItems.forEach((item, yearIndex) => {
    entries.push({
      id: `root-${item.year}-${yearIndex}`,
      kind: "root",
      label: String(item.year),
    });

    item.activities.forEach((activity, activityIndex) => {
      const side: TreeRailSide = activityCount % 2 === 0 ? "right" : "left";
      const endedKey = slug(activity.ended || `act-${activityIndex}`);
      const title = activity.title.trim();
      const leafBody = leafLabels ? activityToLeafLines(activity, leafLabels) : [];
      entries.push({
        id: `knot-${item.year}-${endedKey}-${activityIndex}`,
        kind: "knot",
        label: activity.ended.trim(),
        side,
        leafTitle: title || undefined,
        leafBody,
      });
      activityCount += 1;
    });
  });

  return entries;
}

/**
 * Página Formação: rail em árvore de formações.
 */
const EducationPage: React.FC<EducationPageProps> = ({ title, infoTexts }) => {
  const entries = useMemo(() => toTreeEntries(infoTexts), [infoTexts]);

  return (
    <div className="education-page">
      <TreeRail
        heading={
          <div className="education-page__heading glass-surface">
            <h2 className="education-page__title">{title}</h2>
          </div>
        }
        entries={entries}
      />
    </div>
  );
};

export default EducationPage;
