"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart } from "lucide-react";
import { HumanCheck } from "@/components/HumanCheck";
import { requestPasswordReset } from "@/lib/furu-store";

export default function ForgotPasswordPage() {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaKey, setCaptchaKey] = useState(0);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(event.currentTarget);
    if (!captchaToken) {
      setBusy(false);
      setError("Complete the ‘Are you human?’ check before continuing.");
      return;
    }
    try {
      await requestPasswordReset(String(data.get("email")), captchaToken);
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to send a reset email.",
      );
      setCaptchaToken("");
      setCaptchaKey((current) => current + 1);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page auth-page">
      <div className="shell">
        <form className="form-card" onSubmit={submit}>
          <div className="form-head">
            <Link href="/" className="logo">
              <span className="logo-mark">
                <Heart size={18} fill="currentColor" />
              </span>
              FurU
            </Link>
            <span className="eyebrow">Account recovery</span>
            <h2>Reset your password.</h2>
            <p>
              Enter your email. If an account is eligible, we’ll send recovery
              instructions.
            </p>
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              className="input"
              type="email"
              autoComplete="email"
              required
            />
          </div>
          {!sent && (
            <HumanCheck key={captchaKey} onChange={setCaptchaToken} />
          )}
          {sent && (
            <p className="saved-note" role="status">
              Check your inbox for password recovery instructions.
            </p>
          )}
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button
            className="btn btn-primary full-btn"
            disabled={busy || sent || !captchaToken}
          >
            {busy ? "Sending…" : sent ? "Email sent" : "Send reset email"}
          </button>
          <p className="center-copy">
            <Link href="/sign-in">Return to sign in</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
