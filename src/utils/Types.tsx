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
export type ArrowBoxScrollRailProps = {
  scrollRootRef: RefObject<HTMLElement | null>;
  contentSyncKey?: string | number;
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

/**
 * Props do overlay de bolhas em órbita (experiência de loading alternativa).
 *
 * **Usado em:** `FloatingBalls.tsx` (componente disponível no projeto; props tipadas aqui).
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
 * Props do rodapé institucional com texto único.
 *
 * **Usado em:** `StyledFooter.tsx`; `App.tsx` passa `text` (ex.: `footerRights` dos textos).
 */
export type StyledFooterProps = {
  text: string;
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
export type CustomBulletButtonIcon = "download" | "paperPlane";

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
