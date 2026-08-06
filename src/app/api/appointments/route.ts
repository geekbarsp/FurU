import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthContext } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({ conversationId: z.string().uuid(), startsAt: z.string().datetime(), venueName: z.string().trim().min(2).max(160), venueAddress: z.string().trim().min(2).max(300), notes: z.string().trim().max(1000).default("") });
const headers = { "Cache-Control": "private, no-store" };
export async function POST(request: Request) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401, headers });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Complete the meeting details." }, { status: 400, headers });
  const supabase = await createSupabaseServerClient();
  const { data: conversation } = await supabase.from("conversations").select("id").eq("id", parsed.data.conversationId).maybeSingle();
  if (!conversation) return NextResponse.json({ error: "Conversation unavailable." }, { status: 404, headers });
  const { data, error } = await supabase.from("meet_and_greets").insert({ conversation_id: conversation.id, proposed_by: auth.userId, starts_at: parsed.data.startsAt, venue_name: parsed.data.venueName, venue_address: parsed.data.venueAddress, notes: parsed.data.notes }).select("*").single();
  if (error) return NextResponse.json({ error: "Meet-and-greet could not be scheduled." }, { status: 400, headers });
  return NextResponse.json(data, { status: 201, headers });
}

const updateSchema = z.object({ appointmentId: z.string().uuid(), status: z.enum(["Confirmed", "Declined", "Cancelled"]) });
export async function PATCH(request: Request) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401, headers });
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid meeting update." }, { status: 400, headers });
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("meet_and_greets").update({ status: parsed.data.status, updated_at: new Date().toISOString() }).eq("id", parsed.data.appointmentId).select("id,status").single();
  if (error) return NextResponse.json({ error: "Meeting could not be updated." }, { status: 400, headers });
  return NextResponse.json(data, { headers });
}
