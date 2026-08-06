import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { listingRowToPet } from "@/lib/data";

const privateHeaders = { "Cache-Control": "private, no-store" };

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("pet_listings")
    .select("id,name,animal_type,breed,age,location,reason,details")
    .eq("id", id)
    .eq("status", "Published")
    .maybeSingle();

  if (!data) {
    return NextResponse.json(
      { error: "This pet listing is unavailable." },
      { status: 404, headers: privateHeaders },
    );
  }

  return NextResponse.json(listingRowToPet(data), { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" } });
}
