# LP Testosterona — Grape Clinic

Landing page de lead magnet (chatbot + tela final do ebook) da Grape Clinic — campanha de testosterona masculina.

Espelho estrutural da [LP-Endometriose](../LP-Endometriose).

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

Abra [http://localhost:3000](http://localhost:3000).

## Configuração

Links do ebook e do grupo WhatsApp ficam em `src/content/lead-magnet.ts`.  
Roteiro do chat em `src/content/chat-flow.ts` (baseado no export Typebot).

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```
