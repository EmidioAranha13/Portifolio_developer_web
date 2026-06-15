import type { CSSProperties } from "react";
import type { SkillBadgeKey, SkillCardLine, SkillPageSkill } from "./Types";

const SKILL_LINE_VAR: Record<SkillCardLine, string> = {
  frontend: "--skill-line-frontend",
  backend: "--skill-line-backend",
  mobile: "--skill-line-mobile",
  devops: "--skill-line-devops",
  design: "--skill-line-design",
  management: "--skill-line-management",
  database: "--skill-line-database",
  tools: "--skill-line-tools",
};

const normalizeTechLabel = (value: string): string =>
  value.trim().toLowerCase().replace(/\s+/g, " ");

/** Rótulos de `projects[].technologies` → badge da skill (independente do idioma do título). */
const TECH_LABEL_TO_BADGE: Record<string, SkillBadgeKey> = {
  react: "react",
  "react native": "react_native",
  expo: "react_native",
  javascript: "javascript",
  typescript: "typescript",
  html: "html",
  css: "css",
  redux: "redux",
  "material ui": "material_ui",
  bootstrap: "bootstrap",
  handlebars: "handlebars",
  "style dictionary": "style_dictionary",
  "styled components": "styled_components",
  "unstyled components": "styled_components",
  "node.js": "node",
  node: "node",
  express: "express",
  sequelize: "sequelize",
  "api rest": "rest_api",
  rest: "rest_api",
  graphql: "graphql",
  "spring boot": "spring_boot",
  docker: "docker",
  aws: "aws",
  figma: "figma",
  sql: "sql",
  mysql: "mysql",
  mssql: "mssql",
  postgresql: "postgresql",
  "android studio": "android_studio",
  kotlin: "kotlin",
  "jetpack compose": "jetpack_compose",
  java: "java",
  "c / c++ / c#": "c_family",
  rust: "rust",
  python: "python",
  git: "git_github",
  github: "git_github",
  gitlab: "git_github",
  bpmn: "bpmn",
  uml: "uml",
  storybook: "storybook",
  pandas: "pandas",
  jest: "jest",
  vite: "vite",
  yarn: "yarn",
  agile: "agile",
  scrum: "agile",
  kanban: "agile",
};

const splitSkillTitleParts = (title: string): string[] =>
  title.split(/\s*[+&,|]\s*/i).map((part) => normalizeTechLabel(part));

const resolveSkillByBadge = (
  badge: SkillBadgeKey,
  skills: readonly SkillPageSkill[],
): SkillPageSkill | null => {
  for (const skill of skills) {
    if (skill.badges?.includes(badge)) return skill;
  }
  return null;
};

/**
 * Encontra a skill de `skill_page` correspondente a uma tag de tecnologia do projeto.
 * Mesma regra usada nas cores das tags do modal e na contagem “Em projetos”.
 */
export const resolveSkillForTech = (
  tech: string,
  skills: readonly SkillPageSkill[],
): SkillPageSkill | null => {
  const normalized = normalizeTechLabel(tech);
  if (!normalized) return null;

  for (const skill of skills) {
    if (normalizeTechLabel(skill.title) === normalized) {
      return skill;
    }
  }

  for (const skill of skills) {
    const parts = splitSkillTitleParts(skill.title);
    if (parts.some((part) => part === normalized)) {
      return skill;
    }
  }

  const badge = TECH_LABEL_TO_BADGE[normalized];
  if (badge) {
    return resolveSkillByBadge(badge, skills);
  }

  return null;
};

/**
 * Resolve linhas de stack (frontend, backend, …) para um rótulo de tecnologia do projeto,
 * usando os títulos de `skill_page.skills` como fonte.
 */
export const resolveSkillLinesForTech = (
  tech: string,
  skills: readonly SkillPageSkill[],
): SkillCardLine[] => {
  const skill = resolveSkillForTech(tech, skills);
  return skill ? [...new Set(skill.types)] : [];
};

export type ProjectTechnologiesSource = {
  technologies: readonly string[];
};

/**
 * Conta em quantos projetos cada skill aparece em `projects[].technologies`
 * (no máximo +1 por projeto, mesmo com várias tags da mesma skill).
 */
export const countProjectsBySkillTitle = (
  skills: readonly SkillPageSkill[],
  projects: readonly ProjectTechnologiesSource[],
): Readonly<Record<string, number>> => {
  const counts: Record<string, number> = {};
  for (const skill of skills) {
    counts[skill.title] = 0;
  }

  for (const project of projects) {
    const credited = new Set<string>();
    for (const tech of project.technologies) {
      const skill = resolveSkillForTech(tech, skills);
      if (!skill || credited.has(skill.title)) continue;
      credited.add(skill.title);
      counts[skill.title] += 1;
    }
  }

  return counts;
};

const lineToCssColor = (line: SkillCardLine): string => `var(${SKILL_LINE_VAR[line]})`;

/**
 * Fundo da tag: uma cor ou divisão horizontal 50/50 (e N partes iguais para 3+ stacks).
 */
export const buildTechTagBackground = (lines: readonly SkillCardLine[]): string | null => {
  if (lines.length === 0) return null;
  const colors = lines.map(lineToCssColor);
  if (colors.length === 1) return colors[0];

  const step = 100 / colors.length;
  const stops: string[] = [];
  colors.forEach((color, index) => {
    const start = (index * step).toFixed(4);
    const end = ((index + 1) * step).toFixed(4);
    stops.push(`${color} ${start}%`, `${color} ${end}%`);
  });
  return `linear-gradient(90deg, ${stops.join(", ")})`;
};

export const getTechTagStyle = (
  tech: string,
  skills: readonly SkillPageSkill[],
): CSSProperties => {
  const lines = resolveSkillLinesForTech(tech, skills);
  const background = buildTechTagBackground(lines);

  if (!background) {
    return {};
  }

  return {
    background,
    borderColor: "color-mix(in srgb, #fff 28%, transparent)",
    boxShadow:
      "0 2px 8px color-mix(in srgb, #000 22%, transparent), inset 0 1px 0 color-mix(in srgb, #fff 18%, transparent)",
  };
};
