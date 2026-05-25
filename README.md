# B2B Commerce Capability Planner

Interactive B2B feature planning tool for [Extend Commerce](https://extendcommerce.com) by [Codup](https://codup.co).

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and add your Anthropic API key
3. Run dev server: `npm run dev`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_ANTHROPIC_API_KEY` | Anthropic API key for the AI feature analysis |

## Deploy (Netlify)

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Environment variable:** Set `VITE_ANTHROPIC_API_KEY` in Netlify → Site settings → Environment variables

Netlify Forms is auto-detected from the hidden form in `index.html`. After first deploy, configure email notifications in Netlify → Forms → planner-submissions → Notifications → send to `support@extendcommerce.com`.

## Updating Feature Data

The feature matrix is driven entirely by `src/data/features.csv`. To add, remove, or modify features:

1. Edit `src/data/features.csv` — columns are `id`, `feature`, `category`, `provider`, `app`
   - `provider`: must be `Shopify`, `Extend`, or `Codup`
   - `app`: only required for `Extend` rows — must match a key in `APP_STORE_LINKS` in `features.ts`
   - `id`: keep stable (used for localStorage persistence of user selections)
2. Commit and push to git
3. Netlify rebuilds automatically — the new data is live within ~30 seconds

No code changes are needed for data-only edits.
