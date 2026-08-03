# FurU

FurU is a polished, responsive pet adoption and responsible rehoming experience built with Next.js, TypeScript, React Three Fiber, Framer Motion, React Hook Form-ready patterns, and Zod-ready service boundaries.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Production verification:

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

Demo sign-in accepts any valid-looking email and password of at least eight characters. Data stays local and no sensitive document is uploaded to a public service.

## Architecture

- `src/app` contains route-level screens and metadata.
- `src/components` holds the shared navigation, cards, footer, and dynamically loaded 3D scene.
- `src/lib/data.ts` contains typed demo entities and 12 realistic, fictional pet profiles.
- `public/images` contains original AI-generated visual assets created specifically for FurU.

The 3D hero uses procedural geometry, constrained device pixel ratio, dynamic loading, and a static generated-image fallback. Reduced-motion preferences disable the canvas and nonessential movement. Pet locations are deliberately approximate.

## Supabase connection plan

This build runs in demo mode and needs no environment variables. For production, create server-only service modules for Supabase auth, Postgres, Realtime, and private Storage. Use these environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Store identity, financial, medical, and application files in private buckets; issue short-lived signed URLs only after server-side role and case-membership checks. Add Row Level Security for every table, schema validation at the server boundary, audit events for moderation, and rate limits for auth, messaging, applications, and reports.

## Generated imagery

All photography in the product was generated for this project with the built-in image generation workflow. The final prompt set requested warm, humane Philippine adoption-campaign photography: a wide group portrait plus a precise six-pet portrait sheet featuring an aspin, calico cat, rabbit, senior black dog, orange kitten, and cream terrier mix. Constraints prohibited people, cages, branding, text, watermarks, distress, and anatomical distortion. The sheet was cropped into the individual listing assets in `public/images`.
