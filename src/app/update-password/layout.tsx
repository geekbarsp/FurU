import { requirePageAuth } from "@/lib/auth";

export default async function UpdatePasswordLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requirePageAuth("/update-password");
  return children;
}
