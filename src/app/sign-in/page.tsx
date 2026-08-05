"use client";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Heart } from "lucide-react";
import { signIn } from "@/lib/furu-store";
export default function SignIn() {
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(e.currentTarget);
    if (await signIn(String(data.get("email")), String(data.get("password"))))
      location.href = "/dashboard";
    else {
      setBusy(false);
      setError(
        "That email and password don’t match, or the email has not been confirmed.",
      );
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
            <span className="eyebrow">Your pet care workspace</span>
            <h2>Welcome back.</h2>
            <p>
              Review listings, applicants, monitoring updates, and adoption
              activity.
            </p>
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              className="input"
              type="email"
              required
            />
          </div>
          <div className="field" style={{ marginTop: 14 }}>
            <label htmlFor="password">Password</label>
            <div className="password-wrap">
              <input
                id="password"
                name="password"
                className="input"
                type={show ? "text" : "password"}
                minLength={8}
                required
              />
              <button
                type="button"
                className="icon-btn password-toggle"
                onClick={() => setShow(!show)}
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button className="btn btn-primary full-btn" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
          <p className="center-copy">
            Need an account?{" "}
            <Link href="/sign-up">
              <b>Create one</b>
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
