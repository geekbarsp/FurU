import { NextResponse, type NextRequest } from "next/server";
import { getAuthContext, hasCapability } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const privateHeaders = { "Cache-Control": "private, no-store" };

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getAuthContext();
  if (!auth) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401, headers: privateHeaders },
    );
  }
  if (!hasCapability(auth, ["adopter"])) {
    return NextResponse.json(
      { error: "This pet listing is unavailable." },
      { status: 404, headers: privateHeaders },
    );
  }

  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("pet_listings")
    .select("id,name,animal_type,breed,age,location,details")
    .eq("id", id)
    .eq("status", "Published")
    .neq("owner_id", auth.userId)
    .maybeSingle();

  if (!data) {
    return NextResponse.json(
      { error: "This pet listing is unavailable." },
      { status: 404, headers: privateHeaders },
    );
  }

  const details = (data.details || {}) as Record<string, string>;
  return NextResponse.json(
    {
      id: data.id,
      name: data.name,
      type: data.animal_type,
      breed: data.breed,
      age: data.age,
      location: data.location,
      organization: "FurU guardian",
      description: details.personality || details.routine || "",
    },
    { headers: privateHeaders },
  );
}
