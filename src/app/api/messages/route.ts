import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthContext } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({ conversationId: z.string().uuid(), body: z.string().trim().min(1).max(4000) });
const headers = { "Cache-Control": "private, no-store" };
export async function POST(request: Request) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401, headers });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Write a message before sending." }, { status: 400, headers });
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("messages").insert({ conversation_id: parsed.data.conversationId, sender_id: auth.userId, body: parsed.data.body }).select("id,sender_id,body,created_at").single();
  if (error) return NextResponse.json({ error: error.message.includes("contact") ? "Email addresses and phone numbers stay hidden until both people agree to share contact details." : "Message could not be sent." }, { status: 400, headers });
  return NextResponse.json(data, { status: 201, headers });
}
