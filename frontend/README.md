# ApplyFlow AI Frontend

This is the React Router v7 UI for ApplyFlow AI. The main user flows are:

- **Landing**: marketing page (`/`)
- **Upload CV**: upload a PDF resume and index it in Pinecone (`/app/upload`)
- **Search/Analyze**: paste a job description and get match results + outreach nudges (`/app/search`)

## Running locally (recommended)

Run the entire stack from the repo root:

```bash
docker compose up --build
```

Then open `http://localhost:5173`.

## Running the frontend only

1. Install dependencies:

```bash
npm install
```

2. Set the AI Engine base URL:

- **Option A (AI Engine local on host)**: set `VITE_AI_API_URL=http://localhost:8000`
- **Option B (AI Engine behind /api prefix)**: set `VITE_AI_API_URL=http://localhost:8000/api`

3. Start dev server:

```bash
npm run dev
```

## Environment variables

- **`VITE_AI_API_URL`**: Base URL for the AI Engine. The UI calls:
  - `POST {VITE_AI_API_URL}/cv/index-cv`
  - `POST {VITE_AI_API_URL}/agent/process`

## Scripts

- **`npm run dev`**: development server (Vite / React Router dev)
- **`npm run build`**: production build
- **`npm run start`**: serve production build
- **`npm run typecheck`**: generate types + run TypeScript checks
