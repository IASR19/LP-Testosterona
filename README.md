# Link Pages — Grape Clinic

App unificado com as landing pages de lead magnet:

- `/endometriose`
- `/testosterona`
- `/` → redireciona para `https://www.grapeclinic.com.br/`

Domínio alvo: `https://link-page.grapeclinic.com.br`

## Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- `motion/react`

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra:

- [http://localhost:3000/endometriose](http://localhost:3000/endometriose)
- [http://localhost:3000/testosterona](http://localhost:3000/testosterona)

## Conteúdo por campanha

| Campanha | Config | Chat |
|----------|--------|------|
| Endometriose | `src/content/endometriose/` | `chat-flow.ts` |
| Testosterona | `src/content/testosterona/` | `chat-flow.ts` |

Assets em `public/images/<campanha>/`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run optimize:final-screen -- endometriose
npm run optimize:final-screen -- testosterona
```

## Deploy (Vercel)

1. Root Directory: pasta deste app (`LP-Testosterona` ou o nome que usar no repo).
2. Domínio customizado: `link-page.grapeclinic.com.br`
3. DNS: CNAME `link-page` → `cname.vercel-dns.com`
