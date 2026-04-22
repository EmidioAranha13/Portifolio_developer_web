import type { EducationActivity, EducationLeafLabels, EducationYearEntry } from "./Types";

export type { EducationActivity, EducationLeafLabels, EducationYearEntry };

export const infoTextsCollection = {
  br: {
    name: "Emídio Aranha",
    role: "Desenvolvedor Full Stack | Soluções Web, Mobile & IoT",
    about: "Sobre mim",
    education: "Formação",
    experience: "Experiências",
    skills: "Habilidades",
    certifications: "Certificações",
    projects: "Projetos",
    contact: "Contato",
    downloadCV: "Baixar Currículo",
    contactMe: "Contate-me",
    techStack: "React + React Native | Android | Angular | PHP | IA",
    footerRights: "Emídio Aranha - 2026. Todos os direitos reservados.",
    profile_page: {
      professionalResume: [
        "Desenvolvedor Web Full Stack com 5 anos de Experiência no mercado de tecnologia.",
        "Graduado em Ciência da Computação pela Universidade Federal do Amazonas (UFAM). Qualificado em cursos  voltados a área de desenvolvimento Web e Android com sistemas Embarcados, além de Inglês Avançado e Japonês Intermediário.",
        "Expertise em: desenvolvimento de sistemas web, desktop e aplicativos mobile com diferentes finalidades (sejam elas para gerenciamento de informações remotas ou funcionalidades direcionadas. Ex: conexão IOT/Embarcados), planejamento de requisitos, produção de Mock-ups, UX/UI, facilitação de cerimônias ágeis (Scrum, planning, daily) mentoria e, ou acompanhamento de novos integrantes e treinamento de usuários.",
        "Motivado a melhorar a cada dia, buscando sempre novos desafios e oportunidades de aprendizado. Atualmente exploarando Inteligência Artificial com sistemas de visão e aprendizado de máquina para uso industrial.",
        <u>Principais Empresas: DELTA SOLLUTIONS, ICTS</u>,
        <u>Empresas atendidas: Daikin, INOVA, Conecthus, Elgin, Inventus Power, Flex</u>,
      ],
      globalSkills: [
        "Desenvolvimento de aplicações Web responsivas com React, React Native, Hooks e Redux",
        "Expertise em HTML, CSS, Javascript e Typescript",
        "Criação e Integração de API´s com API Rest, Graph QL, Spring boot",
        "Desenvolvimento de casos de testes para validação de features usando Jest",
        "Participação na definição de Clean Architecture e Storytelling",
        "Noções de conceito SOLID",
        "Versionamento, análise e review de código usando GIT, Github ou Gitlab",
        "Desenvolvimento de aplicações em Ambiente Linux e Windows",
        "Atuação na análise de logs, troubleshooting, manutenção e evolução do Software",
        "Desenvolvimento/ajuste de mockups com Figma focado em UX/UI",
        "Criação e evolução de Design Systems",
        "Gerenciamento de manuais e ATAS de desenvolvimento",
        "Mapeamento/Definição/Gerenciamento de Tarefas",
        "Resiliência e adaptabilidade com ferramentas novas",
        "Noções de CI | CD para Deploy de sistemas",
      ],
    },
    experience_page: {
      items: [
        {
          id: "delta",
          label: "Delta Sollutions",
          role: "Desenvolvedor Full Stack",
          time_working: "2021 - Atual",
          actions: [
            "Desenvolvimento e manutenção de aplicações web corporativas.",
            "Integração entre frontend, backend e serviços externos.",
            "Evolução de interface com foco em UX/UI e performance.",
          ],
          projects: [
            {
              project: "Portal Corporativo de Gestão",
              resume: "Plataforma web para acompanhamento de operações e indicadores internos.",
            },
            {
              project: "Integrações de APIs internas",
              resume: "Consolidação de dados de múltiplos sistemas em uma única interface.",
            },
          ],
        },
        {
          id: "icts",
          label: "ICTS",
          role: "Desenvolvedor de Software",
          time_working: "2019 - 2021",
          actions: [
            "Implementação de módulos de sistema com boas práticas de arquitetura.",
            "Apoio técnico em refinamento de requisitos e validação de entregas.",
            "Correção de bugs e melhorias contínuas de estabilidade.",
          ],
          projects: [
            {
              project: "Sistema de Auditoria Operacional",
              resume: "Módulos de registro e consulta de evidências para processos internos.",
            },
            {
              project: "Painel de Indicadores",
              resume: "Dashboard para análise de resultados e apoio à tomada de decisão.",
            },
          ],
        },
        {
          id: "freelance",
          label: "Freelancer",
          role: "Desenvolvedor Freelancer",
          time_working: "2017 - Atual",
          actions: [
            "Desenvolvimento de soluções sob demanda para clientes diversos.",
            "Criação de interfaces responsivas e integrações com APIs.",
            "Suporte pós-entrega e evolução de funcionalidades.",
          ],
          projects: [
            {
              project: "Sites institucionais customizados",
              resume: "Projetos com identidade visual própria e foco em presença digital.",
            },
            {
              project: "Aplicações web de gestão",
              resume: "Ferramentas para cadastro, acompanhamento e relatórios operacionais.",
            },
          ],
        },
      ],
    },
    education_page: {
      leafLabels: {
        institution: "Instituição:",
        degree: "Grau:",
        period: "Período:",
        location: "Cidade | Estado:",
        description: "Descrição:",
        scholar: "Bolsista:",
        extra: "Extras:",
      },
      education: [
        {
          year: 2012,
          activities: [
            {
              title: "Curso de Lingua Inglesa Jovens Iniciantes",
              institution: "Minds",
              degree: "Curso de capacitção",
              period: "Janeiro 2010 - julho 2012",
              location: "Manaus - AM",
              ended: "Jul",
              description: "",
              scholar: "",
              extra: "",
            },
          ],
        },
        {
          year: 2014,
          activities: [
            {
              title: "Curso de Lingua Inglesa nível básico ao avançado",
              institution: "SENAC",
              degree: "Curso de capacitção",
              period: "Agosto 2012 - Dezembro 2014",
              location: "Manaus - AM",
              ended: "Dez",
              description: "",
              scholar: "",
              extra: "",
            },
          ],
        },
        {
          year: 2015,
          activities: [
            {
              title: "Ensino Escolar Completo",
              institution: "Escola Celus",
              degree: "Ensino Fundamental e Médio",
              period: "Janeiro 2000 - Dezembro 2015",
              location: "Manaus - AM",
              ended: "Dez",
              description: "",
              scholar: "",
              extra: "",
            },
          ],
        },
        {
          year: 2020,
          activities: [
            {
              title: "Ensino em Lingua Japonesa nível básico ao avançado",
              institution: "NIPPAKU",
              degree: "Curso de capacitação",
              period: "Janeiro 2015 - Setembro 2020",
              location: "Manaus - AM",
              ended: "Set",
              description: "",
              scholar: "",
              extra: "",
            },
          ],
        },
        {
          year: 2022,
          activities: [
            {
              title: "Graduação em Ciência da Computação",
              institution: "Universidade Federal do Amazonas (UFAM)",
              degree: "Ensino Superior Completo",
              period: "Abril 2016 - Julho 2022",
              location: "Manaus - AM",
              ended: "Jul",
              description: "",
              scholar: "",
              extra: "",
            },
          ],
        },
        {
          year: 2025,
          activities: [
            {
              title: "DevTitans",
              institution: "Universidade Federal do Amazonas (UFAM)",
              degree: "Curso de Capacitação",
              period: "Agosto 2024 - Fevereiro 2025",
              location: "Manaus - AM",
              ended: "Fev",
              description: "Capacitação e Desenvolvimento em tecnologias Android para Sistemas Embarcados",
              scholar: "Fundação de Apoio ao Ensino, Pesquisa, Extensão e Interiorização do IFAM, FAEPI, Brasil.",
              extra: "",
            },
          ],
        },
      ],
    },
  },
  en: {
    name: "Emídio Aranha",
    role: "Full Stack Developer | Web, Mobile & IoT Solutions",
    about: "About me",
    education: "Education",
    experience: "Experience",
    skills: "Skills",
    certifications: "Certifications",
    projects: "Projects",
    contact: "Contact",
    downloadCV: "Download Curriculum",
    contactMe: "Contact me",
    techStack: "React + React Native | Android | Angular | PHP | AI",
    footerRights: "Emídio Aranha - 2026. All rights reserved.",
    profile_page: {
      professionalResume: [
        "Full Stack Web Developer with 5 years of experience in the technology market.",
        "Bachelor's degree in Computer Science from the Federal University of Amazonas (UFAM). Qualified through courses focused on Web and Android development with Embedded Systems, as well as Advanced English and Intermediate Japanese.",
        "Expertise in: development of web systems, desktop applications, and mobile apps for various purposes (such as remote information management or specific functionalities, e.g., IoT/Embedded systems integration), requirements planning, mock-up design, UX/UI, facilitation of agile ceremonies (Scrum, planning, daily), mentoring and onboarding of new team members, and user training.",
        "Motivated to continuously improve, always seeking new challenges and learning opportunities. Currently exploring Artificial Intelligence with computer vision and machine learning systems for industrial applications.",
        <u>Main Companies: DELTA SOLUTIONS, ICTS</u>,
        <u>Clients: Daikin, INOVA, Conecthus, Elgin, Inventus Power, Flex</u>,
      ],
      globalSkills: [
        "Development of responsive web applications using React, React Native, Hooks, and Redux",
        "Expertise in HTML, CSS, JavaScript, and TypeScript",
        "API creation and integration using REST APIs, GraphQL, and Spring Boot",
        "Development of test cases for feature validation using Jest",
        "Participation in defining Clean Architecture and Storytelling",
        "Understanding of SOLID principles",
        "Version control, code analysis, and review using Git, GitHub, or GitLab",
        "Application development in Linux and Windows environments",
        "Experience in log analysis, troubleshooting, maintenance, and software evolution",
        "Mockup design and adjustments using Figma with a focus on UX/UI",
        "Creation and evolution of Design Systems",
        "Management of documentation and development records",
        "Task mapping, definition, and management",
        "Resilience and adaptability to new tools",
        "Basic knowledge of CI/CD for system deployment",
      ],
    },
    experience_page: {
      items: [
        {
          id: "delta",
          label: "Delta Sollutions",
          role: "Full Stack Developer",
          time_working: "2021 - Present",
          actions: [
            "Develop and maintain corporate web applications.",
            "Integrate frontend, backend, and external services.",
            "Improve UI/UX and performance in continuous delivery cycles.",
          ],
          projects: [
            {
              project: "Corporate Management Portal",
              resume: "Web platform to track operations and internal KPIs.",
            },
            {
              project: "Internal API Integrations",
              resume: "Unified data from multiple systems into a single interface.",
            },
          ],
        },
        {
          id: "icts",
          label: "ICTS",
          role: "Software Developer",
          time_working: "2019 - 2021",
          actions: [
            "Implemented core modules using clean architecture principles.",
            "Supported requirement refinement and delivery validation.",
            "Fixed bugs and improved system stability.",
          ],
          projects: [
            {
              project: "Operational Audit System",
              resume: "Modules for evidence registration and internal process tracking.",
            },
            {
              project: "KPI Dashboard",
              resume: "Analytics dashboard to support data-driven decisions.",
            },
          ],
        },
        {
          id: "freelance",
          label: "Freelancer",
          role: "Freelance Developer",
          time_working: "2017 - Present",
          actions: [
            "Built tailor-made solutions for different clients.",
            "Created responsive interfaces and API integrations.",
            "Provided post-delivery support and feature evolution.",
          ],
          projects: [
            {
              project: "Custom Institutional Websites",
              resume: "Projects focused on brand identity and digital presence.",
            },
            {
              project: "Web Management Applications",
              resume: "Operational tools for records, tracking, and reports.",
            },
          ],
        },
      ],
    },
    education_page: {
      leafLabels: {
        institution: "Institution:",
        degree: "Degree:",
        period: "Period:",
        location: "City | State:",
        description: "Description:",
        scholar: "Scholarship:",
        extra: "Extras:",
      },
      education: [] as EducationYearEntry[],
    },
  },
  ja: {
    name: "エミジオ・アラーニャ",
    role: "フルスタック開発者｜Web・モバイル・IoT",
    about: "プロフィール",
    education: "学習・経歴",
    experience: "経験",
    skills: "スキル",
    certifications: "資格・認定",
    projects: "制作実績",
    contact: "コンタクト",
    downloadCV: "CVをダウンロード",
    contactMe: "気軽に連絡してください",
    techStack: "React／React Native｜Android｜Angular｜PHP｜AI",
    footerRights: "エミジオ・アラーニャ - 2026. All rights reserved.",
    profile_page: {
      professionalResume: [
        "IT業界において5年間の経験を持つフルスタックWeb開発者です。",
        "アマゾナス連邦大学（UFAM）にてコンピュータサイエンスの学士号を取得しました。WebおよびAndroid開発（組み込みシステムを含む）に関するコースを修了し、英語は上級、日本語は中級レベルです。",
        "Webシステム、デスクトップアプリケーション、モバイルアプリの開発に精通しており、リモート情報管理やIoT／組み込みシステム連携など、さまざまな用途に対応可能です。また、要件定義、モックアップ作成、UX/UI設計、アジャイル開発（スクラム、プランニング、デイリー）の進行、メンバーの指導およびユーザートレーニングの経験があります。",
        "常に自己成長を目指し、新しい課題や学習機会に積極的に取り組んでいます。現在は産業向けのコンピュータビジョンおよび機械学習を活用した人工知能の研究に取り組んでいます。",
        <u>主な企業：DELTA SOLUTIONS、ICTS</u>,
        <u>取引先企業：Daikin、INOVA、Conecthus、Elgin、Inventus Power、Flex</u>,
      ],
      globalSkills: [
        "React、React Native、Hooks、Reduxを用いたレスポンシブWebアプリケーションの開発",
        "HTML、CSS、JavaScript、TypeScriptに関する専門知識",
        "REST API、GraphQL、Spring Bootを用いたAPIの設計および統合",
        "Jestを用いた機能検証のためのテストケース作成",
        "クリーンアーキテクチャおよびストーリーテリングの設計への参加",
        "SOLID原則の基礎知識",
        "Git、GitHub、GitLabを用いたバージョン管理、コードレビューおよび分析",
        "LinuxおよびWindows環境でのアプリケーション開発",
        "ログ分析、トラブルシューティング、保守およびソフトウェア改善の経験",
        "Figmaを用いたUX/UI重視のモックアップ作成および調整",
        "デザインシステムの構築および改善",
        "ドキュメントおよび開発記録の管理",
        "タスクの整理、定義および管理",
        "新しいツールへの柔軟な対応力と適応力",
        "CI/CDによるデプロイに関する基礎知識",
      ],
    },
    experience_page: {
      items: [
        {
          id: "delta",
          label: "Delta Sollutions",
          role: "フルスタック開発者",
          time_working: "2021 - 現在",
          actions: [
            "企業向けWebアプリケーションの開発・保守を担当。",
            "フロントエンド、バックエンド、外部サービスの連携を実装。",
            "UX/UIとパフォーマンスの継続的な改善を実施。",
          ],
          projects: [
            {
              project: "業務管理ポータル",
              resume: "社内業務と主要指標を可視化するWebプラットフォーム。",
            },
            {
              project: "社内API統合",
              resume: "複数システムのデータを単一インターフェースへ統合。",
            },
          ],
        },
        {
          id: "icts",
          label: "ICTS",
          role: "ソフトウェア開発者",
          time_working: "2019 - 2021",
          actions: [
            "クリーンアーキテクチャに基づく主要機能を実装。",
            "要件整理と成果物検証を技術面でサポート。",
            "不具合修正と安定性向上を継続的に実施。",
          ],
          projects: [
            {
              project: "業務監査システム",
              resume: "証跡登録と内部プロセス追跡のためのモジュールを開発。",
            },
            {
              project: "KPIダッシュボード",
              resume: "データ分析と意思決定を支援する可視化基盤。",
            },
          ],
        },
        {
          id: "freelance",
          label: "フリーランス",
          role: "フリーランス開発者",
          time_working: "2017 - 現在",
          actions: [
            "多様なクライアント向けに受託開発を実施。",
            "レスポンシブUIとAPI連携を含む機能を構築。",
            "納品後の保守と機能拡張を継続サポート。",
          ],
          projects: [
            {
              project: "コーポレートサイト制作",
              resume: "ブランド表現と情報発信を重視したWeb制作案件。",
            },
            {
              project: "業務管理Webアプリ",
              resume: "登録、進捗管理、レポート出力を行う業務支援ツール。",
            },
          ],
        },
      ],
    },
    education_page: {
      leafLabels: {
        institution: "教育機関:",
        degree: "学位・段階:",
        period: "期間:",
        location: "都市 | 州:",
        description: "内容:",
        scholar: "奨学金:",
        extra: "その他:",
      },
      education: [] as EducationYearEntry[],
    },
  },
};

export type InfoTextsLanguage = keyof typeof infoTextsCollection;
export type InfoTexts = (typeof infoTextsCollection)[InfoTextsLanguage];