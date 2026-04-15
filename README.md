# 🗞️ News Explorer — Frontend

Aplicação **frontend** do projeto **News Explorer**, uma plataforma full stack para
pesquisa e salvamento de notícias, com autenticação JWT e arquitetura desacoplada.

Este repositório contém a **interface web**, desenvolvida com foco em
**arquitetura de estado previsível\***, **boas práticas de React** e
**experiência do usuário**.

\* _Sem efeitos colaterias, baseada em derivação._

---

## 🔗 Demonstração

- 🌐 Aplicação online: https://news-explorer-front-end.vercel.app
- 🔌 API (backend): https://api.newsexplorer.sevencomets.com

---

## 🧠 Destaques Técnicos

- React + Vite
- Gerenciamento global de estado com **Context API + Providers especializados**
- Separação clara entre **Auth**, **User** e **News**
- Uso extensivo de **estado derivado** (`useMemo`) em vez de sincronização por `useEffect`
- Autenticação baseada em **JWT com validação no backend**
- Proteção de rotas com HOC (`ProtectedRoute`)
- Validação instantânea de formulários
- Tratamento centralizado de erros da API
- Deploy independente (frontend ↔ backend desacoplados)

---

## 🧱 Stack

- **Frontend:** React, Vite
- **Estado:** Context API + Hooks customizados
- **Auth:** JWT
- **Estilo:** CSS modular
- **Deploy:** Vercel

---

## 📂 Documentação Técnica

O projeto contém, também, uma versão de **README técnico** que contempla arquitetura,
Providers, hooks, decisões técnicas, melhorias futuras.

➡️ Está disponível aqui:
[_README.technical.md_](https://github.com/VanessaYuriAB/news-explorer-frontend/blob/main/README.technical.md)

---

## 🚀 Status

✔️ Projeto finalizado e funcional  
✔️ Aplicação full stack online  
✔️ Projeto utilizado como peça principal de portfólio

---

Desenvolvido por **Vanessa Yuri A. Brito**
