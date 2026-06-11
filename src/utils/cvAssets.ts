import type { InfoTextsLanguage } from "./infoTextsCollection";

const cvModules = import.meta.glob<string>("../assets/cv/**/*.pdf", {
  eager: true,
  import: "default",
});

const pathBasename = (path: string): string => {
  const segments = path.split("/");
  return decodeURIComponent(segments[segments.length - 1] ?? "");
};

/** Resolve URL do PDF em `assets/cv/{idioma}/{filename}`. */
export const getCvDownloadUrl = (
  languageKey: InfoTextsLanguage,
  filename: string,
): string | null => {
  const trimmed = filename.trim();
  if (!trimmed) return null;

  const folder = `/cv/${languageKey}/`;

  for (const [path, url] of Object.entries(cvModules)) {
    if (!path.includes(folder)) continue;
    if (pathBasename(path) === trimmed) return url;
  }

  return null;
};
