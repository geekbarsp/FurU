import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
const headers = { "Cache-Control": "private, no-store" };
export async function GET() {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401, headers });
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("notification_jobs").select("id,template_key,scheduled_for,payload,status").eq("recipient_id", auth.userId).eq("channel", "in_app").lte("scheduled_for", new Date().toISOString()).order("scheduled_for", { ascending: false }).limit(30);
  if (error) return NextResponse.json([], { headers });
  return NextResponse.json(data || [], { headers });
}
