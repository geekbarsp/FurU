<p align="center">
  <img src="public/images/logo-4k-transparent.png" alt="FurU" width="420" />
</p>

<h1 align="center">FurU</h1>

## Overview

FurU is a polished, responsive pet adoption and responsible rehoming experience built with Next.js, TypeScript, React Three Fiber, Framer Motion, React Hook Form-ready patterns, and Zod-ready service boundaries.

## Run locally (Command Prompt)

```bat
cd C:\Users\Jay\Desktop\VSCode\web\FurU
npm install
npm run dev
```

Open `http://localhost:3000`. Production verification:

```bat
npm run typecheck
npm run lint
npm run build
```

## Connect Supabase

1. Create a Supabase project.
2. Open **SQL Editor** and run the migrations in filename order:
   - `supabase/migrations/202608050001_furu_core.sql`
   - `supabase/migrations/202608060001_auth_roles_security.sql`
3. In Supabase, open **Connect** and copy the project URL and publishable key.
4. In Command Prompt, create your local environment file:

```bat
copy .env.example .env.local
notepad .env.local
```

Fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-cloudflare-turnstile-site-key
```

Then restart the development server:

```bat
npm run dev
```

The migration creates profiles, listings, adoption applications, reviews, favorites, conversations, messages, monitoring check-ins, reports, and the avatar bucket. Row Level Security restricts private records to the appropriate signed-in users. Never put a Supabase service-role key in a `NEXT_PUBLIC_` variable or browser code.

### Auth configuration

Create a Cloudflare Turnstile widget for the app's hostnames, copy its site key
into `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, then enable Turnstile in Supabase under
**Authentication → Bot and Abuse Protection** using the matching secret key.
Local development uses Cloudflare's always-pass test widget when no site key is
set; production requires a real site key.

In **Authentication → URL Configuration**, set the production Site URL and add these redirect URLs (plus the equivalent preview URLs):

```text
http://localhost:3000/auth/callback
http://localhost:3000/update-password
```

For six-digit email login, edit **Authentication → Email Templates → Magic Link** and include `{{ .Token }}` in the message. If the template retains `{{ .ConfirmationURL }}`, users receive a magic link instead; FurU's callback supports that flow too. Configure custom SMTP before production—the built-in sender is intended only for limited testing.

Personal accounts may be guardians, adopters, or both. Welfare-organization accounts remain restricted until an administrator verifies them directly in a trusted environment:

```sql
update public.profiles
set welfare_org_verified = true
where id = 'organization-user-uuid'
  and 'welfare_org' = any(roles);
```

Do not expose that operation through a browser client or a public API.

Existing demo accounts stored in a browser cannot be safely migrated because their passwords were only local demo data. Register those accounts again after Supabase is enabled.

### Vercel

In the Vercel project, open **Settings → Environment Variables** and add all three variables above for Production and Preview. Redeploy the latest commit. Also set the Supabase **Authentication → URL Configuration** Site URL to the production Vercel address and add the preview/localhost callback URLs you use.

Production verification:

```bash
npm run typecheck
npm run lint
npm run build
```

## Demo routes

- `/` — cinematic homepage with interactive procedural 3D pets
- `/browse` — search, filters, sorting, favorites, and empty states
- `/pets/luna` — full pet profile (all 12 seeded pets have routes)
- `/application/luna` — five-step adoption application with save-draft feedback
- `/listings/new` — five-step responsible rehoming form
- `/sign-in` and `/sign-up` — authentication interfaces
- `/dashboard` — role switcher for adopter, guardian, and organization views
- `/messages`, `/appointments`, `/verification`, `/resources`, `/volunteer`, `/donations`, `/lost-and-found`, `/foster`, `/help`, `/admin`, `/privacy`, `/terms` — supporting product surfaces

Supabase is required for authentication. The old browser-only account fallback is disabled by default so protected pages cannot be bypassed with local storage. It can be enabled only for isolated UI prototyping in development with `NEXT_PUBLIC_ENABLE_LOCAL_AUTH=true`; it does not bypass server-protected routes.

## Architecture

- `src/app` contains route-level screens and metadata.
- `src/components` holds the shared navigation, cards, footer, and dynamically loaded 3D scene.
- `src/lib/data.ts` contains typed demo entities and 12 realistic, fictional pet profiles.
- `public/images` contains original AI-generated visual assets created specifically for FurU.

The 3D hero uses procedural geometry, constrained device pixel ratio, dynamic loading, and a static generated-image fallback. Reduced-motion preferences disable the canvas and nonessential movement. Pet locations are deliberately approximate.

## Generated imagery

All photography in the product was generated for this project with the built-in image generation workflow. The final prompt set requested warm, humane Philippine adoption-campaign photography: a wide group portrait plus a precise six-pet portrait sheet featuring an aspin, calico cat, rabbit, senior black dog, orange kitten, and cream terrier mix. Constraints prohibited people, cages, branding, text, watermarks, distress, and anatomical distortion. The sheet was cropped into the individual listing assets in `public/images`.
