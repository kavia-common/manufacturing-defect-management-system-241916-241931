# Defect Management Frontend (Next.js)

## Environment variables

This frontend expects **public** runtime configuration via `NEXT_PUBLIC_*` variables.

### Backend API

- `NEXT_PUBLIC_API_BASE_URL` (recommended)

Examples:

```bash
# Local backend preview
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Hosted/preview backend
NEXT_PUBLIC_API_BASE_URL=https://<your-backend-preview-host>
```

If `NEXT_PUBLIC_API_BASE_URL` is not set, the app defaults to:

- `http://localhost:8000`

### Supabase (Auth)

The app uses Supabase for authentication.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

These can be **placeholder values** for UI work that doesn’t require login; the app will still build.
However, any auth action (sign-in/session checks) will throw a clear runtime error unless these are set correctly.

Example placeholders:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Getting Started

First, install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:3000 with your browser to see the result.
