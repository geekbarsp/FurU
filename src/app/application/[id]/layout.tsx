import { requirePageAuth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { pets } from "@/lib/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ApplicationLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}>) {
  await requirePageAuth("/application", ["adopter"]);
  const { id } = await params;
  if (!pets.some((pet) => pet.id === id)) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("pet_listings")
      .select("id")
      .eq("id", id)
      .eq("status", "Published")
      .maybeSingle();
    if (!data) notFound();
  }
  return children;
}
