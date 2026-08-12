# Link Pages — Grape Clinic

App unificado com as landing pages de lead magnet:

- `/endometriose`
- `/testosterona`
- `/apresentacao`
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
- [http://localhost:3000/apresentacao](http://localhost:3000/apresentacao)

## Conteúdo por campanha

| Campanha | Tipo | Conteúdo |
|----------|------|----------|
| Endometriose | Chat + ebook | `src/content/endometriose/` |
| Testosterona | Chat + ebook | `src/content/testosterona/` |
| Apresentação | Vídeo + formulário de avaliação | `src/content/apresentacao/` |

Assets de imagem em `public/images/<campanha>/`.
Vídeo da apresentação em `public/videos/apresentacao.mp4`.
Logos em `public/brand/`.

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

## Integração GrapeGest

### Chat (`/testosterona`, `/endometriose`)

Ao finalizar o chat, o lead é enviado para:

- endpoint interno: `POST /api/lead`
- webhook: GrapeGest
- sources: `lp-testosterona` / `lp-endometriose`

### Apresentação (`/apresentacao`)

Ao enviar o formulário de avaliação:

- endpoint interno: `POST /api/avaliacao`
- webhook: GrapeGest
- source: `lp-grapeclinic`
- após sucesso: Meta Pixel `Lead` + redirect ao WhatsApp da clínica com as respostas

Configure o token em `.env.local` (veja `.env.example`):

```bash
GRAPEGEST_TOKEN=seu_token_aqui
```

Na Vercel, adicione a mesma variável de ambiente.

## Deploy (Vercel)

1. Root Directory: pasta deste app (`LPs` ou o nome que usar no repo).
2. Domínio customizado: `link-page.grapeclinic.com.br`
3. DNS: CNAME `link-page` → `cname.vercel-dns.com`
4. Env: `GRAPEGEST_TOKEN`
