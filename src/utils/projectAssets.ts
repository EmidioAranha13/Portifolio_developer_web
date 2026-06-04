import type { Project, ProjectScreenItem, ProjectWithImage } from "./Types";
import projectDefault from "../assets/experience/default.jpg";

const COVER_EXT_ORDER = [".jpg", ".jpeg", ".png", ".webp"] as const;

const coverModules = import.meta.glob<string>("../assets/projects/*/capa.*", {
  eager: true,
  import: "default",
});

const headerModules = {
  ...import.meta.glob<string>("../assets/projects/*/cabeçalho.*", {
    eager: true,
    import: "default",
  }),
  ...import.meta.glob<string>("../assets/projects/*/cabecalho.*", {
    eager: true,
    import: "default",
  }),
};

const screenshotModules = import.meta.glob<string>(
  "../assets/projects/*/screenshot_*.*",
  { eager: true, import: "default" },
);

/** Imagem padrão quando não há asset em `projects/{id}/`. */
export const PROJECT_DEFAULT_IMAGE = projectDefault;

const isHeaderAssetPath = (path: string): boolean => {
  const lower = path.toLowerCase();
  return lower.includes("/cabeçalho.") || lower.includes("/cabecalho.");
};

const DEFAULT_PROJECT_SCREEN_PLACEHOLDERS: ProjectScreenItem[] = [{}, {}, {}];

const parseProjectId = (path: string): number | null => {
  const match = path.match(/\/projects\/(\d+)\//);
  if (!match) return null;
  const id = Number.parseInt(match[1], 10);
  return Number.isNaN(id) ? null : id;
};

const parseScreenshotIndex = (path: string): number | null => {
  const match = path.match(/screenshot_(\d+)\./i);
  if (!match) return null;
  const index = Number.parseInt(match[1], 10);
  return Number.isNaN(index) ? null : index;
};

const coverExtRank = (path: string): number => {
  const lower = path.toLowerCase();
  const rank = COVER_EXT_ORDER.findIndex((ext) => lower.endsWith(ext));
  return rank === -1 ? COVER_EXT_ORDER.length : rank;
};

const buildCoverByProjectId = (): ReadonlyMap<number, string> => {
  const byId = new Map<number, { path: string; url: string }>();

  for (const [path, url] of Object.entries(coverModules)) {
    const id = parseProjectId(path);
    if (id === null || !path.includes("/capa.")) continue;

    const current = byId.get(id);
    if (!current || coverExtRank(path) < coverExtRank(current.path)) {
      byId.set(id, { path, url });
    }
  }

  return new Map([...byId.entries()].map(([id, { url }]) => [id, url]));
};

const buildHeaderByProjectId = (): ReadonlyMap<number, string> => {
  const byId = new Map<number, { path: string; url: string }>();

  for (const [path, url] of Object.entries(headerModules)) {
    const id = parseProjectId(path);
    if (id === null || !isHeaderAssetPath(path)) continue;

    const current = byId.get(id);
    if (!current || coverExtRank(path) < coverExtRank(current.path)) {
      byId.set(id, { path, url });
    }
  }

  return new Map([...byId.entries()].map(([id, { url }]) => [id, url]));
};

const buildScreenshotsByProjectId = (): ReadonlyMap<number, readonly string[]> => {
  const byId = new Map<number, { index: number; url: string }[]>();

  for (const [path, url] of Object.entries(screenshotModules)) {
    const id = parseProjectId(path);
    const index = parseScreenshotIndex(path);
    if (id === null || index === null) continue;

    const list = byId.get(id) ?? [];
    list.push({ index, url });
    byId.set(id, list);
  }

  return new Map(
    [...byId.entries()].map(([id, items]) => [
      id,
      items
        .sort((a, b) => a.index - b.index)
        .map((item) => item.url),
    ]),
  );
};

const PROJECT_COVERS = buildCoverByProjectId();
const PROJECT_HEADERS = buildHeaderByProjectId();
const PROJECT_SCREENSHOTS = buildScreenshotsByProjectId();

/** Capa do card do carrossel (`projects/{id}/capa.*`). */
export const getProjectCoverUrl = (projectId: number): string =>
  PROJECT_COVERS.get(projectId) ?? PROJECT_DEFAULT_IMAGE;

/** Cabeçalho do modal (`projects/{id}/cabeçalho.*` ou `cabecalho.*`). */
export const getProjectHeaderUrl = (projectId: number): string =>
  PROJECT_HEADERS.get(projectId) ?? PROJECT_DEFAULT_IMAGE;

/** Telas do modal (`projects/{id}/screenshot_n.*`), ordenadas por `n`. */
export const getProjectScreenshotUrls = (projectId: number): readonly string[] =>
  PROJECT_SCREENSHOTS.get(projectId) ?? [];

const resolveProjectScreens = (project: Project): ProjectScreenItem[] => {
  const fromAssets = getProjectScreenshotUrls(project.id);
  if (fromAssets.length > 0) {
    return fromAssets.map((src) => ({ src }));
  }
  if (project.screens.length > 0) {
    return project.screens;
  }
  return DEFAULT_PROJECT_SCREEN_PLACEHOLDERS.map((screen) => ({ ...screen }));
};

/** Aplica capa e telas a partir de `assets/projects/{id}/` (ou defaults). */
export const enrichProjectWithAssets = (project: Project): ProjectWithImage => ({
  ...project,
  imageSrc: getProjectCoverUrl(project.id),
  headerImageSrc: getProjectHeaderUrl(project.id),
  screens: resolveProjectScreens(project),
});
