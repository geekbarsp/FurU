# FurU marketplace setup

## 1. Apply the database migration

In Supabase Dashboard, open **SQL Editor**, paste the full contents of:

`supabase/migrations/202608060002_marketplace_flows.sql`

Run it once after the two earlier FurU migrations. A successful run normally says `Success. No rows returned`.

The migration adds saved-search storage, mutual contact consent, meet-and-greet scheduling, moderated Trust Scores, monitoring escalations, reminder jobs, and the `pet-photos` Storage bucket with ownership policies.

## 2. Deploy reminder delivery

The site creates in-app, email, and SMS jobs automatically when a guardian accepts an application. Deploy the worker:

```powershell
supabase functions deploy process-notification-jobs --no-verify-jwt
```

Set these Edge Function secrets:

```powershell
supabase secrets set CRON_SECRET="a-long-random-secret"
supabase secrets set RESEND_API_KEY="your-resend-api-key"
supabase secrets set REMINDER_FROM_EMAIL="FurU <updates@your-verified-domain.com>"
supabase secrets set TWILIO_ACCOUNT_SID="your-twilio-account-sid"
supabase secrets set TWILIO_AUTH_TOKEN="your-twilio-auth-token"
supabase secrets set TWILIO_FROM_NUMBER="your-twilio-number"
```

Call the function on a schedule (for example every 15 minutes) with:

```text
Authorization: Bearer <CRON_SECRET>
```

Use Supabase Cron, Vercel Cron, or another scheduler. The function URL is shown after deployment. Resend needs a verified sender domain; Twilio needs an SMS-capable number and properly formatted Philippine recipient numbers.

## 3. Vercel variables

The marketplace uses the same public Supabase variables already used by FurU:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL=https://fur-u.vercel.app
```

Provider secrets belong in Supabase Edge Function secrets, not in browser-visible `NEXT_PUBLIC_*` variables.
