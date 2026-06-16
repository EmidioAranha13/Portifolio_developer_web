import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  PropsWithChildren,
  ReactNode,
  RefObject,
} from "react";

/**
 * Identificador de cada aba/seção do portfólio na navegação principal.
 * Espelha o estado Redux `activeSection` e as chaves dos textos de aba.
 *
 * **Usado em:** `App.tsx` (títulos por seção), `store/uiSlice.tsx` (estado e action `setActiveSection`),
 * `StyledHeader.tsx` (cliques nas abas), e dentro de `StyledHeaderProps`.
 */
export type SectionKey =
  | "about"
  | "education"
  | "experience"
  | "skills"
  | "certifications"
  | "projects"
  | "contact";

/**
 * Código do idioma ativo (PT-BR, EN, JA) no seletor e no estado global do App.
 *
 * **Usado em:** `App.tsx`, `LanguageSelector.tsx`, `StyledHeaderProps` / `StyledHeader.tsx`
 * (reexportado por `LanguageSelector` para imports legados).
 */
export type LanguageCode = "BR" | "EN" | "JA";

/**
 * Variante visual do filtro SVG das bolhas “liquid glass” no fundo.
 *
 * **Usado em:** `App.tsx` (estado `preset` e atalhos), `LiquidGlassBallsProps` / `LiquidGlassBalls.tsx`.
 */
export type GlassPreset = "soft" | "crystal" | "liquid-strong";

/**
 * Tema claro ou escuro da interface (persistido em `localStorage` no App).
 *
 * **Usado em:** `App.tsx`, `LoadingScreenProps`, `ThemeToggle.tsx`, `ThemeToggleProps`,
 * `StyledHeaderProps`, e tipos que referenciam callbacks de tema.
 */
export type ThemeMode = "day" | "night";

/**
 * Uma formação/atividade acadêmica na linha do tempo (dados por idioma em `infoTextsCollection`).
 *
 * **Usado em:** `infoTextsCollection.tsx` (estrutura `education`), `EducationPage.tsx` (mapeamento para o TreeRail).
 */
export type EducationActivity = {
  title: string;
  institution: string;
  degree: string;
  period: string;
  location: string;
  /** Valor exibido no knot (ex.: mês ou marco temporal). */
  ended: string;
  description: string;
  scholar: string;
  extra: string;
};

/**
 * Agrupa atividades de um ano na timeline de educação.
 *
 * **Usado em:** `infoTextsCollection.tsx` (array `education`), `EducationPage.tsx`.
 */
export type EducationYearEntry = {
  year: number;
  activities: EducationActivity[];
};

/**
 * Rótulos traduzidos para os campos exibidos nas folhas do TreeRail na página de educação.
 *
 * **Usado em:** `EducationPage.tsx` (ordem dos campos e `activityToLeafLines`).
 */
export type EducationLeafLabels = {
  institution: string;
  degree: string;
  period: string;
  location: string;
  description: string;
  scholar: string;
  extra: string;
};

/**
 * Lado em que a folha do timeline aparece em relação à trilha vertical.
 *
 * **Usado em:** `TreeRail.tsx`, `EducationPage.tsx` (alternância esquerda/direita), reexportado por `TreeRail`.
 */
export type TreeRailSide = "left" | "right";

/**
 * Par rótulo + valor em uma linha do corpo da folha no TreeRail.
 *
 * **Usado em:** `TreeRail.tsx` (`TreeRailLeafCard`), `EducationPage.tsx`, reexportado por `TreeRail`.
 */
export type TreeRailLeafLine = {
  label: string;
  value: string;
};

/**
 * Nó da timeline: raiz, nó intermediário ou folha com título/corpo opcional.
 *
 * **Usado em:** `TreeRail.tsx`, `EducationPage.tsx` (`toTreeEntries`), reexportado por `TreeRail`.
 */
export type TreeRailEntry = {
  id: string;
  kind: "root" | "knot";
  label: string;
  side?: TreeRailSide;
  /** Título da folha; linha divisória só entre este bloco e `leafBody`. */
  leafTitle?: string;
  /** Linhas com rótulo + valor (só campos não vazios na origem). */
  leafBody?: TreeRailLeafLine[];
};

/**
 * Props do componente visual `TreeRail` (entradas da timeline + cabeçalho opcional).
 *
 * **Usado em:** `TreeRail.tsx`.
 */
export type TreeRailProps = {
  entries: TreeRailEntry[];
  /** Título (ex.: Formação) — o rail liga-se visualmente a este bloco e mede o topo do spine. */
  heading?: ReactNode;
};

/**
 * Orientação do padrão de setas do componente `ArrowBox`.
 *
 * **Usado em:** `ArrowBoxProps`, `ArrowBox.tsx` (reexportado para consumidores externos).
 */
export type ArrowBoxOrientation = "horizontal" | "vertical";

/**
 * Posição visual do “thumb” na variante scrollbar do `ArrowBox` (topo, meio, fim do percurso).
 *
 * **Usado em:** `ArrowBoxProps`, `ArrowBox.tsx`, `ArrowBoxScrollRail.tsx` (reexportado por `ArrowBox`).
 */
export type ScrollbarThumbPhase = "top" | "middle" | "bottom";

/**
 * Props públicas do componente `ArrowBox` (onda de setas ou coluna de scrollbar).
 *
 * **Usado em:** `ArrowBox.tsx`.
 */
export type ArrowBoxProps = {
  orientation?: ArrowBoxOrientation;
  /** `scrollbar`: coluna densa para o thumb da barra de scroll. */
  verticalVariant?: "hero" | "scrollbar";
  /** Fase do scroll (só `verticalVariant="scrollbar"`). */
  scrollbarScrollPhase?: ScrollbarThumbPhase;
};

/**
 * Props da barra de scroll customizada que envolve o conteúdo principal e sincroniza com o `ArrowBox`.
 *
 * **Usado em:** `ArrowBoxScrollRail.tsx`; instanciado em `App.tsx` (`scrollRootRef`, `contentSyncKey`).
 */
export type ArrowBoxScrollRailPlacement = "viewport" | "local";

export type ArrowBoxScrollRailProps = {
  scrollRootRef: RefObject<HTMLElement | null>;
  contentSyncKey?: string | number;
  /**
   * `viewport`: rail fixo à direita da janela (App).
   * `local`: rail absoluto no pai `position: relative` (ex.: modal).
   */
  placement?: ArrowBoxScrollRailPlacement;
};

/**
 * Props do seletor de idioma em cápsula.
 *
 * **Usado em:** `LanguageSelector.tsx`; valores repassados a partir de `App.tsx` via `StyledHeader`.
 */
export type LanguageSelectorProps = {
  value?: LanguageCode;
  defaultValue?: LanguageCode;
  onChange?: (language: LanguageCode) => void;
};

/**
 * Item da lista fixa de idiomas (código, rótulo e URL da bandeira).
 *
 * **Usado em:** `LanguageSelector.tsx` (constante `OPTIONS`).
 */
export type LanguageOption = {
  code: LanguageCode;
  label: string;
  flagUrl: string;
};

/**
 * Props do fundo animado com bolhas e efeito liquid glass.
 *
 * **Usado em:** `LiquidGlassBalls.tsx`; `App.tsx` passa `children` e `preset`.
 */
export type LiquidGlassBallsProps = {
  children?: ReactNode;
  preset?: GlassPreset;
};

/**
 * Estado de uma bola individual (posição, tamanho, animação) gerado em memória no `LiquidGlassBalls`.
 *
 * **Usado em:** apenas `LiquidGlassBalls.tsx` (`useMemo` que monta o array de bolas).
 */
export type BallConfig = {
  id: number;
  size: number;
  top: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
};

/** Modo do fundo animado da aplicação. */
export type BackgroundBallsMode = "liquid-glass" | "floating-orbit";

/**
 * Props do fundo com bolas estilo {@link LoadingOrbitSpinner} (anel degradê + vidro).
 *
 * **Usado em:** `FloatingBalls.tsx`; alternativa ao `LiquidGlassBalls` em `App.tsx`.
 */
export type FloatingBallsProps = {
  children?: ReactNode;
};

/**
 * Props do overlay de carregamento com animação até liberar o conteúdo.
 *
 * **Usado em:** `LoadingScreen.tsx`; renderizado em `App.tsx` com `onFinish`, `isContentReady`, `themeMode`, etc.
 */
export type LoadingScreenProps = {
  onFinish: () => void;
  isContentReady: boolean;
  mode?: "portfolio" | "experience";
  themeMode?: ThemeMode;
};

/**
 * Props do botão/trilho de alternância visual dia/noite.
 *
 * **Usado em:** `ThemeToggle.tsx`; controlado a partir de `StyledHeader.tsx` e estado em `App.tsx`.
 */
export type ThemeToggleProps = {
  defaultMode?: ThemeMode;
  mode?: ThemeMode;
  onChange?: (mode: ThemeMode) => void;
};

/**
 * Props do toggle de fundo animado (LiquidGlass ↔ BubbleBalls).
 *
 * **Usado em:** `BackgroundBallsToggle.tsx`; controlado em `App.tsx`.
 */
export type BackgroundBallsToggleProps = {
  defaultMode?: BackgroundBallsMode;
  mode?: BackgroundBallsMode;
  onChange?: (mode: BackgroundBallsMode) => void;
};

/**
 * Props do rodapé institucional com texto único.
 *
 * **Usado em:** `StyledFooter.tsx`; `App.tsx` passa `text` (ex.: `footerRights` dos textos).
 */
export type StyledFooterProps = {
  text: string;
  /** Controles opcionais acima do texto (ex.: seletor de fundo). */
  controls?: ReactNode;
};

/**
 * Props do trilho lateral do perfil (anel com imagem + linha + conteúdo).
 *
 * **Usado em:** `ProfileSectionRail.tsx`; composto em `ProfilePage.tsx` nas seções da página.
 */
export type ProfileSectionRailProps = {
  /** URL da imagem dentro do anel (ex.: seta). */
  imageSrc: string;
  imageAlt?: string;
  /** Retrato circular com borda em degradê (default: true). */
  showRing?: boolean;
  /** Linha vertical que acompanha a altura do conteúdo à direita (default: true). */
  showLine?: boolean;
  children: ReactNode;
  className?: string;
};

/**
 * Contrato de props entre `App.tsx` e o cabeçalho com abas, tema e idioma.
 *
 * **Usado em:** `StyledHeader.tsx`; o pai que preenche essas props hoje é `App.tsx`.
 */
export type StyledHeaderProps = {
  themeMode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
  language: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
  tabLabels: Record<SectionKey, string>;
};

/**
 * Props do container de cartão com superfície em vidro (`forwardRef` + atributos de `div`).
 *
 * **Usado em:** `CardBox.tsx`; utilizado em `App.tsx` e `ProfilePage.tsx`.
 */
export type CardBoxProps = PropsWithChildren<{
  className?: string;
}> &
  HTMLAttributes<HTMLDivElement>;

/**
 * Variante visual do botão “bullet” da hero (preenchido ou contorno).
 *
 * **Usado em:** tipo `CustomBulletButtonCommonProps` e `CustomBulletButton.tsx` (via `CustomBulletButtonProps`).
 */
export type CustomBulletButtonVariant = "primary" | "outline";

/**
 * Ícone exibido à direita do rótulo (download ou envio).
 *
 * **Usado em:** tipo `CustomBulletButtonCommonProps` e `CustomBulletButton.tsx`.
 */
export type CustomBulletButtonIcon = "download" | "paperPlane" | "githubRound" | "live";

/**
 * Campos comuns a ambos os ramos do botão (âncora ou botão nativo).
 *
 * **Usado em:** composição de `CustomBulletButtonButtonProps` / `CustomBulletButtonLinkProps` neste arquivo.
 */
export type CustomBulletButtonCommonProps = {
  label: string;
  variant: CustomBulletButtonVariant;
  icon: CustomBulletButtonIcon;
  className?: string;
};

/**
 * Ramo `<button>` da união discriminada (sem `href`).
 *
 * **Usado em:** `CustomBulletButtonProps` e `CustomBulletButton.tsx` (narrowing no ramo botão).
 */
export type CustomBulletButtonButtonProps = CustomBulletButtonCommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
    href?: undefined;
  };

/**
 * Ramo `<a>` da união discriminada (`href` obrigatório).
 *
 * **Usado em:** `CustomBulletButtonProps` e `CustomBulletButton.tsx` (renderização como link).
 */
export type CustomBulletButtonLinkProps = CustomBulletButtonCommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & {
    href: string;
  };

/**
 * Props do botão da hero: ou botão nativo ou link, conforme presença de `href`.
 *
 * **Usado em:** `CustomBulletButton.tsx`; instâncias em `ProfilePage.tsx` (CTAs do perfil).
 */
export type CustomBulletButtonProps =
  | CustomBulletButtonButtonProps
  | CustomBulletButtonLinkProps;

/**
 * Linhas de frente para categorização visual de cards de habilidades.
 *
 * **Usado em:** `SkillPage.tsx` (tag de tecnologia por card).
 */
export type SkillCardLine =
  | "frontend"
  | "backend"
  | "mobile"
  | "devops"
  | "design"
  | "management"
  | "database"
  | "tools";

/**
 * Chaves dos arquivos em `assets/skills-badges` (mapeadas em `SkillPage.tsx`).
 * Várias chaves exibem um único bloco com as imagens lado a lado.
 */
export type SkillBadgeKey =
  | "react"
  | "react_native"
  | "javascript"
  | "typescript"
  | "html"
  | "css"
  | "redux"
  | "material_ui"
  | "bootstrap"
  | "handlebars"
  | "style_dictionary"
  | "styled_components"
  | "node"
  | "express"
  | "sequelize"
  | "rest_api"
  | "graphql"
  | "spring_boot"
  | "docker"
  | "aws"
  | "figma"
  | "sql"
  | "mysql"
  | "mssql"
  | "postgresql"
  | "android_studio"
  | "kotlin"
  | "jetpack_compose"
  | "java"
  | "c_family"
  | "rust"
  | "python"
  | "git_github"
  | "bpmn"
  | "uml"
  | "storybook"
  | "pandas"
  | "jest"
  | "agile"
  | "vite"
  | "yarn"
  | "default";

/**
 * Identificador de um certificado (imagem e PDF em `certificateAssets.ts`).
 *
 * **Usado em:** `infoTextsCollection.tsx`, `CertificationsPage.tsx`.
 */
export type CertificateId = "c1" | "c2" | "c3" | "c4" | "c5" | "c6" | "c7";

/**
 * Item de certificado em `infoTextsCollection.certificate_page.certificates`.
 *
 * **Usado em:** `infoTextsCollection.tsx`, `CertificationsPage.tsx`.
 */
export type CertificateItem = {
  id: CertificateId;
  title: string;
  institution: string;
  resume: string;
  /** Chave do asset de imagem (mesma família que `id`). */
  img: CertificateId;
};

/** Chave da imagem de capa em `assets/experience/Delta/project_n.png`. */
export type ProjectImageKey =
  | "project_1"
  | "project_2"
  | "project_3"
  | "project_4"
  | "project_5"
  | "project_6"
  | "project_7"
  | "project_8"
  | "project_9"
  | "project_10"
  | "project_11"
  | "project_12";

/** Tela do projeto no modal (`src` resolvido em `projectAssets`; sem `src` → capa padrão). */
export type ProjectScreenItem = {
  img?: ProjectImageKey | "";
  src?: string;
};

/** Plataforma das telas no modal (`assets/projects/{id}/{platform}/`). */
export type ProjectScreenPlatform = "web" | "mobile";

/**
 * Projeto da página Projetos: carrossel + modal (única fonte em `projects_page.projects`).
 */
export type Project = {
  id: number;
  title: string;
  /** Resumo exibido no painel lateral do carrossel. */
  description: string;
  /** Cor de fundo quando `img` estiver vazio ou ausente. */
  color: string;
  /** Legado opcional; capa do card/modal vem de `assets/projects/{id}/capa.*`. */
  img?: ProjectImageKey | "";
  /** Texto longo no modal (parágrafos). */
  paragraphs: string[];
  technologies: string[];
  /** Abas exibidas no modal; imagens vêm de `assets/projects/{id}/{platform}/`. */
  screens: readonly ProjectScreenPlatform[];
  /** Vazio → botão GitHub oculto no modal. */
  project_github_link: string;
  /** Vazio → botão Testar oculto no modal. */
  project_test_link: string;
};

/** Telas resolvidas por plataforma a partir de `assets/projects/{id}/{platform}/`. */
export type ProjectScreenAssets = Record<ProjectScreenPlatform, ProjectScreenItem[]>;

/** Projeto com URLs de imagem já resolvidas a partir de `assets/projects/{id}/`. */
export type ProjectWithImage = Project & {
  /** Carrossel — `capa.*` */
  imageSrc: string;
  /** Modal — `cabeçalho.*` / `cabecalho.*` */
  headerImageSrc: string;
  screenAssets: ProjectScreenAssets;
  /** Moldura mobile — `mobile/case.*` (telas do modal) */
  mobileCaseSrc?: string;
};

/**
 * Conteúdo da página de projetos por idioma.
 */
export type ProjectsPage = {
  contributions_title: string;
  my_projects_title: string;
  my_projects_placeholder: string;
  contributions_total: string;
  contributions_less: string;
  contributions_more: string;
  contributions_error: string;
  contributions_calendar_loading_label: string;
  github_profile_label: string;
  stat_total_label: string;
  stat_completed_label: string;
  stat_personal_label: string;
  stat_in_progress_label: string;
  carousel_prev_label: string;
  carousel_next_label: string;
  carousel_aria_label: string;
  carousel_learn_more_label: string;
  carousel_summary_label: string;
  project_modal_close_label: string;
  project_modal_screens_web_label: string;
  project_modal_screens_mobile_label: string;
  project_modal_screens_empty_label: string;
  project_modal_screen_prev_label: string;
  project_modal_screen_next_label: string;
  project_modal_github_label: string;
  project_modal_live_label: string;
  project_modal_technologies_label: string;
  projects: Project[];
  stats: {
    total: number;
    completed: number;
    personal: number;
    in_progress: number;
  };
};

/**
 * Conteúdo da página de certificações por idioma.
 *
 * **Usado em:** `infoTextsCollection.tsx`, `CertificationsPage.tsx`.
 */
export type CertificatePage = {
  certificates: CertificateItem[];
  modal: {
    close_label: string;
    zoom_in_label: string;
    zoom_out_label: string;
  };
};

/**
 * Card de certificado com URL da imagem já resolvida.
 *
 * **Usado em:** `CertificationsPage.tsx`, `CertificateAboutModal.tsx`.
 */
export type CertificateCardItem = CertificateItem & {
  imgSrc: string;
};

/**
 * Conteúdo da página de habilidades por idioma.
 *
 * **Usado em:** `infoTextsCollection.tsx`, `SkillPage.tsx`.
 */
export type SkillPage = {
  experience_label: string;
  projects_label: string;
  filter_aria_label: string;
  filter_icon_alt: string;
  search_placeholder: string;
  search_aria_label: string;
  listed_items_label: string;
  empty_message: string;
  grid_aria_label: string;
  filter_options: {
    all: string;
    frontend: string;
    backend: string;
    mobile: string;
    devops: string;
    design: string;
    management: string;
    database: string;
    tools: string;
  };
  skills: SkillPageSkill[];
};

/**
 * Entrada de habilidade em `infoTextsCollection.skill_page.skills`.
 *
 * **Usado em:** `infoTextsCollection.tsx`, `SkillPage.tsx`.
 */
export type SkillPageSkill = {
  title: string;
  description: string;
  years: string;
  /** Legado em `infoTexts`; ignorado — “Em projetos” vem de `projects_page.projects`. */
  projects?: string;
  /** URL externa opcional quando não houver `badges`. */
  img: string;
  /** Badges locais (`skills-badges`); ordem preservada no layout composto. */
  badges?: SkillBadgeKey[];
  /** Uma ou mais linhas de frente (ex.: frontend e backend). */
  types: SkillCardLine[];
};

/**
 * Estrutura de um card da página de habilidades.
 *
 * **Usado em:** `SkillPage.tsx` (lista de cards e render).
 */
export type SkillCardItem = {
  id: string;
  title: string;
  description: string;
  years: string;
  projects: string;
  lines: SkillCardLine[];
  badgeKeys: SkillBadgeKey[];
  /** URLs resolvidas (uma imagem ou várias para composição). */
  imageSrcs: string[];
};

/**
 * Item de conteúdo usado no componente de experiência com abas.
 *
 * **Usado em:** `MenuBoxSellection.tsx` e `ExperiencePage.tsx`.
 */
export type MenuBoxSellectionItem = {
  id: string;
  label: string;
  role: string;
  time_working: string;
  photos: string[];
  actions: string[];
  projects: Array<{
    project: string;
    resume: string;
    tasks_executed: string;
  }>;
  imageSrc?: string;
};

/**
 * Opção exibida no `StyledSelector`.
 */
export type StyledSelectOption = {
  value: string;
  label: string;
  iconSrc?: string;
  iconAlt?: string;
};

/**
 * Props do seletor reutilizável com dropdown customizado.
 */
export type StyledSelectorProps = {
  value: string;
  options: StyledSelectOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
  variant?: "default" | "theme-gradient";
  className?: string;
  optionClassNameByValue?: Record<string, string>;
  startIconSrc?: string;
  startIconAlt?: string;
};
