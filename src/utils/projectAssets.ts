import type { ProjectImageKey } from "./Types";
import projectDefault from "../assets/projects/default.jpg";
import project1 from "../assets/projects/Delta/project_1.png";
import project3 from "../assets/projects/Delta/project_3.png";
import project4 from "../assets/projects/Delta/project_4.png";
import project7 from "../assets/projects/Delta/project_7.png";
import project8 from "../assets/projects/Delta/project_8.png";
import project9 from "../assets/projects/Delta/project_9.png";
import project10 from "../assets/projects/Delta/project_10.png";
import project11 from "../assets/projects/Delta/project_11.png";
import project12 from "../assets/projects/Delta/project_12.png";

/** Capa padrão do carrossel quando o card não define `img`. */
export const PROJECT_DEFAULT_IMAGE = projectDefault;

/** Fallback para chaves de projeto ainda sem asset dedicado. */
const PROJECT_IMAGE_FALLBACK = project1;

/** Mapa chave → URL da imagem de capa do projeto. */
export const PROJECT_IMAGES: Record<ProjectImageKey, string> = {
  project_1: project1,
  project_2: PROJECT_IMAGE_FALLBACK,
  project_3: project3,
  project_4: project4,
  project_5: PROJECT_IMAGE_FALLBACK,
  project_6: PROJECT_IMAGE_FALLBACK,
  project_7: project7,
  project_8: project8,
  project_9: project9,
  project_10: project10,
  project_11: project11,
  project_12: project12,
};
