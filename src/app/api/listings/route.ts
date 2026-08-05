import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthContext, hasCapability } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const listingSchema = z.object({
  name: z.string().trim().min(1).max(80),
  type: z.string().trim().min(1).max(40),
  breed: z.string().trim().min(1).max(100),
  age: z.string().trim().min(1).max(60),
  location: z.string().trim().min(1).max(160),
  reason: z.string().trim().min(10).max(4000),
  details: z.record(z.string(), z.string()).default({}),
});

const privateHeaders = { "Cache-Control": "private, no-store" };

export async function POST(request: Request) {
  const auth = await getAuthContext();
  if (!auth) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401, headers: privateHeaders },
    );
  }
  if (!hasCapability(auth, ["guardian", "welfare_org"])) {
    return NextResponse.json(
      { error: "Your account cannot create pet listings." },
      { status: 403, headers: privateHeaders },
    );
  }

  const parsed = listingSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "The listing details are invalid." },
      { status: 400, headers: privateHeaders },
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("pet_listings")
    .insert({
      owner_id: auth.userId,
      name: parsed.data.name,
      animal_type: parsed.data.type,
      breed: parsed.data.breed,
      age: parsed.data.age,
      location: parsed.data.location,
      reason: parsed.data.reason,
      status: "Published",
      details: parsed.data.details,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "The listing could not be created." },
      { status: 400, headers: privateHeaders },
    );
  }
  return NextResponse.json(data, { status: 201, headers: privateHeaders });
}
