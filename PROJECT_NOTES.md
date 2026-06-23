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

### Admin page security

The `/admin` page and the Edge Function are protected by real Supabase Auth:

| Layer | Protection |
|---|---|
| Admin page (`/#/admin`) | Requires valid Supabase Auth session (email + password) |
| Edge Function | Validates session JWT server-side; rejects expired/forged tokens |
| Admin check | Verifies the authenticated user's ID exists in `admin_users` table |
| Service role key | Never sent to the browser — only used inside the Edge Function |

An unauthenticated visitor sees only a login form. Even if they somehow got
a valid session token, they'd also need to be in the `admin_users` table.

### One-time admin setup

1. Go to Supabase dashboard → **Authentication → Users → Add user**
   - Enter your email and a strong password
   - Copy the UUID shown for the new user

2. In Supabase **SQL Editor**, run:
   ```sql
   insert into admin_users (id, email) values
     ('<your-user-uuid>', 'your@email.com');
   ```

3. Deploy the Edge Function (see below).

You can now sign in at `/#/admin` with those credentials.

---

### Edge Function: sync-portfolio-images

Location: `supabase/functions/sync-portfolio-images/index.ts`

Security flow:
1. Frontend sends `Authorization: Bearer <session.access_token>` (user's real JWT)
2. Edge Function calls `supabase.auth.getUser(jwt)` — rejects invalid/expired tokens
3. Edge Function checks `admin_users` table (via service role) — rejects non-admins
4. Only then scans Storage and inserts missing rows

- The `SUPABASE_SERVICE_ROLE_KEY` is **never** sent to the browser
- Only inserts rows — never deletes or modifies existing ones
- Safe to run multiple times (unique constraint on `storage_path` prevents duplicates)

**Deploying the Edge Function** (run once, requires Supabase CLI):

```bash
supabase functions deploy sync-portfolio-images --project-ref ikqkpmviogbeowjqpfdp
```

Or via the Supabase dashboard → Edge Functions → New function → paste the code.

---

### Database migrations

SQL files in `supabase/migrations/` must be run manually in the Supabase SQL Editor
in order (v1 → v2 → v3).

| File | Purpose |
|---|---|
| `20260623_portfolio.sql` | Creates `portfolio_images` table, RLS policy, storage bucket |
| `20260623_portfolio_v2.sql` | Adds unique constraint on `storage_path` |
| `20260623_portfolio_v3.sql` | Creates `admin_users` table (required for Edge Function auth) |

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
