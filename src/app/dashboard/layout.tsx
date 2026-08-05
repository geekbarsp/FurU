import { requirePageAuth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requirePageAuth("/dashboard");
  return children;
}
