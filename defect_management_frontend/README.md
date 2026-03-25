# Defect Management Frontend (Next.js)

## Environment variables

This frontend expects **public** runtime configuration via `NEXT_PUBLIC_*` variables.

### Backend API

The API client reads:

- `NEXT_PUBLIC_API_BASE_URL`

Note: the container env set also includes `NEXT_PUBLIC_API_BASE` and `NEXT_PUBLIC_BACKEND_URL`, but the code currently uses `NEXT_PUBLIC_API_BASE_URL`.

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

The Supabase client reads:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Note: the container env set also includes `NEXT_PUBLIC_SUPABASE_KEY`, but the code currently uses `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

These can be **placeholder values** for UI work that doesn’t require login; the app will still build.
However, any auth action (sign-in/session checks) will throw a clear runtime error unless these are set correctly.

Example:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://fdxlxsldusunyltneupg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_2X2VTfNHNZSugkScYcAzBg_NlLjo_VT
```

## Getting Started

First, install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:3000 with your browser to see the result.
