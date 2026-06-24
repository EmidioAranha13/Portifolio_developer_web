import type {
  Project,
  ProjectDocItem,
  ProjectDocKind,
  ProjectScreenAssets,
  ProjectScreenItem,
  ProjectScreenshotPlatform,
  ProjectWithImage,
} from "./Types";
import projectDefault from "../assets/experience/default.jpg";

const COVER_EXT_ORDER = [".jpg", ".jpeg", ".png", ".webp"] as const;
const coverModules = import.meta.glob<string>("../assets/projects/*/capa.*", {
  eager: true,
  import: "default",
});
const coverMobileModules = import.meta.glob<string>("../assets/projects/*/capa_mobile.*", {
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

const mobileCaseModules = import.meta.glob<string>(
  "../assets/projects/*/mobile/case.*",
  { eager: true, import: "default" },
);

const projectDocumentModules = import.meta.glob<string>(
  "../assets/projects/*/docs/*.{pdf,ppt,pptx,odp}",
  { eager: true, import: "default" },
);

const projectDocumentPreviewModules = import.meta.glob<string>(
  "../assets/projects/*/docs/*.{png,jpg,jpeg,webp}",
  { eager: true, import: "default" },
);

const DOCUMENT_FILE_PATTERN = /\.(pdf|pptx?|odp)$/i;
const DOCUMENT_PREVIEW_PATTERN = /\.(png|jpe?g|webp)$/i;

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

const isMobileCaseAssetPath = (path: string): boolean =>
  /\/mobile\/case\.(png|jpe?g|webp)$/i.test(path);

const isProjectDocumentPath = (path: string): boolean =>
  /\/docs\//i.test(path) && DOCUMENT_FILE_PATTERN.test(path);

const isProjectDocumentPreviewPath = (path: string): boolean =>
  /\/docs\//i.test(path) && DOCUMENT_PREVIEW_PATTERN.test(path);

const getPathBasename = (path: string): string => {
  const filename = path.split("/").pop() ?? path;
  return filename.replace(/\.[^.]+$/, "");
};

const resolveDocumentKind = (path: string): ProjectDocKind =>
  /\.pdf$/i.test(path) ? "pdf" : "slides";

const parseDocumentIndex = (path: string): number => {
  const filename = path.split("/").pop() ?? "";
  const match = filename.match(/^document_(\d+)\./i);
  if (!match) return Number.MAX_SAFE_INTEGER;
  const index = Number.parseInt(match[1], 10);
  return Number.isNaN(index) ? Number.MAX_SAFE_INTEGER : index;
};

const formatDocumentTitle = (basename: string): string =>
  basename
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const coverExtRank = (path: string): number => {
  const lower = path.toLowerCase();
  const rank = COVER_EXT_ORDER.findIndex((ext) => lower.endsWith(ext));
  return rank === -1 ? COVER_EXT_ORDER.length : rank;
};

const buildCoverByProjectId = (
  modules: Record<string, string>,
  coverToken: string,
): ReadonlyMap<number, string> => {
  const byId = new Map<number, { path: string; url: string }>();

  for (const [path, url] of Object.entries(modules)) {
    const id = parseProjectId(path);
    if (id === null || !path.includes(coverToken)) continue;

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
  platform: ProjectScreenshotPlatform,
): ReadonlyMap<number, readonly string[]> => {
  const byId = new Map<number, { path: string; index: number; url: string }[]>();

  for (const [path, url] of Object.entries(modules)) {
    const id = parseProjectId(path);
    if (id === null || !path.includes(`/${platform}/`)) continue;
    if (platform === "mobile" && isMobileCaseAssetPath(path)) continue;

    const list = byId.get(id) ?? [];
    list.push({ path, index: parseScreenshotIndex(path), url });
    byId.set(id, list);
  }

  return new Map(
    [...byId.entries()].map(([id, items]) => [id, sortScreenshotEntries(items)]),
  );
};

const PROJECT_COVERS = buildCoverByProjectId(coverModules, "/capa.");
const PROJECT_MOBILE_COVERS = buildCoverByProjectId(coverMobileModules, "/capa_mobile.");
const PROJECT_HEADERS = buildHeaderByProjectId();
const PROJECT_WEB_SCREENSHOTS = buildScreenshotsByProjectId(webScreenshotModules, "web");
const PROJECT_MOBILE_SCREENSHOTS = buildScreenshotsByProjectId(
  mobileScreenshotModules,
  "mobile",
);

const PROJECT_MOBILE_CASES = buildCoverByProjectId(mobileCaseModules, "/case.");

const buildProjectDocsByProjectId = (): ReadonlyMap<number, readonly ProjectDocItem[]> => {
  const previewsByProject = new Map<number, Map<string, string>>();
  const documentsByProject = new Map<
    number,
    { path: string; index: number; basename: string; url: string }[]
  >();

  const projectDocModules = {
    ...projectDocumentModules,
    ...projectDocumentPreviewModules,
  };

  for (const [path, url] of Object.entries(projectDocModules)) {
    const id = parseProjectId(path);
    if (id === null || !path.includes("/docs/")) continue;

    if (isProjectDocumentPreviewPath(path)) {
      const byBasename = previewsByProject.get(id) ?? new Map<string, string>();
      byBasename.set(getPathBasename(path).toLowerCase(), url);
      previewsByProject.set(id, byBasename);
      continue;
    }

    if (!isProjectDocumentPath(path)) continue;

    const list = documentsByProject.get(id) ?? [];
    const basename = getPathBasename(path);
    list.push({
      path,
      index: parseDocumentIndex(path),
      basename,
      url,
    });
    documentsByProject.set(id, list);
  }

  return new Map(
    [...documentsByProject.entries()].map(([id, items]) => [
      id,
      items
        .sort((a, b) => {
          if (a.index !== b.index) return a.index - b.index;
          return a.path.localeCompare(b.path);
        })
        .map((item) => {
          const previewSrc = previewsByProject
            .get(id)
            ?.get(item.basename.toLowerCase());
          return {
            title: formatDocumentTitle(item.basename),
            src: item.url,
            kind: resolveDocumentKind(item.path),
            ...(previewSrc ? { previewSrc } : {}),
          };
        }),
    ]),
  );
};

const PROJECT_DOCS = buildProjectDocsByProjectId();

const mapUrlsToScreens = (urls: readonly string[]): ProjectScreenItem[] =>
  urls.map((src) => ({ src }));

const resolveScreenAssets = (projectId: number): ProjectScreenAssets => ({
  web: mapUrlsToScreens(PROJECT_WEB_SCREENSHOTS.get(projectId) ?? []),
  mobile: mapUrlsToScreens(PROJECT_MOBILE_SCREENSHOTS.get(projectId) ?? []),
});

/** Capa do card do carrossel (`capa.*` no web e `capa_mobile.*` no mobile). */
export const getProjectCoverUrl = (
  projectId: number,
  platform: ProjectScreenshotPlatform = "web",
): string => {
  if (platform === "mobile") {
    return PROJECT_MOBILE_COVERS.get(projectId) ?? PROJECT_COVERS.get(projectId) ?? PROJECT_DEFAULT_IMAGE;
  }
  return PROJECT_COVERS.get(projectId) ?? PROJECT_DEFAULT_IMAGE;
};

/** Cabeçalho do modal (`projects/{id}/cabeçalho.*` ou `cabecalho.*`). */
export const getProjectHeaderUrl = (projectId: number): string =>
  PROJECT_HEADERS.get(projectId) ?? PROJECT_DEFAULT_IMAGE;

/** Screenshots do modal (`projects/{id}/{platform}/`), ordenados por `screenshot_n`. */
export const getProjectScreenAssets = (projectId: number): ProjectScreenAssets =>
  resolveScreenAssets(projectId);

/** Moldura mobile (`projects/{id}/mobile/case.*`) para telas do modal. */
export const getProjectMobileCaseUrl = (projectId: number): string | undefined =>
  PROJECT_MOBILE_CASES.get(projectId);

/** Documentos do modal (`projects/{id}/docs/`). */
export const getProjectDocAssets = (projectId: number): readonly ProjectDocItem[] =>
  PROJECT_DOCS.get(projectId) ?? [];

/** Aplica capa, cabeçalho e telas a partir de `assets/projects/{id}/`. */
export const enrichProjectWithAssets = (
  project: Project,
  coverPlatform: ProjectScreenshotPlatform = "web",
): ProjectWithImage => ({
  ...project,
  imageSrc: getProjectCoverUrl(project.id, coverPlatform),
  headerImageSrc: getProjectHeaderUrl(project.id),
  screenAssets: getProjectScreenAssets(project.id),
  mobileCaseSrc: getProjectMobileCaseUrl(project.id),
  docAssets: getProjectDocAssets(project.id),
});
