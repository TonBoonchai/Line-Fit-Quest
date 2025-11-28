# Vercel Deployment Guide

## Project Structure
This project deploys both frontend (Next.js) and backend (Express) as a single Vercel project.

- Frontend: `/frontend` (Next.js app)
- Backend: `/backend` (Express API as serverless functions)

## Deployment Steps

### 1. Install Vercel CLI (if not already installed)
```bash
npm install -g vercel
```

### 2. Deploy from the root directory
```bash
cd /Users/ton/Documents/LineHack
vercel
```

Follow the prompts:
- Set up and deploy: **Yes**
- Which scope: Choose your account
- Link to existing project: **No** (first time)
- Project name: `line-fit-quest` (or your preferred name)
- Directory with code: `./` (current directory - the root)
- Override settings: **No**

### 3. Set Environment Variables in Vercel

Go to your Vercel project dashboard and add these environment variables:

**Backend Variables:**
- `GOOGLE_API_KEY` - Your Google API key
- `DATABASE_URL` - Your Supabase/Postgres connection string
- `SUPABASE_URL` - Your Supabase URL
- `SUPABASE_KEY` - Your Supabase anon key
- Any other env vars from `backend/.env`

**Frontend Variables:**
- `NEXT_PUBLIC_BACKEND_URL` - Leave empty (will use `/api` by default)
- `NEXT_PUBLIC_LIFF_ID` - Your LINE LIFF ID (if applicable)
- Any other env vars from `frontend/.env.local`

### 4. Deploy to Production
```bash
vercel --prod
```

## How It Works

### Routing Configuration
- All requests to `/api/*` → Backend Express app (serverless)
- All other requests → Next.js frontend

### API Endpoints (after deployment)
- `https://your-domain.vercel.app/api/health` - Health check
- `https://your-domain.vercel.app/api/quests` - Quest endpoints
- `https://your-domain.vercel.app/api/generate-image` - Image generation

### Local Development

**Backend:**
```bash
cd backend
npm run dev
```
Runs on http://localhost:5000

**Frontend:**
```bash
cd frontend
npm run dev
```
Runs on http://localhost:3000

## Troubleshooting

### Backend not working on Vercel
- Check Vercel logs: `vercel logs`
- Ensure all environment variables are set in Vercel dashboard
- Check that `backend/src/index.ts` exports the Express app

### Frontend API calls failing
- Verify routes in `vercel.json`
- Check browser console for CORS issues
- Ensure API paths start with `/api/`

### Database connection issues
- Verify `DATABASE_URL` is set in Vercel
- Check if your database allows connections from Vercel IPs
- For Supabase, ensure connection pooling is enabled

## Notes
- The backend runs as serverless functions on Vercel
- Cold starts may occur if the function hasn't been called recently
- Database migrations should be run separately (not during deployment)
