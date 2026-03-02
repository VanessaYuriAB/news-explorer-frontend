# 🅽 Projeto Final - Web Project News Explorer

Aplicação **full‑stack** para pesquisa e salvamento de notícias, com autenticação JWT, arquitetura desacoplada e foco em boas práticas de React e UX. Desenvolvida como projeto final do bootcamp **TripleTen**, dividida em fases incrementais, com foco em **React**, **Vite**, **Node.js**, **Express**, **MongoDB** e **autorização baseada em JWT**.

<!-- ⚙️ Tecnologias principais -->

[![Node](https://img.shields.io/badge/Node-v22.15.0-darkgreen?logo=node.js)](https://nodejs.org/pt)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=yellow)](https://developer.mozilla.org/docs/Web/JavaScript)

[![React](https://img.shields.io/badge/React-19.2.0-blue?style=flat&logo=react&logoColor=blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.1.12-646CFF?style=flat&logo=vite&logoColor=989CFF)](https://vitejs.dev/)

<!-- 🧰 Ferramentas e qualidade de código -->

[![ESLint](https://img.shields.io/badge/ESLint-Airbnb%20base-darkblue?logo=eslint&logoColor=darkblue)](https://www.npmjs.com/package/eslint-config-airbnb)
[![Prettier](https://img.shields.io/badge/Prettier-Code_Formatter-red?style=flat&logo=prettier&logoColor=black)](https://prettier.io/)

[![EditorConfig](https://img.shields.io/badge/EditorConfig-config-orange?logo=editorconfig&logoColor=white)](https://editorconfig.org/)

[![Husky](https://img.shields.io/badge/Husky-Git_Hooks-pink?logo=git)](https://typicode.github.io/husky/)
[![Lint-Staged](https://img.shields.io/badge/Lint_Staged-Precommit-green?logo=git)](https://github.com/okonet/lint-staged)

<!-- 💾 Infraestrutura e controle de versão -->

[![Git](https://img.shields.io/badge/Git-Control-646CFF?style=flat&logo=git)](https://git-scm.com/)
[![GitHub](https://img.shields.io/badge/Repo-Available-181717?style=flat&logo=github&logoColor=white)](https://github.com/VanessaYuriAB/web_project_api_full)

<!-- 🌍 Compatibilidade -->

[![Responsive](https://img.shields.io/badge/UI-Responsive-61DAFB?style=flat)]()

---

<a id="top"></a>

## 📑 Índice

1. [Descrição 📚](#-1-descrição)
2. [Arquitetura do Projeto 🧱](#-2-arquitetura-do-projeto)
3. [Fases do Desenvolvimento 🧩](#-3-fases-do-desenvolvimento)
4. [Funcionalidades Implementadas 🚀](#-4-funcionalidades-implementadas)
5. [Autorização e Autenticação 🔐](#-5-autorização-e-autenticação)
6. [Gerenciamento de Estado Global 🧠](#-6-gerenciamento-de-estado-global)
7. [Proteção de Rota 🛡️](#-7-proteção-de-rota)
8. [Validação de Formulários ✅](#-8-validação-de-formulários)
9. [Tratamento de Erros ⚠️](#-9-tratamento-de-erros)
10. [Estrutura do Projeto 🗃️](#-10-estrutura-do-projeto)
11. [Instalação e Execução 📦](#-11-instalação-e-execução)
12. [Status do Projeto 🚧](#-12-status-do-projeto)
13. [Capturas de Tela 📸](#-13-capturas-de-tela)
14. [Demonstração 🎥](#-14-demonstração)
15. [Melhorias 📈](#-15-melhorias)
16. [Autora 👩‍💻](#-16-autora)

---

<a id="-1-descrição"></a>

## 📚 1. Descrição

O **News Explorer** é uma aplicação web full‑stack que permite aos usuários:

- Pesquisar notícias a partir de palavras‑chave (API de terceiros: [News API](https://newsapi.org/))
- Criar conta e autenticar‑se
- Salvar e remover artigos associados ao seu perfil
- Acessar uma área protegida com artigos salvos

O projeto foi desenvolvido em **fases incrementais**, seguindo os critérios técnicos e de qualidade exigidos pelo bootcamp da **TripleTen**.

[Voltar ao topo 🔝](#top)

---

<a id="-2-arquitetura-do-projeto"></a>

## 🧱 2. Arquitetura do Projeto

- **Frontend**: React + Vite (deploy independente)
- **Backend**: Node.js + Express + MongoDB
- **Autenticação**: JWT
- **Comunicação**: API REST via fetch
- **Deploy**:
  - Frontend: Vercel
  - Backend: servidor próprio em VM no Google Cloud (API acessível via domínio: [https://api.newsexplorer.sevencomets.com](https://api.newsexplorer.sevencomets.com))

📦 Repositório do backend: [https://github.com/VanessaYuriAB/new-explorer-backend](https://github.com/VanessaYuriAB/new-explorer-backend)

📌 Como frontend e backend estão em **origens diferentes**, a aplicação utiliza **CSP via meta tag** no frontend para permitir comunicação segura entre domínios, quando o deploy é separado.

[Voltar ao topo 🔝](#top)

---

<a id="-3-fases-do-desenvolvimento"></a>

## 🧩 3. Fases do Desenvolvimento

### ✅ Fase 1 — Marcação, JSX e API de terceiros

- Interface React
- Pesquisa de notícias
- Estados de carregamento e erro
- Layout responsivo
- Persistência local (fallback)

### ✅ Fase 2 — Backend

- API REST própria
- Modelos e schemas no MongoDB
- Rotas de usuários e artigos
- Autenticação via JWT

### ✅ Fase 3 — Autorização com React

- Integração frontend ↔ backend
- Registro e login
- Proteção de rotas
- Contexto global de usuário
- Persistência e validação do token
- Validação de formulários

[Voltar ao topo 🔝](#top)

---

<a id="-4-funcionalidades-implementadas"></a>

## 🚀 4. Funcionalidades Implementadas

- Cadastro de usuário (`/signup`)
- Login (`/signin`)
- Armazenamento seguro de **JWT**
- Busca de notícias via **API externa**
- Salvamento e remoção de artigos
- Formatação de datas com hook reutilizável aplicado aos cards de artigos
- Página de artigos salvos protegida
- Classificação de palavras pesquisadas em ordem descendente por popularidade
- Cabeçalho com estados **autorizado / não autorizado**
- Persistência de sessão após refresh
- Redirecionamento automático para usuários não autorizados
- Validação instantânea de formulários
- Tratamento de erros

### 📌 Hook de formatação de datas

O hook utilitário (`useFormattedDateBR`) é utilizado para formatar a data de publicação dos artigos conforme o padrão visual do projeto, definido no Figma, usando `Intl.DateTimeFormat` com locale `pt-BR`.

O hook utiliza `useMemo` para evitar processamento desnecessário durante a renderização de múltiplos cards.

[Voltar ao topo 🔝](#top)

---

<a id="-5-autorização-e-autenticação"></a>

## 🔐 5. Autorização e Autenticação

- Autenticação baseada em **JWT**
- O token:
  - É armazenado no **localStorage**
  - É validado pelo servidor
  - É removido no logout
- O frontend **não confia apenas no armazenamento local**:
  - O token é validado via **requisição ao backend**
- O token mantido em estado React (`state`) é a _fonte da verdade_ durante a sessão:
  - `localStorage` é usado apenas para _hidratação inicial_

📌 Um hook personalizado de submissão de formulários (`useFormSubmit`) centraliza:

- `preventDefault` no submit
- Estados de **loading**
- Fluxo de sucesso/erro via callbacks (`onSuccess`, `onError`)

[Voltar ao topo 🔝](#top)

---

<a id="-6-gerenciamento-de-estado-global"></a>

## 🧠 6. Gerenciamento de Estado Global

- `AuthContext`: responsável pelo fluxo de autenticação, armazenando o estado de login e expondo handlers como login, logout e registro.

- `CurrentUserContext`: responsável por armazenar os dados do usuário logado, nome e email.

- `PopupsContext`: responsável pelo controle global dos handlers de abertura e fechamento de popups.

O projeto utiliza a `Context API` do `React` para gerenciar estados globais, **evitando prop drilling** e mantendo as responsabilidades bem separadas, já que são consumidos diretamente pelos componentes que precisam das informações.

Os contextos são criados com `createContext` e incorporados no componente App pelo `.Provider` de cada um.

### 📌 Hook auxiliar de UI global (`useOpenedPopups`)

Hook responsável por centralizar a lógica de abertura de quase todos os popups da aplicação (signin, signup e tooltips), evitando código redundante nos componentes.

O hook encapsula a criação dos objetos de configuração de popups (`type`, `tooltipType` e `children`) e expõe funções semânticas: `openSignin`, `openSignup`, `openSignupTooltip` e `openSearchTooltip`.

O popup de erro de API é tratado separadamente por um hook específico (`useApiError`), melhor detalhado na _seção 9 - Tratamento de Erros_.

[Voltar ao topo 🔝](#top)

---

<a id="-7-proteção-de-rota"></a>

## 🛡️ 7. Proteção de Rota

- A rota `/saved-news` é protegida via HOC (`ProtectedRoute`)
- Comportamento:
  - Usuário não autorizado → redirecionado para `/`
  - Popup de login é aberto automaticamente
- A rota `/` permanece pública
- Usuários logados podem acessar rotas diretamente via URL

[Voltar ao topo 🔝](#top)

---

<a id="-8-validação-de-formulários"></a>

## ✅ 8. Validação de Formulários

Os formulários de **cadastro** e **login** possuem:

- Validação instantânea (`onChange`)
- Campos obrigatórios (`required`)
- Validação via `pattern` + mensagens customizadas (`title`)
- Inputs controlados pelo React (`useState`)
- Validação visual resetada após envio bem-sucedido
- Validação nativa do HTML desativada (`noValidate`)

### 📌 Hook de validação e controle do formulário

Um hook personalizado (`useFormAndValidationWithReset`) centraliza:

- Estado dos campos (`values`)
- Mensagens de erro por campo (`errors`)
- Estado geral de validade (`isFormValid`)
- Reset de valores/erros/validade (`resetForm`)

A validação usa a `Constraint Validation API` (`validationMessage`, `patternMismatch`) e verifica a validade do formulário com `checkValidity()`.

[Voltar ao topo 🔝](#top)

---

<a id="-9-tratamento-de-erros"></a>

## ⚠️ 9. Tratamento de Erros

- Todas as requisições utilizam:
  - Função genérica de verificação de resposta
  - `catch()` no final da cadeia de promessas
- Erros HTTP e erros de rede são tratados separadamente
- Mensagens de erro são exibidas ao usuário via:
  - Mensagem no próprio formulário
  - Popups (tooltips) de feedback
- Handlers **lançam erros** (`throw`) para que o hook de envio possa distinguir:
  - `onSuccess`
  - `onError`

### 📌 Hook de tratamento de erro da API

Um hook personalizado (`useApiError`) centraliza a exibição de erros retornados pela API do backend, durante:

- Salvamento e remoção de artigos
- Execução do efeito de montagem, em erros HTTP, como `500` e `429`

O hook é envolto por uma função (`showApiError`) que recebe o erro capturado e é responsável por:

- Definir a mensagem conforme o status HTTP
- Abrir o popup de erro apropriado (`ApiErrorTooltip`)
- Isolar completamente a lógica de UI do bloco `catch`

Permitindo a reutilização da lógica sem acoplamento aos componentes de UI.

[Voltar ao topo 🔝](#top)

---

<a id="-10-estrutura-do-projeto"></a>

🗃️ 10. Estrutura do Projeto

```
│  src/
│  ├─ assets/
│  ├─ components/
│  │ ├─ About/
│  │ ├─ App/
│  │ ├─ Footer/
│  │ ├─ Header/
│  │ │ └─ componentes/
│  │ │   ├─ ForMobileHeaderAndNav/
│  │ │   └─ Navigation/
│  │ ├─ NewsCardList/
│  │ │ └─ componentes/
│  │ │   └─ NewsCard/
│  │ ├─ NothingFound/
│  │ ├─ Popups/
│  │ │ └─ componentes/
│  │ │   ├─ ApiErrorTooltip/
│  │ │   ├─ SearchTooltip/
│  │ │   ├─ Signin/
│  │ │   ├─ Signup/
│  │ │   └─ SignupTooltip/
│  │ ├─ Preloader/
│  │ ├─ ProtectedRoute/
│  │ ├─ SavedNewsCardList/
│  │ │ └─ componentes/
│  │ │   └─ SavedNewsCard/
│  │ ├─ SavedNewsHeader/
│  │ │ └─ componentes/
│  │ │   ├─ ForMobileSavedNewsHeaderAndNav/
│  │ │   └─ SavedNewsNavigation/
│  │ ├─ SearchMain/
│  │ │ └─ componentes/
│  │ └   └─ SearchForm/
│  ├─ contexts/
│  ├─ hooks/
│  ├─ utils/
│  ├─ index.css
│  └─ main.jsx
├─ .env
├─ .gitignore
├─ package-lock.json
├─ package.json
├─ index.html
├─ README.md
└─ vite.config.js
```

[Voltar ao topo 🔝](#top)

---

<a id="-11-instalação-e-execução"></a>

## 📦 11. Instalação e Execução

### 1️⃣ Clone o repositório

```bash
git clone git@github.com:VanessaYuriAB/new-explorer-frontend.git
cd new-explorer-frontend
```

### 2️⃣ Instale as dependências

```bash
npm install
```

### 3️⃣ Crie o arquivo .env.development na raiz do projeto com as variáveis da News Api:

- URL base da News Api:

  ```env
  # endpoint base da News API

  VITE_BASE_NEWS_API_URL=https://api.exemplo.com
  ```

- Chave de acesso da News Api:

  ```env
  VITE_NEWS_API_KEY=sua-chave-aqui
  ```

### 4️⃣ Execute o projeto em modo de desenvolvimento

```bash
npm run dev
```

📌 O frontend funciona mesmo sem o backend ativo, porém:

- Salvamento e autenticação dependem da API
- O fallback com `localStorage` é usado apenas para a pesquisa de artigos

[Voltar ao topo 🔝](#top)

---

<a id="-12-status-do-projeto"></a>

## 🚧 12. Status do Projeto

- Fase 1 — Concluída

- Fase 2 — Concluída

- Fase 3 — Em finalização / revisão

Projeto pronto para **deploy full‑stack.**

[Voltar ao topo 🔝](#top)

---

<a id="-13-capturas-de-tela"></a>

## 📸 13. Capturas de Tela

- 1️⃣ Tela de Pesquisa (estado inicial)

![Tela de Pesquisa](./screenshots/1tela_de_pesquisa.png)

_Campo de busca, header, layout limpo. "Porta de entrada" do app._

- 2️⃣ Tela com Cards Retornados da Pesquisa

![Tela de Resultados](./screenshots/2tela-de-resultados.png)

_Cards organizados em 3 colunas, botão “Mostrar mais”, imagens, títulos e fontes. O funcionamento principal do projeto._

- 3️⃣ Tela de Cards Salvos

![Tela de Artigos Salvos](./screenshots/3tela-de-artigos-salvos.png)

_Estado logado, ícones de lixeira, lista de artigos salvos, header especial de “Artigos Salvos”. O CRUD (parcial)._

- 4️⃣ Tela do Preloader em ação

![Tela do Preloader](./screenshots/4tela-de-preloader.png)

_Atenção ao UX e uso correto de estado de carregamento._

- 5️⃣ Tela “Nada Encontrado”

![Tela do Nothing Found](./screenshots/5tela-de-nothing-found.png)

_Tratamento de erro/estado vazio._

- 6️⃣ Tooltip do botão de salvar (versão deslogada)

![Tela do Tooltip Login To Save](./screenshots/6tooltip-login-to-save.png)

_O hover com a mensagem “Faça login para salvar artigos”._

[Voltar ao topo 🔝](#top)

---

<a id="-14-demonstração"></a>

## 🎥 14. Demonstração

Vídeo demonstrativo no Loom: [clique aqui](https://www.loom.com/share/b7abb3ad2cc44866975bfcc2a84251f6)

[Voltar ao topo 🔝](#top)

---

<a id="-15-melhorias"></a>

## 📈 15. Melhorias

🧩 **Refatoração da estrutura do cabeçalho (Header)**: atualmente, o projeto utiliza diferentes componentes para representar o cabeçalho da aplicação, considerando variações de estado (usuário logado e deslogado), de rota (página principal e página de artigos salvos) e de responsividade (desktop e dispositivos móveis).

A refatoração visa tornar o código mais modular e sustentável, facilitando futuras alterações de layout, estilo ou regras de navegação:

- Reduzir duplicação de código por meio da extração de componentes menores e reutilizáveis (ex.: logo e menu, navegação, botões de autenticação)
- Centralizar regras comuns de renderização, como links de navegação e estado de autenticação do usuário;
- Preservar o padrão do projeto de um arquivo `.css` para cada componente `.jsx`, mantendo a organização e a separação de responsabilidades
- Melhorar a legibilidade e a manutenibilidade do código sem alterar o comportamento visual ou funcional da interface.

🏷️ **Refatoração da lógica de classificação e exibição de palavras-chave**: a ideia é centralizar a lógica em um trecho mais declarativo e legível, tornando o código mais expressivo, reutilizável e fácil de manter, além de facilitar ajustes futuros na regra de exibição sem impactar outros pontos da aplicação. Ex:

```js
const entries = Object.entries(contagem).sort(
  (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
);

const [first, second, third, ...others] = entries.map((e) => e[0]);

const text =
  entries.length <= 1
    ? first
    : entries.length === 2
      ? `${first} e ${second}`
      : entries.length === 3
        ? `${first}, ${second} e ${third}`
        : `${first}, ${second} e mais ${entries.length - 2}`;
```

🌐 **Mover a integração com a NewsAPI para o backend**: evitando a exposição da API key no frontend. Atualmente, a chave é enviada via query param (`apiKey`) porque o proxy do bootcamp estava gerando erro ao encaminhar via header customizado (`x-api-key`).

📐 **Ajuste no posicionamento do Header**: revisar o comportamento atual para evitar deslocamento artificial do conteúdo. A ideia é reposicionar apenas o Header e eliminar espaçamentos compensatórios (como `height: 100vh` usado apenas para empurrar elementos).

🛈 **Melhoria de acessibilidade no Tooltip**: os tooltips exibidos ao passar o mouse sobre o botão de salvar funciona via CSS. Substituir por um elemento real (como `<span>` ou `<div>`) com `role="tooltip"` para maior acessibilidade e compatibilidade com leitores de tela.

📦 **Unificação de componentes duplicados**: refatorar componentes que possuem lógica ou estrutura muito semelhante, consolidando-os em versões reutilizáveis posicionadas um nível acima na arquitetura. Reduz redundância, facilita manutenção e deixa o código mais limpo.

[Voltar ao topo 🔝](#top)

---

<a id="-16-autora"></a>

## 👩‍💻 16. Autora

Desenvolvido com `React`, dedicação e muitos estudos por **Vanessa Yuri A. Brito**.

Explorando o universo do `front‑end` um componente por vez. Aplicando boas práticas, arquitetura, integração com `backend`e autorização segura baseada em `JWT`.

[Voltar ao topo 🔝](#top)
