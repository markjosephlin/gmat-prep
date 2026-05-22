# GMAT Prep

AI-powered GMAT prep that learns from every question you miss.

## Stack

- **Next.js 15** (App Router)
- **Tailwind CSS** — matching the Mistake to Mastery aesthetic
- **Anthropic SDK** — Claude powers question generation and explanations
- **Supabase** — auth + Postgres (drill history, mistake log, spaced repetition queue)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in:
- `ANTHROPIC_API_KEY` — get from [console.anthropic.com](https://console.anthropic.com)
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from your Supabase project settings
- `SUPABASE_SERVICE_ROLE_KEY` — from Supabase settings (keep server-side only)

### 3. Set up Supabase

Create a new project at [supabase.com](https://supabase.com), then run the schema:

```bash
# Paste supabase/schema.sql into the Supabase SQL Editor and run it
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/practice` | Drill session — AI generates questions by section |
| `/mistakes` | Add a question you got wrong → AI analyzes the gap |
| `/dashboard` | Analytics — weak concepts, mistake causes, streak |
| `/history` | Full drill attempt history |

## Architecture

```
app/
  page.tsx                  # Landing
  (dashboard)/
    practice/page.tsx       # Drill interface
    mistakes/page.tsx       # Add mistake + AI analysis
    dashboard/page.tsx      # Analytics
    history/page.tsx        # Attempt history
  api/
    generate-question/      # POST → Claude generates a GMAT question
    explain/                # POST → Claude explains a wrong answer
    analyze-mistake/        # POST → Claude classifies the mistake
```

## Next steps

- [ ] Wire up Supabase auth (email or Google OAuth)
- [ ] Persist drill attempts to `drill_attempts` table
- [ ] Implement spaced repetition using `drill_queue` table
- [ ] Add streak tracking
- [ ] Add more questions per concept to seed the bank
- [ ] Add Stripe for paid plans
