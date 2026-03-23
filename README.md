# Strikeit

A minimal, shareable to-do list app. Create lists instantly and share them via URL. Powered by Supabase Postgres + Realtime.

**Live Demo**: [https://rg-strikeit.vercel.app/](https://rg-strikeit.vercel.app/)

## Features

- Share lists via custom URLs
- Real-time sync via Supabase Realtime (no polling)
- Drag-and-drop task reordering
- Dark-mode premium UI
- No login required
- Optimistic updates with rollback

## Setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free project
2. In the **SQL Editor**, run the contents of `supabase/schema.sql` to create the tasks table and enable realtime

### 2. Set environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Find these in your Supabase project: **Settings → API**

### 3. Install and run

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Deploy

Deploy on [Vercel](https://vercel.com/) and add the three Supabase env vars in your project settings.

## Database Schema

See `supabase/schema.sql` — run it in your Supabase SQL Editor once.

## License

MIT
