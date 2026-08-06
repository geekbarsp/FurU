import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthContext, hasCapability } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const applicationSchema = z.object({
  petId: z.string().uuid(),
  answers: z.record(z.string(), z.string()).default({}),
});

const privateHeaders = { "Cache-Control": "private, no-store" };

export async function GET() {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401, headers: privateHeaders });
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("adoption_applications")
    .select("id,applicant_id,listing_id,pet_name,status,answers,submitted_at,updated_at,pet_listings(name,owner_id)")
    .order("submitted_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Applications could not be loaded." }, { status: 400, headers: privateHeaders });
  return NextResponse.json((data || []).map((row) => {
    const relation = row.pet_listings as unknown as { owner_id?: string } | { owner_id?: string }[] | null;
    const ownerId = Array.isArray(relation) ? relation[0]?.owner_id : relation?.owner_id;
    return { ...row, is_owner: ownerId === auth.userId };
  }), { headers: privateHeaders });
}

const statusSchema = z.object({
  applicationId: z.string().uuid(),
  status: z.enum(["Monitoring", "Completed", "Declined"]),
});

export async function PATCH(request: Request) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401, headers: privateHeaders });
  if (!hasCapability(auth, ["guardian", "welfare_org"])) return NextResponse.json({ error: "Guardian access required." }, { status: 403, headers: privateHeaders });
  const parsed = statusSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid application update." }, { status: 400, headers: privateHeaders });
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("set_application_status", {
    target_application: parsed.data.applicationId,
    next_status: parsed.data.status,
  });
  if (error) return NextResponse.json({ error: "This application could not be updated." }, { status: 400, headers: privateHeaders });
  return NextResponse.json(data, { headers: privateHeaders });
}

export async function POST(request: Request) {
  const auth = await getAuthContext();
  if (!auth) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401, headers: privateHeaders },
    );
  }
  if (!hasCapability(auth, ["adopter"])) {
    return NextResponse.json(
      { error: "Only adopter accounts can submit applications." },
      { status: 403, headers: privateHeaders },
    );
  }

  const parsed = applicationSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: "This pet listing is unavailable." },
      { status: 404, headers: privateHeaders },
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: listing } = await supabase
    .from("pet_listings")
    .select("id,name,owner_id,status")
    .eq("id", parsed.data.petId)
    .eq("status", "Published")
    .neq("owner_id", auth.userId)
    .maybeSingle();

  // Use the same response for missing and inaccessible records to avoid an
  // identifier oracle.
  if (!listing) {
    return NextResponse.json(
      { error: "This pet listing is unavailable." },
      { status: 404, headers: privateHeaders },
    );
  }

  const { data, error } = await supabase
    .from("adoption_applications")
    .insert({
      applicant_id: auth.userId,
      listing_id: listing.id,
      pet_key: listing.id,
      pet_name: listing.name,
      status: "Under review",
      answers: parsed.data.answers,
    })
    .select("id")
    .single();

  if (error?.code === "23505") {
    return NextResponse.json(
      { error: "You already have an active adoption review or monitoring period." },
      { status: 409, headers: privateHeaders },
    );
  }
  if (error) {
    return NextResponse.json(
      { error: "The application could not be submitted." },
      { status: 400, headers: privateHeaders },
    );
  }
  return NextResponse.json(data, { status: 201, headers: privateHeaders });
}
