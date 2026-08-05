"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { updatePassword } from "@/lib/furu-store";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password"));
    if (password !== String(data.get("confirm"))) {
      setError("Passwords do not match.");
      setBusy(false);
      return;
    }
    try {
      await updatePassword(password);
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update password.");
      setBusy(false);
    }
  }

  return (
    <main className="page auth-page">
      <div className="shell">
        <form className="form-card" onSubmit={submit}>
          <div className="form-head">
            <KeyRound size={50} />
            <span className="eyebrow">Account security</span>
            <h2>Choose a new password.</h2>
            <p>Use at least eight characters and keep it unique to FurU.</p>
          </div>
          <div className="field">
            <label htmlFor="password">New password</label>
            <input
              id="password"
              name="password"
              className="input"
              type="password"
              minLength={8}
              autoComplete="new-password"
              required
            />
          </div>
          <div className="field" style={{ marginTop: 14 }}>
            <label htmlFor="confirm">Confirm new password</label>
            <input
              id="confirm"
              name="confirm"
              className="input"
              type="password"
              minLength={8}
              autoComplete="new-password"
              required
            />
          </div>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button className="btn btn-primary full-btn" disabled={busy}>
            {busy ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </main>
  );
}
