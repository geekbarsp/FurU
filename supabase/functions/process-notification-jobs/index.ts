import { createClient } from "npm:@supabase/supabase-js@2";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

Deno.serve(async (request) => {
  if (request.headers.get("authorization") !== `Bearer ${Deno.env.get("CRON_SECRET")}`) return json({ error: "Unauthorized" }, 401);
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return json({ error: "Supabase service configuration missing" }, 500);
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
  const { data: jobs, error } = await supabase.from("notification_jobs").select("*").eq("status", "Queued").lte("scheduled_for", new Date().toISOString()).limit(50);
  if (error) return json({ error: error.message }, 500);
  const results = [];
  for (const job of jobs || []) {
    try {
      if (job.channel === "email") await sendEmail(supabase, job);
      if (job.channel === "sms") await sendSms(supabase, job);
      await supabase.from("notification_jobs").update({ status: "Sent", sent_at: new Date().toISOString() }).eq("id", job.id);
      results.push({ id: job.id, status: "Sent" });
    } catch (caught) {
      await supabase.from("notification_jobs").update({ status: "Failed" }).eq("id", job.id);
      results.push({ id: job.id, status: "Failed", error: caught instanceof Error ? caught.message : "Unknown error" });
    }
  }
  return json({ processed: results.length, results });
});

async function sendEmail(supabase: ReturnType<typeof createClient>, job: Record<string, unknown>) {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("REMINDER_FROM_EMAIL");
  if (!resendKey || !from) throw new Error("Email provider not configured");
  const { data } = await supabase.auth.admin.getUserById(String(job.recipient_id));
  if (!data.user?.email) throw new Error("Recipient email unavailable");
  const payload = job.payload as { pet_name?: string; day?: number };
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: [data.user.email], subject: `FurU day ${payload.day} pet check-in`, text: `It’s time to share the day ${payload.day} adjustment update for ${payload.pet_name || "your pet"}. Sign in to FurU to add notes and a photo.` }) });
  if (!response.ok) throw new Error("Email delivery failed");
}

async function sendSms(supabase: ReturnType<typeof createClient>, job: Record<string, unknown>) {
  const sid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const token = Deno.env.get("TWILIO_AUTH_TOKEN");
  const from = Deno.env.get("TWILIO_FROM_NUMBER");
  if (!sid || !token || !from) throw new Error("SMS provider not configured");
  const { data: profile } = await supabase.from("profiles").select("phone").eq("id", job.recipient_id).single();
  if (!profile?.phone) throw new Error("Recipient phone unavailable");
  const payload = job.payload as { pet_name?: string; day?: number };
  const form = new URLSearchParams({ To: profile.phone, From: from, Body: `FurU: Day ${payload.day} check-in for ${payload.pet_name || "your pet"} is ready. Sign in to share an update.` });
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, { method: "POST", headers: { Authorization: `Basic ${btoa(`${sid}:${token}`)}`, "Content-Type": "application/x-www-form-urlencoded" }, body: form });
  if (!response.ok) throw new Error("SMS delivery failed");
}
