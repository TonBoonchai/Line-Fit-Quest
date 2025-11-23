# LineHack

Monorepo containing a backend (Node/TypeScript) API and a frontend (Next.js) application.

## Structure

```
backend/   # Express/TypeScript server (entry: src/server.ts)
frontend/  # Next.js app (pages + src components)
```

## Prerequisites

- Node.js (recommend LTS >= 18)
- npm, yarn, or pnpm (choose one and stay consistent)

## Initial Setup

Install dependencies for each package:

```bash
cd backend && npm install
cd ../frontend && npm install
```

## Running Development

Backend (adjust script names if different):

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

The frontend dev server usually runs on `http://localhost:3000`; backend run on `http://localhost:3001`;

## Environment Variables

Create `.env` files inside `backend/` and `frontend/` as needed. Do **not** commit secrets. Example placeholders can live in `.env.example`.

## Scripts (Typical)

In `backend/package.json` you might have:

- `dev`: ts-node/tsx watcher
- `build`: tsc compile

In `frontend/package.json` (Next.js):

- `dev`: next dev
- `build`: next build
- `start`: next start (production)

## Linting & Formatting

Run lint (adjust if using a different config):

```bash
cd frontend
npm run lint
```

Add similar script in backend if ESLint configured.

## Testing

Add tests under `backend/src/__tests__/` and `frontend/src/__tests__/` (or your chosen structure). Example run:

```bash
npm test
```

(Configure Jest / Vitest as preferred.)

## Deployment

- Backend: build (`npm run build`) then deploy `dist/` to your server/container.
- Frontend: `npm run build` creates `.next/` output; deploy via Vercel or a Node server.

## Git Hygiene

Global `.gitignore` added to exclude OS artifacts, build outputs, logs, and secrets. Lock files (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`) are intentionally **not** ignored—commit them for reproducible installs.

## Contributing

1. Create a feature branch: `git checkout -b feature/xyz`
2. Make changes & commit with clear messages.
3. Open a pull request for review.

## License

Add a license section here if applicable.

---

Feel free to extend this README with API specs, architectural diagrams, or workflows as the project evolves.
