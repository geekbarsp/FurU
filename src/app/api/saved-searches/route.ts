import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthContext } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
const headers = { "Cache-Control": "private, no-store" };
export async function GET() {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401, headers });
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("saved_searches").select("id,name,criteria").eq("user_id", auth.userId).order("created_at", { ascending: false }).limit(8);
  if (error) return NextResponse.json({ error: "Saved searches could not be loaded." }, { status: 400, headers });
  return NextResponse.json(data || [], { headers });
}
const schema = z.object({ name: z.string().trim().min(1).max(80), criteria: z.record(z.string(), z.unknown()) });
export async function POST(request: Request) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401, headers });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Search could not be saved." }, { status: 400, headers });
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("saved_searches").insert({ user_id: auth.userId, name: parsed.data.name, criteria: parsed.data.criteria }).select("id,name,criteria").single();
  if (error) return NextResponse.json({ error: "Search could not be saved." }, { status: 400, headers });
  return NextResponse.json(data, { status: 201, headers });
}
export async function DELETE(request: Request) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401, headers });
  const id = new URL(request.url).searchParams.get("id");
  if (!id || !z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "Saved search unavailable." }, { status: 404, headers });
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("saved_searches").delete().eq("id", id).eq("user_id", auth.userId);
  if (error) return NextResponse.json({ error: "Saved search could not be removed." }, { status: 400, headers });
  return NextResponse.json({ ok: true }, { headers });
}
