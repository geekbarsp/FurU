import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthContext, hasCapability } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const headers = { "Cache-Control": "private, no-store" };

export async function GET() {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401, headers });
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("conversations").select("id,listing_id,guardian_id,adopter_id,guardian_contact_consent,adopter_contact_consent,created_at,pet_listings(name,location),messages(id,sender_id,body,created_at,read_at),meet_and_greets(id,proposed_by,starts_at,venue_name,venue_address,notes,status)").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Conversations could not be loaded." }, { status: 400, headers });
  return NextResponse.json((data || []).map((conversation) => ({ ...conversation, current_user_id: auth.userId })), { headers });
}

const createSchema = z.object({ listingId: z.string().uuid() });
export async function POST(request: Request) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401, headers });
  if (!hasCapability(auth, ["adopter"])) return NextResponse.json({ error: "Only adopters can start a conversation." }, { status: 403, headers });
  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "This listing is unavailable." }, { status: 404, headers });
  const supabase = await createSupabaseServerClient();
  const { data: listing } = await supabase.from("pet_listings").select("id,owner_id").eq("id", parsed.data.listingId).eq("status", "Published").neq("owner_id", auth.userId).maybeSingle();
  if (!listing) return NextResponse.json({ error: "This listing is unavailable." }, { status: 404, headers });
  const { data: existing, error: lookupError } = await supabase
    .from("conversations")
    .select("id")
    .eq("listing_id", listing.id)
    .eq("guardian_id", listing.owner_id)
    .eq("adopter_id", auth.userId)
    .maybeSingle();
  if (lookupError) return NextResponse.json({ error: "Conversation could not be started." }, { status: 400, headers });
  if (existing) return NextResponse.json(existing, { status: 200, headers });
  const { data, error } = await supabase.from("conversations").insert({ listing_id: listing.id, guardian_id: listing.owner_id, adopter_id: auth.userId }).select("id").single();
  if (error) return NextResponse.json({ error: "Conversation could not be started." }, { status: 400, headers });
  return NextResponse.json(data, { status: 201, headers });
}

const consentSchema = z.object({ conversationId: z.string().uuid(), consent: z.boolean() });
export async function PATCH(request: Request) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401, headers });
  const parsed = consentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid consent update." }, { status: 400, headers });
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("set_contact_consent", { target_conversation: parsed.data.conversationId, consent_value: parsed.data.consent });
  if (error) return NextResponse.json({ error: "Contact preference could not be updated." }, { status: 400, headers });
  return NextResponse.json({ ok: true }, { headers });
}
