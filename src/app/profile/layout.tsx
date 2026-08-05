import { requirePageAuth } from "@/lib/auth";

export default async function ProfileLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requirePageAuth("/profile");
  return children;
}
