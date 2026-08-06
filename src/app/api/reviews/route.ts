import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthContext } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({ applicationId: z.string().uuid(), review: z.string().trim().min(20).max(2000), accuracy: z.number().int().min(1).max(5), communication: z.number().int().min(1).max(5), care: z.number().int().min(1).max(5), handover: z.number().int().min(1).max(5) });
const headers = { "Cache-Control": "private, no-store" };
export async function POST(request: Request) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401, headers });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Complete all ratings and write at least 20 characters." }, { status: 400, headers });
  const supabase = await createSupabaseServerClient();
  const { data: application } = await supabase.from("adoption_applications").select("id,applicant_id,listing_id,status,pet_name,pet_listings(owner_id)").eq("id", parsed.data.applicationId).eq("status", "Completed").maybeSingle();
  const relation = application?.pet_listings as unknown as { owner_id?: string } | { owner_id?: string }[] | null;
  const ownerId = Array.isArray(relation) ? relation[0]?.owner_id : relation?.owner_id;
  if (!application || !ownerId || ![application.applicant_id, ownerId].includes(auth.userId)) return NextResponse.json({ error: "This completed handover is unavailable." }, { status: 404, headers });
  const reviewedUserId = auth.userId === application.applicant_id ? ownerId : application.applicant_id;
  const rating = Number(((parsed.data.accuracy + parsed.data.communication + parsed.data.care + parsed.data.handover) / 4).toFixed(1));
  const { data, error } = await supabase.from("reviews").insert({ reviewer_id: auth.userId, reviewed_user_id: reviewedUserId, listing_id: application.listing_id, application_id: application.id, pet_key: application.listing_id, rating, review: parsed.data.review, accuracy: parsed.data.accuracy, communication: parsed.data.communication, care: parsed.data.care, handover: parsed.data.handover, verified: true, moderation_status: "Pending" }).select("id").single();
  if (error?.code === "23505") return NextResponse.json({ error: "You already reviewed this handover." }, { status: 409, headers });
  if (error) return NextResponse.json({ error: "Review could not be submitted." }, { status: 400, headers });
  return NextResponse.json(data, { status: 201, headers });
}
