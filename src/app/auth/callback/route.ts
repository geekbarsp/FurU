import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function safeNext(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//")
    ? value
    : "/dashboard";
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNext(searchParams.get("next"));
  const supabase = await createSupabaseServerClient();

  const result = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash && type
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
      : { error: new Error("Missing authentication token.") };

  if (!result.error) {
    return NextResponse.redirect(new URL(next, origin), {
      headers: { "Cache-Control": "private, no-store" },
    });
  }

  const errorUrl = new URL("/sign-in", origin);
  errorUrl.searchParams.set(
    "error",
    "The sign-in link is invalid or has expired. Request a new one.",
  );
  return NextResponse.redirect(errorUrl, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
