# LineHack Backend

Minimal Express + TypeScript backend scaffold.

## Scripts

- `npm run dev` - start development server with nodemon (auto-reload)
- `npm run build` - compile TypeScript to `dist`
- `npm start` - run compiled JavaScript from `dist`

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Visit: http://localhost:3001/health

## Project Structure

```
src/
  server.ts          # Entry point
  routes/            # Route definitions (to add)
  controllers/       # Controller logic (to add)
  middleware/        # Custom middleware (to add)
  config/            # Configuration helpers (to add)
  utils/             # Utilities (to add)
```

Feel free to extend folders as needed.
