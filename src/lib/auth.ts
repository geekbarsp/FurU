import "server-only";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AccountRole = "guardian" | "adopter" | "welfare_org";

export type AuthContext = {
  userId: string;
  roles: AccountRole[];
  welfareOrgVerified: boolean;
};

export async function getAuthContext(): Promise<AuthContext | null> {
  const supabase = await createSupabaseServerClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (claimsError || typeof userId !== "string") return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("roles,welfare_org_verified")
    .eq("id", userId)
    .maybeSingle();
  if (profileError || !profile) return null;

  return {
    userId,
    roles: (profile.roles || []) as AccountRole[],
    welfareOrgVerified: Boolean(profile.welfare_org_verified),
  };
}

export function hasCapability(
  auth: AuthContext,
  allowedRoles: AccountRole[],
) {
  return allowedRoles.some((role) => {
    if (!auth.roles.includes(role)) return false;
    return role !== "welfare_org" || auth.welfareOrgVerified;
  });
}

export async function requirePageAuth(
  nextPath: string,
  allowedRoles?: AccountRole[],
) {
  const auth = await getAuthContext();
  if (!auth) redirect(`/sign-in?next=${encodeURIComponent(nextPath)}`);
  if (allowedRoles && !hasCapability(auth, allowedRoles)) {
    redirect("/unauthorized");
  }
  return auth;
}
