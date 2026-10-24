# portfolio

Personal portfolio of Besar Rachmat Ikhsan Pambudi: Next.js 16 + Hono + Cloudflare D1/R2 on Workers via OpenNext. The plan lives in [docs/PLAN.md](docs/PLAN.md).

## Local development

Needs Node 24 (`.nvmrc`; `engine-strict` blocks other versions).

```bash
npm ci
cp .dev.vars.example .dev.vars   # set MANAGE_PATH to a long random value
npm run db:migrate:local
npm run dev                      # http://localhost:3005
```

| Script | What it does |
|---|---|
| `npm run lint` / `typecheck` / `test` | Biome, `tsc`, Vitest (same as the pre-commit hook) |
| `npm run test:e2e` | Playwright against `localhost:3005`; set `BASE_URL` for a deployed URL and `E2E_MANAGE_PATH` for the cache test |
| `npm run preview` | Production build served by workerd on `localhost:8787` |
| `npm run db:migrate:local` / `db:migrate:remote` | Apply `drizzle/` migrations to local or remote D1 |
| `npm run deploy` | Build and deploy to Cloudflare Workers (manual) |
