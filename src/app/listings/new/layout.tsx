import { requirePageAuth } from "@/lib/auth";

export default async function NewListingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requirePageAuth("/listings/new", ["guardian", "welfare_org"]);
  return children;
}
