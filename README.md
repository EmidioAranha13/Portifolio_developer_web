# Portfólio — Desenvolvedor Web Full Stack

Portfólio pessoal, desenvolvido para apresentar perfil profissional, formação, experiências, habilidades, certificações, projetos e canal de contato. A aplicação reúne projetos pessoais e provas de conceito (POC) que demonstram práticas de desenvolvimento web e industrial, com interface responsiva, internacionalização e identidade visual própria.

**Repositório:** [github.com/EmidioAranha13/Portifolio_developer_web](https://github.com/EmidioAranha13/Portifolio_developer_web)

---

## Sobre o projeto

Single Page Application (SPA) construída com **React** e **TypeScript**, empacotada com **Vite**. O conteúdo é organizado em seções navegáveis (sobre, educação, experiência, habilidades, certificações, projetos e contato), com carregamento sob demanda das páginas para melhor desempenho.

Destaques da experiência:

- **Tema claro e escuro**, persistido em `localStorage`
- **Três idiomas:** português (BR), inglês (EN) e japonês (JA)
- **Fundo animado** com dois modos alternáveis: *LiquidGlass* e *BubbleBalls*
- **Barra de rolagem customizada** com thumb animado
- **Modais** para detalhes de projetos, certificados e respostas do formulário
- **Formulário de contato** integrado ao [Formspree](https://formspree.io/)
- **Calendário de contribuições** do GitHub na página de perfil

---

## Stack tecnológica

| Camada | Tecnologia |
|--------|------------|
| Interface | React 19, TypeScript |
| Build / dev server | Vite (rolldown-vite) + `@vitejs/plugin-react-swc` |
| Estado global | Redux Toolkit + React Redux |
| Estilização | CSS modular por componente (sem UI framework) |
| Formulários | Formspree (`@formspree/react`) |
| Lint | ESLint 9 + TypeScript ESLint |

---

## Bibliotecas e dependências

### Produção

| Pacote | Versão | Uso no projeto |
|--------|--------|----------------|
| [react](https://react.dev/) | ^19.1.1 | Biblioteca de interface e renderização |
| [react-dom](https://react.dev/) | ^19.1.1 | Renderização no DOM |
| [@reduxjs/toolkit](https://redux-toolkit.js.org/) | ^2.9.1 | Store global e slice de navegação/UI |
| [react-redux](https://react-redux.js.org/) | ^9.2.0 | Integração React ↔ Redux |
| [@formspree/react](https://github.com/formspree/formspree-react) | ^3.0.0 | Envio do formulário de contato |
| [react-github-calendar](https://github.com/grubersjoe/react-github-calendar) | ^5.0.6 | Heatmap de atividade no GitHub |

### Desenvolvimento

| Pacote | Versão | Uso no projeto |
|--------|--------|----------------|
| [vite](https://vite.dev/) (`rolldown-vite`) | 7.1.14 | Bundler e servidor de desenvolvimento |
| [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react) | ^4.1.0 | Fast Refresh com SWC |
| [typescript](https://www.typescriptlang.org/) | ~5.9.3 | Tipagem estática |
| [eslint](https://eslint.org/) | ^9.36.0 | Análise estática de código |
| [typescript-eslint](https://typescript-eslint.io/) | ^8.45.0 | Regras ESLint para TypeScript |
| [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) | ^5.2.0 | Regras para Hooks do React |
| [eslint-plugin-react-refresh](https://www.npmjs.com/package/eslint-plugin-react-refresh) | ^0.4.22 | Compatibilidade com Fast Refresh |

Cada biblioteca de terceiros permanece sob a licença publicada pelos respectivos autores (consulte `node_modules/<pacote>/LICENSE` ou a página oficial do projeto).

---

## Estrutura do projeto

```
src/
├── App.tsx                 # Shell da aplicação, tema, idioma e fundo animado
├── pages/                  # Seções do portfólio (lazy-loaded)
├── componentes/            # Componentes reutilizáveis (header, modais, toggles, etc.)
├── store/                  # Redux (navegação entre seções)
├── utils/                  # Tipos, textos i18n e resolução de assets
├── assets/                 # Imagens, fontes, PDFs e mídia dos projetos
└── styles/                 # Estilos compartilhados (ex.: glass surface)
```

---

## Pré-requisitos

- **Node.js** 18+ (recomendado 20 LTS)
- **npm** 9+

---

## Instalação e execução

```bash
# Clonar o repositório
git clone https://github.com/EmidioAranha13/Portifolio_developer_web.git
cd Portifolio_developer_web

# Instalar dependências
npm install

# Servidor de desenvolvimento (porta 3000)
npm run dev

# Build de produção
npm run build

# Pré-visualizar o build
npm run preview

# Lint
npm run lint
```

---

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto para habilitar o formulário de contato:

```env
VITE_FORMSPREE_FORM_ID=seu_form_id_aqui
```

O ID é obtido em [formspree.io](https://formspree.io/) ao criar um formulário. Sem essa variável, a página de contato exibe aviso de configuração pendente e o envio fica desabilitado.

---

## Direitos autorais e licença

### Código e conteúdo do portfólio

© **Emídio Aranha** — 2026. **Todos os direitos reservados.**

Salvo indicação em contrário, o código-fonte deste repositório, os textos, imagens de perfil, logotipos, currículos em PDF, capturas de projetos, certificados e demais materiais originais incluídos no portfólio são propriedade do autor.

**Não é permitido**, sem autorização prévia por escrito:

- Copiar, redistribuir ou publicar o projeto como se fosse de autoria própria
- Reutilizar o design, textos ou assets em outros sites ou produtos comerciais
- Remover avisos de direitos autorais

Uso educacional ou inspiração visual deve respeitar a autoria e não reproduzir o trabalho de forma integral.

### Fontes

| Fonte | Licença | Arquivo de licença |
|-------|---------|-------------------|
| **Lobster Two** (Pablo Impallari, Igino Marini) | [SIL Open Font License 1.1](https://openfontlicense.org/) | `src/assets/fonts/Lobster_Two/OFL.txt` |
| **Roboto** (Google Fonts) | [SIL Open Font License 1.1](https://openfontlicense.org/) | `src/assets/fonts/Roboto/OFL.txt` |

### Bibliotecas de terceiros

React, Redux Toolkit, Vite, Formspree, react-github-calendar e demais dependências listadas em `package.json` são software de terceiros, cada um regido por sua própria licença (em geral MIT ou Apache-2.0). Este projeto não reivindica propriedade sobre essas bibliotecas.

### Ícones e imagens de tecnologias

Logotipos e ícones de stacks (React, Node.js, Docker, etc.) são marcas registradas dos respectivos titulares, usados aqui apenas para identificação de habilidades e projetos, sem implicação de endosso. Icones adicionais retirados do site: [icones](https://icones.js.org/)

---

## Autor

**Emídio Aranha**  
Desenvolvedor Web Full Stack

- GitHub: [@EmidioAranha13](https://github.com/EmidioAranha13)
- LinkedIn: [emidio-aranha](https://www.linkedin.com/in/emidio-aranha/)

---

## Contato

Para propostas profissionais ou dúvidas sobre o projeto, utilize o formulário na seção **Contato** do portfólio ou os links acima.
