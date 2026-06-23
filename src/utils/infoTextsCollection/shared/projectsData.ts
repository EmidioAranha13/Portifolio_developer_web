import type { Project, ProjectImageKey } from "../../Types";

const PROJECT_CARD_COLORS = [
  "#01689d",
  "#17937c",
  "#3fa874",
  "#6bbe68",
  "#9cd65d",
  "#f84187",
  "#f841ca",
  "#b73bcf",
  "#5f38cc",
  "#13b4b9",
  "#0a5c7a",
  "#2d6a4f",
] as const;

const DEFAULT_PROJECT_TECHNOLOGIES = ["React", "TypeScript", "Vite", "Node.js"] as const;

/** Metadados compartilhados entre idiomas (tags, links, telas). */
const PORTFOLIO_PROJECT_CORES = [
  {
    color: "#01689d",
    img: "" as ProjectImageKey | "",
    technologies: ["React", "TypeScript", "Vite", "html", "css"],
    screens: ["web", "mobile"] as const,
    project_github_link: "https://github.com/EmidioAranha13/Portifolio_developer_web",
    project_test_link: "",
  },
  {
    color: "#17937c",
    img: "" as ProjectImageKey | "",
    technologies: ["React", "TypeScript", "Vite", "Node.js"],
    screens: [] as const,
    project_github_link: "https://github.com/EmidioAranha13/proj1",
    project_test_link: "https://github.com/EmidioAranha13/proj1",
  },
  {
    color: "#3fa874",
    img: "" as ProjectImageKey | "",
    technologies: ["React", "TypeScript", "Vite", "Node.js"],
    screens: [] as const,
    project_github_link: "https://github.com/EmidioAranha13/proj1",
    project_test_link: "https://github.com/EmidioAranha13/proj1",
  },
  {
    color: "#6bbe68",
    img: "" as ProjectImageKey | "",
    technologies: ["React", "TypeScript", "Vite", "Node.js"],
    screens: [] as const,
    project_github_link: "https://github.com/EmidioAranha13/proj1",
    project_test_link: "https://github.com/EmidioAranha13/proj1",
  },
  {
    color: "#9cd65d",
    img: "" as ProjectImageKey | "",
    technologies: ["React", "TypeScript", "Vite", "Node.js"],
    screens: [] as const,
    project_github_link: "https://github.com/EmidioAranha13/proj1",
    project_test_link: "https://github.com/EmidioAranha13/proj1",
  },
  {
    color: "#f84187",
    img: "" as ProjectImageKey | "",
    technologies: ["React", "TypeScript", "Javascript", "yarn", "bootstrap", "css"],
    screens: ["web", "mobile"] as const,
    project_github_link: "https://github.com/EmidioAranha13/Iniciando-com-react",
    project_test_link: "https://github.com/EmidioAranha13/proj1",
  },
  {
    color: "#f841ca",
    img: "" as ProjectImageKey | "",
    technologies: ["React", "TypeScript", "Vite", "Node.js"],
    screens: [] as const,
    project_github_link: "https://github.com/EmidioAranha13/proj1",
    project_test_link: "https://github.com/EmidioAranha13/proj1",
  },
  {
    color: "#b73bcf",
    img: "" as ProjectImageKey | "",
    technologies: ["React", "TypeScript", "Vite", "Node.js"],
    screens: [] as const,
    project_github_link: "https://github.com/EmidioAranha13/proj1",
    project_test_link: "https://github.com/EmidioAranha13/proj1",
  },
  {
    color: "#5f38cc",
    img: "" as ProjectImageKey | "",
    technologies: ["Em Breve"],
    screens: ["web", "mobile"] as const,
    project_github_link: "",
    project_test_link: "",
  },
] as const;

const buildLocalizedProjects = (
  entries: ReadonlyArray<{
    title: string;
    description: string;
    paragraphs: readonly string[];
  }>,
): Project[] =>
  entries.map((entry, index) => {
    const core = PORTFOLIO_PROJECT_CORES[index];
    const project: Project = {
      id: index,
      title: entry.title,
      description: entry.description,
      color: core?.color ?? PROJECT_CARD_COLORS[index],
      paragraphs: [...entry.paragraphs],
      technologies: core ? [...core.technologies] : [...DEFAULT_PROJECT_TECHNOLOGIES],
      screens: core ? [...core.screens] : [],
      project_github_link: core?.project_github_link ?? "",
      project_test_link: core?.project_test_link ?? "",
    };
    if (core?.img) project.img = core.img;
    return project;
  });

const PROJECT_TEXTS_BR = [
  {
    title: "Portifólio Web/Mobile",
    description:
       "Meu portfólio apresenta projetos pessoais e soluções de prova de conceito (PoC) que demonstram minhas habilidades em engenharia de software, desenvolvimento web e aplicações industriais. Por meio desses projetos, destaco minha experiência com frameworks modernos, bibliotecas, ferramentas e práticas de desenvolvimento utilizadas para construir soluções escaláveis e de fácil manutenção.",
    paragraphs: [
      "Portfólio pessoal, desenvolvido para apresentar perfil profissional, formação, experiências, habilidades, certificações, projetos e canal de contato. A aplicação reúne projetos pessoais e provas de conceito (POC) que demonstram práticas de desenvolvimento web e industrial, com interface responsiva, internacionalização e identidade visual própria.",
      "É uma Single Page Application (SPA) construída com React e TypeScript, empacotada com Vite. O conteúdo é organizado em seções navegáveis com carregamento sob demanda das páginas para melhor desempenho.",
      "Destaques da experiência:\n\n• Tema claro e escuro, persistido em localStorage\n• Três idiomas: português (BR), inglês (EN) e japonês (JA)\n• Fundo animado com dois modos alternáveis: LiquidGlass e BubbleBalls\n• Barra de rolagem customizada com thumb animado\n• Modais para detalhes de projetos, certificados e respostas do formulário\n• Formulário de contato integrado ao Formspree\n• Calendário de contribuições do GitHub na página de perfil"
    ],
  },
  {
    title: "Air Quality App",
    description: "Descrição do projeto 2",
    paragraphs: ["Parágrafo 1", "Parágrafo 2", "Parágrafo 3"],
  },
  {
    title: "Sistema de Visão: Detector",
    description: "Descrição do projeto 3",
    paragraphs: ["Parágrafo 1", "Parágrafo 2", "Parágrafo 3"],
  },
  {
    title: "Dashboard de Monitoramento",
    description: "Descrição do projeto 4",
    paragraphs: ["Parágrafo 1", "Parágrafo 2", "Parágrafo 3"],
  },
  {
    title: "Icomp Números",
    description: "Descrição do projeto 5",
    paragraphs: ["Parágrafo 1", "Parágrafo 2", "Parágrafo 3"],
  },
  {
    title: "GitPro Collector: Listador de repositórios",
    description: "Um sistema simples em React para listar repositórios de um usuário do GitHub, com possibilidade de buscar por repositório específico.",
    paragraphs: [
      "O GitPro Collector é um sistema básico de listagem que funciona da seguinte forma: Selecione o indicador de busca de seu interesse, seja por nome ou token (token de acesso do github fornecido pelo usuário através de settings/developer settings/personal access token/token classic), adicione o nome ou token e clique em buscar.", 
      "Será feita uma busca pelos repositórios públicos do usuário, se selecinado busca por nome, ou repositórios públicos e privados se buscado através de token. O resultado é exibido através de um seletor de repositórios onde o usuário pode escolher qual repositório visualizar e seus dados adicionais. ",
    ],
  },
  {
    title: "Condomunity",
    description: "Descrição do projeto 7",
    paragraphs: ["Parágrafo 1", "Parágrafo 2", "Parágrafo 3"],
  },
  {
    title: "Sistema de Gerenciamento de PetShop",
    description: "Descrição do projeto 8",
    paragraphs: ["Parágrafo 1", "Parágrafo 2", "Parágrafo 3"],
  },
  {
    title: "Em Breve",
    description: "Mais projetos em breve...",
    paragraphs: ["Mais projetos em breve..."],
  },
] as const;

const PROJECT_TEXTS_EN = [
  {
    title: "Web/Mobile Portfolio",
    description:
      "My portfolio showcases personal projects and proof-of-concept (PoC) solutions that demonstrate my skills in software engineering, web development, and industrial applications. Through these projects, I highlight my experience with modern frameworks, libraries, tools, and development practices used to build scalable and maintainable solutions.",
    paragraphs: [
      "Personal portfolio developed to showcase professional profile, education, experience, skills, certifications, projects, and contact information. The application brings together personal projects and proof-of-concept (PoC) solutions that demonstrate web and industrial development practices, featuring a responsive interface, internationalization, and a unique visual identity.",
      "It is a Single Page Application (SPA) built with React and TypeScript and bundled with Vite. The content is organized into navigable sections with on-demand page loading to improve performance.",
      "Experience highlights:\n\n• Light and dark themes persisted in localStorage\n• Three languages: Portuguese (BR), English (EN), and Japanese (JA)\n• Animated background with two switchable modes: LiquidGlass and BubbleBalls\n• Custom scrollbar with animated thumb\n• Modals for project details, certificates, and form responses\n• Contact form integrated with Formspree\n• GitHub contribution calendar on the profile page"
    ],
  },
  {
    title: "Air Quality App",
    description: "Project 2 description",
    paragraphs: ["Paragraph 1", "Paragraph 2", "Paragraph 3"],
  },
  {
    title: "Vision System: Detector",
    description: "Project 3 description",
    paragraphs: ["Paragraph 1", "Paragraph 2", "Paragraph 3"],
  },
  {
    title: "Monitoring Dashboard",
    description: "Project 4 description",
    paragraphs: ["Paragraph 1", "Paragraph 2", "Paragraph 3"],
  },
  {
    title: "Icomp Numbers",
    description: "Project 5 description",
    paragraphs: ["Paragraph 1", "Paragraph 2", "Paragraph 3"],
  },
  {
    title: "GitPro Collector: Repository Browser",
    description:
      "A simple React application for listing GitHub repositories, with support for searching and viewing specific repositories.",
    paragraphs: [
      "GitPro Collector is a basic repository listing system that works as follows: Select your preferred search method, either by username or by token (a GitHub access token provided by the user through Settings → Developer Settings → Personal Access Tokens → Classic Token), enter the username or token, and click search.",
  
      "The application retrieves the user's public repositories when searching by username, or both public and private repositories when using a token. The results are displayed through a repository selector, allowing the user to choose a repository and view its additional information."
    ]
  },
  {
    title: "Condomunity",
    description: "Project 7 description",
    paragraphs: ["Paragraph 1", "Paragraph 2", "Paragraph 3"],
  },
  {
    title: "PetShop Management System",
    description: "Project 8 description",
    paragraphs: ["Paragraph 1", "Paragraph 2", "Paragraph 3"],
  },
  {
    title: "Coming Soon",
    description: "More projects coming soon...",
    paragraphs: ["More projects coming soon..."],
  },
] as const;

const PROJECT_TEXTS_JA = [
  {
    title: "Web/モバイルポートフォリオ",
    description:
      "私のポートフォリオでは、ソフトウェアエンジニアリング、Web開発、そして産業向けアプリケーションに関するスキルを示す個人プロジェクトやPoC（概念実証）を紹介しています。これらのプロジェクトを通して、スケーラブルで保守しやすいソリューションを開発するために使用した最新のフレームワーク、ライブラリ、ツール、および開発手法の経験を紹介しています。",
    paragraphs: [
      "職務プロフィール、学歴、経験、スキル、資格、プロジェクト、お問い合わせ先を紹介するために開発した個人ポートフォリオです。このアプリケーションでは、レスポンシブデザイン、多言語対応、独自のデザインを備え、Web開発や産業向け開発の実践例を示す個人プロジェクトやPoC（概念実証）をまとめています。",
      "ReactとTypeScriptで開発し、Viteで構築したシングルページアプリケーション（SPA）です。コンテンツは複数のセクションに整理されており、必要なページのみを読み込むことでパフォーマンスを向上させています。",
      "主な機能:\n\n• ライトテーマとダークテーマ（localStorageに保存）\n• 3言語対応：ポルトガル語（BR）、英語（EN）、日本語（JA）\n• 2種類の切り替え可能なアニメーション背景：LiquidGlass と BubbleBalls\n• アニメーション付きのカスタムスクロールバー\n• プロジェクト詳細、資格、フォーム送信結果用のモーダル\n• Formspreeと連携したお問い合わせフォーム\n• プロフィールページにGitHubのコントリビューションカレンダーを表示"
    ]
  },
  {
    title: "Air Quality App",
    description: "プロジェクト 2 の説明",
    paragraphs: ["段落 1", "段落 2", "段落 3"],
  },
  {
    title: "ビジョンシステム: 検出器",
    description: "プロジェクト 3 の説明",
    paragraphs: ["段落 1", "段落 2", "段落 3"],
  },
  {
    title: "モニタリングダッシュボード",
    description: "プロジェクト 4 の説明",
    paragraphs: ["段落 1", "段落 2", "段落 3"],
  },
  {
    title: "Icomp Números",
    description: "プロジェクト 5 の説明",
    paragraphs: ["段落 1", "段落 2", "段落 3"],
  },
  {
    title: "GitPro Collector：リポジトリ一覧ツール",
    description:
      "GitHubユーザーのリポジトリを一覧表示し、特定のリポジトリを検索できるシンプルなReactアプリケーションです。",
    paragraphs: [
      "GitPro Collectorは、基本的なリポジトリ一覧システムです。検索方法として、ユーザー名またはトークンを選択できます。トークンを利用する場合は、GitHubの「Settings → Developer Settings → Personal Access Tokens → Token (Classic)」で発行したアクセストークンを使用します。ユーザー名またはトークンを入力し、検索を実行します。",
  
      "ユーザー名で検索した場合は公開リポジトリのみを取得し、トークンを使用した場合は公開・非公開の両方のリポジトリを取得できます。検索結果はリポジトリセレクターに表示され、ユーザーは表示したいリポジトリを選択し、追加情報を確認できます。"
    ]
  },
  {
    title: "Condomunity",
    description: "プロジェクト 7 の説明",
    paragraphs: ["段落 1", "段落 2", "段落 3"],
  },
  {
    title: "ペットショップ管理システム",
    description: "プロジェクト 8 の説明",
    paragraphs: ["段落 1", "段落 2", "段落 3"],
  },
  {
    title: "近日公開",
    description: "さらにプロジェクトを追加予定です...",
    paragraphs: ["さらにプロジェクトを追加予定です..."],
  },
] as const;

const PROJECTS_BR = buildLocalizedProjects(PROJECT_TEXTS_BR);
const PROJECTS_EN = buildLocalizedProjects(PROJECT_TEXTS_EN);
const PROJECTS_JA = buildLocalizedProjects(PROJECT_TEXTS_JA);

export { PROJECTS_BR, PROJECTS_EN, PROJECTS_JA };
