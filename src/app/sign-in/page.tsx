"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Heart } from "lucide-react";
import { HumanCheck } from "@/components/HumanCheck";
import {
  sendEmailOtp,
  signIn,
  verifyEmailOtp,
} from "@/lib/furu-store";

export default function SignIn() {
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [method, setMethod] = useState<"otp" | "password">("otp");
  const [otpSent, setOtpSent] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaKey, setCaptchaKey] = useState(0);

  function destination() {
    const next = new URLSearchParams(window.location.search).get("next");
    return next?.startsWith("/") && !next.startsWith("//")
      ? next
      : "/dashboard";
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email")).trim().toLowerCase();
    const needsCaptcha = method === "password" || !otpSent;

    if (needsCaptcha && !captchaToken) {
      setBusy(false);
      setError("Complete the ‘Are you human?’ check before continuing.");
      return;
    }

    try {
      if (method === "otp") {
        if (!otpSent) {
          await sendEmailOtp(email, captchaToken);
          setOtpEmail(email);
          setOtpSent(true);
          setCaptchaToken("");
          setBusy(false);
          return;
        }
        await verifyEmailOtp(otpEmail, String(data.get("otp")));
        location.href = destination();
        return;
      }

      if (await signIn(email, String(data.get("password")), captchaToken)) {
        location.href = destination();
        return;
      }
      throw new Error(
        "That email and password don’t match, or the email has not been confirmed.",
      );
    } catch (err) {
      setBusy(false);
      setError(err instanceof Error ? err.message : "Unable to sign in.");
      if (needsCaptcha) {
        setCaptchaToken("");
        setCaptchaKey((current) => current + 1);
      }
    }
  }

  function switchMethod(next: "otp" | "password") {
    setMethod(next);
    setOtpSent(false);
    setCaptchaToken("");
    setCaptchaKey((current) => current + 1);
    setError("");
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
            <p>Sign in with a one-time email code or your password.</p>
          </div>

          <div className="button-group" style={{ marginBottom: 18 }}>
            <button
              type="button"
              className={`btn ${method === "otp" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => switchMethod("otp")}
            >
              Email code
            </button>
            <button
              type="button"
              className={`btn ${method === "password" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => switchMethod("password")}
            >
              Password
            </button>
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              className="input"
              type="email"
              defaultValue={otpSent ? otpEmail : undefined}
              readOnly={otpSent}
              autoComplete="email"
              required
            />
          </div>

          {method === "password" && (
            <div className="field" style={{ marginTop: 14 }}>
              <label htmlFor="password">Password</label>
              <div className="password-wrap">
                <input
                  id="password"
                  name="password"
                  className="input"
                  type={show ? "text" : "password"}
                  minLength={8}
                  autoComplete="current-password"
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
              <p className="center-copy" style={{ textAlign: "right" }}>
                <Link href="/forgot-password">Forgot password?</Link>
              </p>
            </div>
          )}

          {method === "otp" && otpSent && (
            <div className="field" style={{ marginTop: 14 }}>
              <label htmlFor="otp">6-digit email code</label>
              <input
                id="otp"
                name="otp"
                className="input"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                required
              />
              <small>Enter the code sent to {otpEmail}.</small>
            </div>
          )}

          {(method === "password" || !otpSent) && (
            <HumanCheck key={captchaKey} onChange={setCaptchaToken} />
          )}

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button
            className="btn btn-primary full-btn"
            disabled={busy || ((method === "password" || !otpSent) && !captchaToken)}
          >
            {busy
              ? "Please wait…"
              : method === "otp" && !otpSent
                ? "Send login code"
                : "Sign in"}
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
