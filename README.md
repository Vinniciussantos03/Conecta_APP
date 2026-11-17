# Conecta — protótipo (front-end)

Plataforma que aproxima grandes marcas de pequenos criadores de conteúdo. Este repositório contém apenas o front-end do protótipo, com dados fictícios.

Segue a mesma base do front da Velha Guarda: React + Vite + TypeScript, ícones `lucide-react`, CSS único com tokens semânticos de tema (`data-theme` claro/escuro salvo no navegador), fontes Outfit + DM Sans, mocks em `src/mocks/` e breakpoints 1250 / 1050 / 760 / 490 px.

## Acesso de demonstração

- Usuário: `andressa`
- Senha: `12345`

## Telas

- **Login** — validação local das credenciais acima.
- **Início** — resumo da semana, indicadores e atalhos.
- **Marcas** — oportunidades de grandes marcas, o que cada uma procura, filtros por segmento, busca, salvar e candidatar-se.
- **Meu perfil** — perfil público, força do perfil (completude) e edição do cadastro.
- **Dados** — crescimento nas últimas 4/8/12 semanas, empresas que viram o perfil, segmentos e redes.

## Executar

```bash
npm install
npm run dev     # ambiente local
npm run build   # build de produção (dist/)
npm run lint
```

## Deploy

Projeto pronto para a Vercel (framework Vite, saída `dist/`, configurado em `vercel.json`).
