import fs from "fs";
import path from "path";

const SRC = "src/utils/infoTextsCollection.tsx";
const OUT = "src/utils/infoTextsCollection";
const lines = fs.readFileSync(SRC, "utf8").split(/\r?\n/);

const pages = [
  { key: "profile_page", file: "profile_page.tsx", br: [309, 336], en: [1126, 1153], ja: [1938, 1965] },
  { key: "experience_page", file: "experience_page.tsx", br: [337, 471], en: [1154, 1283], ja: [1966, 2095] },
  { key: "education_page", file: "education_page.tsx", br: [472, 580], en: [1284, 1392], ja: [2096, 2204] },
  { key: "skill_page", file: "skill_page.tsx", br: [581, 964], en: [1393, 1776], ja: [2205, 2587] },
  { key: "certificate_page", file: "certificate_page.tsx", br: [965, 1029], en: [1777, 1841], ja: [2588, 2652] },
  { key: "projects_page", file: "projects_page.tsx", br: [1030, 1065], en: [1842, 1877], ja: [2653, 2688] },
  { key: "contactme_page", file: "contactme_page.tsx", br: [1066, 1109], en: [1878, 1932], ja: [2689, 2732] },
];

function unwrapBlock(start, end) {
  const slice = lines.slice(start - 1, end);
  const first = slice[0];
  const m = first.match(/^(\s+)\w+_page:\s*\{/);
  if (!m) throw new Error(`Bad start at ${start}: ${first}`);
  const baseIndent = m[1].length;
  const inner = slice.slice(1, -1).map((line) => {
    if (line.length <= baseIndent) return line.trimEnd();
    return line.slice(baseIndent);
  });
  return inner.join("\n");
}

fs.mkdirSync(path.join(OUT, "shared"), { recursive: true });

for (const page of pages) {
  const brBody = unwrapBlock(page.br[0], page.br[1]);
  const enBody = unwrapBlock(page.en[0], page.en[1]);
  const jaBody = unwrapBlock(page.ja[0], page.ja[1]);
  const imports = [];
  if (page.file === "skill_page.tsx") {
    imports.push("import type { SkillPageSkill } from \"../Types\";");
  }
  if (page.file === "certificate_page.tsx") {
    imports.push("import type { CertificateItem } from \"../Types\";");
  }
  if (page.file === "projects_page.tsx") {
    imports.push(
      "import { PROJECTS_BR, PROJECTS_EN, PROJECTS_JA } from \"./shared/projectsData\";",
    );
  }
  const content = `${imports.join("\n")}${imports.length ? "\n\n" : ""}export const ${page.key} = {\n  br: {\n${brBody}\n  },\n  en: {\n${enBody}\n  },\n  ja: {\n${jaBody}\n  },\n} as const;\n`;
  fs.writeFileSync(path.join(OUT, page.file), content, "utf8");
  console.log("Wrote", page.file);
}

function unwrapGlobals(start, end) {
  const slice = lines.slice(start - 1, end);
  return slice.map((l) => l.replace(/^ {4}/, "")).join("\n");
}

const globalsBr = unwrapGlobals(295, 308);
const globalsEn = unwrapGlobals(1112, 1125);
const globalsJa = unwrapGlobals(1923, 1937);

fs.writeFileSync(
  path.join(OUT, "globals.ts"),
  `export const globals = {\n  br: {\n${globalsBr}\n  },\n  en: {\n${globalsEn}\n  },\n  ja: {\n${globalsJa}\n  },\n} as const;\n`,
);

const sharedHeader = 'import type { Project, ProjectImageKey } from "../Types";\n\n';
const sharedBody = lines.slice(12, 291).join("\n");
fs.writeFileSync(
  path.join(OUT, "shared/projectsData.ts"),
  `${sharedHeader}${sharedBody}\n`,
);

console.log("Done");
