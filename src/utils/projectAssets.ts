import type {
  Project,
  ProjectScreenAssets,
  ProjectScreenItem,
  ProjectScreenPlatform,
  ProjectWithImage,
} from "./Types";
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

const webScreenshotModules = import.meta.glob<string>(
  "../assets/projects/*/web/*.{png,jpg,jpeg,webp}",
  { eager: true, import: "default" },
);

const mobileScreenshotModules = import.meta.glob<string>(
  "../assets/projects/*/mobile/*.{png,jpg,jpeg,webp}",
  { eager: true, import: "default" },
);

/** Imagem padrão quando não há asset em `projects/{id}/`. */
export const PROJECT_DEFAULT_IMAGE = projectDefault;

const isHeaderAssetPath = (path: string): boolean => {
  const lower = path.toLowerCase();
  return lower.includes("/cabeçalho.") || lower.includes("/cabecalho.");
};

const parseProjectId = (path: string): number | null => {
  const match = path.match(/\/projects\/(\d+)\//);
  if (!match) return null;
  const id = Number.parseInt(match[1], 10);
  return Number.isNaN(id) ? null : id;
};

const parseScreenshotIndex = (path: string): number => {
  const match = path.match(/screenshot_(\d+)\./i);
  if (!match) return Number.MAX_SAFE_INTEGER;
  const index = Number.parseInt(match[1], 10);
  return Number.isNaN(index) ? Number.MAX_SAFE_INTEGER : index;
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

const sortScreenshotEntries = (
  items: { path: string; index: number; url: string }[],
): readonly string[] =>
  items
    .sort((a, b) => {
      if (a.index !== b.index) return a.index - b.index;
      return a.path.localeCompare(b.path);
    })
    .map((item) => item.url);

const buildScreenshotsByProjectId = (
  modules: Record<string, string>,
  platform: ProjectScreenPlatform,
): ReadonlyMap<number, readonly string[]> => {
  const byId = new Map<number, { path: string; index: number; url: string }[]>();

  for (const [path, url] of Object.entries(modules)) {
    const id = parseProjectId(path);
    if (id === null || !path.includes(`/${platform}/`)) continue;

    const list = byId.get(id) ?? [];
    list.push({ path, index: parseScreenshotIndex(path), url });
    byId.set(id, list);
  }

  return new Map(
    [...byId.entries()].map(([id, items]) => [id, sortScreenshotEntries(items)]),
  );
};

const PROJECT_COVERS = buildCoverByProjectId();
const PROJECT_HEADERS = buildHeaderByProjectId();
const PROJECT_WEB_SCREENSHOTS = buildScreenshotsByProjectId(webScreenshotModules, "web");
const PROJECT_MOBILE_SCREENSHOTS = buildScreenshotsByProjectId(
  mobileScreenshotModules,
  "mobile",
);

const mapUrlsToScreens = (urls: readonly string[]): ProjectScreenItem[] =>
  urls.map((src) => ({ src }));

const resolveScreenAssets = (projectId: number): ProjectScreenAssets => ({
  web: mapUrlsToScreens(PROJECT_WEB_SCREENSHOTS.get(projectId) ?? []),
  mobile: mapUrlsToScreens(PROJECT_MOBILE_SCREENSHOTS.get(projectId) ?? []),
});

/** Capa do card do carrossel (`projects/{id}/capa.*`). */
export const getProjectCoverUrl = (projectId: number): string =>
  PROJECT_COVERS.get(projectId) ?? PROJECT_DEFAULT_IMAGE;

/** Cabeçalho do modal (`projects/{id}/cabeçalho.*` ou `cabecalho.*`). */
export const getProjectHeaderUrl = (projectId: number): string =>
  PROJECT_HEADERS.get(projectId) ?? PROJECT_DEFAULT_IMAGE;

/** Screenshots do modal (`projects/{id}/{platform}/`), ordenados por `screenshot_n`. */
export const getProjectScreenAssets = (projectId: number): ProjectScreenAssets =>
  resolveScreenAssets(projectId);

/** Aplica capa, cabeçalho e telas a partir de `assets/projects/{id}/`. */
export const enrichProjectWithAssets = (project: Project): ProjectWithImage => ({
  ...project,
  imageSrc: getProjectCoverUrl(project.id),
  headerImageSrc: getProjectHeaderUrl(project.id),
  screenAssets: getProjectScreenAssets(project.id),
});
