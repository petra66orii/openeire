# OpenÉire Studios Frontend

## Active application

`openeire-next` is the sole active OpenÉire Studios frontend. It is a Next.js
15 application using React 19, TypeScript, Tailwind CSS, Stripe Elements, and
the native Next.js App Router.

The sibling `openeire` directory contains the retired Vite/React application.
It remains temporarily for migration verification and must not receive new
features or fixes. See `openeire-next/docs/legacy-removal-phase-1.md` before
changing or removing it.

## Repository structure

```text
openeire-next/          # Active Next.js application
  app/                  # App Router pages and layouts
  components/           # Shared and feature components
  lib/                  # API, pricing, auth, SEO, and utility modules
  public/               # Active static assets
  tests/                # Vitest smoke/component tests
  types/                # Shared TypeScript contracts
openeire/               # Legacy Vite application; pending approved removal
```

The repository-root `package.json` and `package-lock.json` are also legacy Vite
artifacts. They are retained until Phase 2 removal is explicitly approved.

## Local development

Requirements: Node.js 22 and npm.

```bash
cd openeire-next
npm ci
cp .env.example .env.local
npm run dev
```

The active development server runs at `http://localhost:3000`.

Environment variables are documented in `openeire-next/.env.example`. Important
runtime settings include the public API origin, Stripe publishable key, Google
OAuth client ID, and Iubenda configuration.

## Checks

Run from `openeire-next`:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

GitHub Actions runs the same checks against `openeire-next/package-lock.json`.

## Deployment

Configure the deployment service with:

- Root directory: `openeire-next`
- Install command: `npm ci`
- Build command: `npm run build`
- Start command: `npm run start`
- Node.js: 22

The Django API must allow the deployed frontend origin through CORS and CSRF
trusted-origin settings. Local Next.js development uses port 3000.

Before changing production settings, complete the smoke checklist in
`openeire-next/docs/legacy-removal-phase-1.md`.

## Historical migration documents

Documents under `openeire-next/docs` whose names contain `audit`, `migration`,
or `route-inventory` describe earlier migration stages. They are retained as
historical implementation records and are not current development instructions.

## Maintainer

- Project/team owner: [Miss Bott](https://github.com/petra66orii)
- Primary frontend maintainer: [Miss Bott](https://github.com/petra66orii)
