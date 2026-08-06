import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthContext } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const headers = { "Cache-Control": "private, no-store" };
const createSchema = z.object({ applicationId: z.string().uuid(), dayNumber: z.union([z.literal(2), z.literal(7), z.literal(14), z.literal(30)]), notes: z.string().trim().min(10).max(3000), welfareStatus: z.enum(["Doing well", "Needs support", "Urgent concern"]), photoUrl: z.string().url().max(1000).or(z.literal("")) });

export async function GET(request: Request) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401, headers });
  const applicationId = new URL(request.url).searchParams.get("applicationId");
  if (!applicationId || !z.string().uuid().safeParse(applicationId).success) return NextResponse.json({ error: "Monitoring case unavailable." }, { status: 404, headers });
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("monitoring_checkins").select("id,day_number,notes,welfare_status,photo_url,created_at,submitted_by").eq("application_id", applicationId).order("day_number");
  if (error) return NextResponse.json({ error: "Monitoring case unavailable." }, { status: 404, headers });
  return NextResponse.json(data || [], { headers });
}

export async function POST(request: Request) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401, headers });
  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Complete the check-in before submitting." }, { status: 400, headers });
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("monitoring_checkins").upsert({ application_id: parsed.data.applicationId, submitted_by: auth.userId, day_number: parsed.data.dayNumber, notes: parsed.data.notes, welfare_status: parsed.data.welfareStatus, photo_url: parsed.data.photoUrl || null }, { onConflict: "application_id,day_number,submitted_by" }).select("*").single();
  if (error) return NextResponse.json({ error: "Check-in could not be submitted." }, { status: 400, headers });
  if (parsed.data.welfareStatus === "Urgent concern") await supabase.from("monitoring_escalations").insert({ application_id: parsed.data.applicationId, checkin_id: data.id, reported_by: auth.userId, severity: "Urgent", status: "Open" });
  return NextResponse.json(data, { status: 201, headers });
}
