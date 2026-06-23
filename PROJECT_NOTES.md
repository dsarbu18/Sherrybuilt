# Sheridan Built Ltd. — Project Notes

## Portfolio Image Workflow

Adding new portfolio images requires **no code changes and no GitHub push**.
Everything is managed through Supabase.

---

### Step-by-step: adding a new image

**1. Upload to Supabase Storage**

Go to: https://supabase.com/dashboard/project/ikqkpmviogbeowjqpfdp/storage/buckets/portfolio

Upload your image into the matching category folder:

| Folder | Category shown on site |
|---|---|
| `portfolio/Exterior/` | Exterior |
| `portfolio/Interior/` | Interior |
| `portfolio/Basements/` | Basements |
| `portfolio/Kitchens/` | Kitchens |
| `portfolio/Bathrooms/` | Bathrooms |
| `portfolio/Decks/` | Decks |

Supported formats: `.jpg` `.jpeg` `.png` `.webp` (any case)

Tip: name files descriptively, e.g. `front-stairs-railing.jpg` — the filename
(without extension, hyphens replaced with spaces) becomes the image title.

**2. Go to the admin sync page**

Navigate to: https://sheridanbuilt.ca/#/admin

(This page is intentionally hidden from the main navigation.)

**3. Click "Sync Portfolio Images"**

The sync function will:
- Scan all category folders in Storage
- Find any image files not already in the database
- Insert them with `visible = true` automatically

You will see a summary: images found / inserted / skipped.

**4. Refresh the portfolio page**

Go to https://sheridanbuilt.ca/#/portfolio — new images appear immediately.

---

### Hiding or reordering images

In the Supabase Table Editor → `portfolio_images`:

| Field | Effect |
|---|---|
| `visible` | Set to `false` to hide an image without deleting it |
| `sort_order` | Lower number = appears first within a category |
| `is_featured` | Reserved for future featured/hero use |
| `title` | Overrides the auto-generated filename title |

---

### Edge Function: sync-portfolio-images

Location: `supabase/functions/sync-portfolio-images/index.ts`

- Called via `POST` from the admin page using the public anon key
- Uses `SUPABASE_SERVICE_ROLE_KEY` server-side to read Storage and write to the table
- The service role key is **never** sent to the browser
- Only inserts rows — never deletes or modifies existing ones
- Safe to run multiple times (duplicates are prevented by unique constraint on `storage_path`)

**Deploying the Edge Function** (run once from your machine or CI):

```bash
supabase functions deploy sync-portfolio-images --project-ref ikqkpmviogbeowjqpfdp
```

Or via the Supabase dashboard → Edge Functions → Deploy.

---

### Database migrations

SQL files in `supabase/migrations/` must be run manually in the Supabase SQL Editor.

| File | Purpose |
|---|---|
| `20260623_portfolio.sql` | Creates `portfolio_images` table, RLS policy, storage bucket |
| `20260623_portfolio_v2.sql` | Adds unique constraint on `storage_path` (run after v1) |

---

### Local development

```bash
pnpm run dev
# Site runs at http://localhost:5173
# Admin page at http://localhost:5173/#/admin
```

The portfolio page fetches live from Supabase even locally — no mocks needed.

---

### Deployment

GitHub Actions deploys automatically on every push to `main`.
The workflow is at `.github/workflows/deploy.yml`.

**GitHub is only needed for code/design changes.**
Portfolio image updates go through Supabase only — no GitHub push required.

---

### Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, MUI, Tailwind |
| Routing | React Router (HashRouter for GitHub Pages) |
| Hosting | GitHub Pages + custom domain (sheridanbuilt.ca) |
| Database | Supabase (Postgres) |
| Storage | Supabase Storage (`portfolio` bucket, public) |
| Functions | Supabase Edge Functions (Deno) |
| Email | Resend (via Edge Function server) |
| Fonts | Playfair Display, Libre Baskerville, Barlow (Google Fonts) |
