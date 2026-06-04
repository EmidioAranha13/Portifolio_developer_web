import type { CSSProperties } from "react";
import type { SkillCardLine, SkillPageSkill } from "./Types";

const SKILL_LINE_VAR: Record<SkillCardLine, string> = {
  frontend: "--skill-line-frontend",
  backend: "--skill-line-backend",
  mobile: "--skill-line-mobile",
  devops: "--skill-line-devops",
  design: "--skill-line-design",
  management: "--skill-line-management",
  database: "--skill-line-database",
};

const normalizeTechLabel = (value: string): string =>
  value.trim().toLowerCase().replace(/\s+/g, " ");

const splitSkillTitleParts = (title: string): string[] =>
  title.split(/\s*[+&,|]\s*/i).map((part) => normalizeTechLabel(part));

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
