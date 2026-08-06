"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Heart } from "lucide-react";
import {
  createAccount,
  resendSignupCode,
  verifySignupOtp,
} from "@/lib/furu-store";

export default function SignUp() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState(false);
  const [error, setError] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationBusy, setVerificationBusy] = useState(false);
  const [resent, setResent] = useState(false);
  const [form, setForm] = useState({
    purpose: "Rehome a pet" as "Rehome a pet" | "Adopt a pet" | "Both",
    accountRole: "guardian" as
      | "guardian"
      | "adopter"
      | "guardian_adopter"
      | "welfare_org",
    organizationName: "",
    name: "",
    phone: "",
    location: "",
    email: "",
    password: "",
    confirm: "",
  });
  const update = (key: keyof typeof form, value: string) =>
    setForm({ ...form, [key]: value });
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const result = await createAccount({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: form.phone,
        location: form.location,
        purpose: form.purpose,
        accountRole: form.accountRole,
        organizationName:
          form.accountRole === "welfare_org"
            ? form.organizationName.trim()
            : undefined,
      });
      setConfirmEmail(result.needsEmailConfirmation);
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create your account.",
      );
    }
  }
  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setVerificationBusy(true);
    setError("");
    try {
      await verifySignupOtp(form.email, verificationCode);
      setConfirmEmail(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The verification code is invalid or expired.");
    } finally {
      setVerificationBusy(false);
    }
  }
  async function resendCode() {
    setVerificationBusy(true);
    setError("");
    try {
      await resendSignupCode(form.email);
      setResent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "A new code could not be sent.");
    } finally {
      setVerificationBusy(false);
    }
  }
  if (done)
    return (
      <main className="page auth-page">
        <div className="shell">
          <div className="form-card success-state">
            <CheckCircle2 size={58} />
            <h2>Your space is ready.</h2>
            <p>
              {form.accountRole === "welfare_org"
                ? confirmEmail
                  ? "Confirm your email first. FurU will review your organization before publishing tools are enabled."
                  : "Your organization account is awaiting verification. You can open the dashboard, but publishing tools stay locked until approval."
                : confirmEmail
                ? "Check your email and confirm your address before signing in."
                : "Your account and rehoming workspace are ready and securely connected."}
            </p>
            {confirmEmail && (
              <form className="signup-code-form" onSubmit={verifyCode}>
                <div className="field">
                  <label htmlFor="signup-code">6-digit verification code</label>
                  <input
                    id="signup-code"
                    className="input"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, ""))}
                    required
                  />
                  <small>Enter the code sent to {form.email}.</small>
                </div>
                {error && <p className="error" role="alert">{error}</p>}
                {resent && <p className="saved-note" role="status">A new verification email was requested.</p>}
                <button className="btn btn-primary full-btn" disabled={verificationBusy}>
                  {verificationBusy ? "Checking…" : "Verify and open my account"}
                </button>
                <button type="button" className="btn btn-ghost full-btn" disabled={verificationBusy} onClick={resendCode}>
                  Send a new code
                </button>
              </form>
            )}
            <div className="hero-actions" style={{ justifyContent: "center" }}>
              {!confirmEmail && form.accountRole === "welfare_org" ? (
                <Link href="/dashboard" className="btn btn-primary">
                  Open dashboard
                </Link>
              ) : !confirmEmail ? (
                <>
                  <Link href="/listings/new" className="btn btn-primary">
                    Rehome a pet
                  </Link>
                  <Link href="/dashboard" className="btn btn-ghost">
                    Open dashboard
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    );
  return (
    <main className="page auth-page">
      <div className="shell">
        <form className="form-card" onSubmit={submit}>
          <div className="form-head">
            <div className="logo">
              <span className="logo-mark">
                <Heart size={18} fill="currentColor" />
              </span>
              FurU
            </div>
            <span className="eyebrow">Account setup · {step} of 3</span>
            <h2>
              {step === 1
                ? "What brings you here?"
                : step === 2
                  ? "Tell us about you."
                  : "Secure your account."}
            </h2>
            <p>
              {step === 1
                ? "We’ll tailor your dashboard around your goal."
                : step === 2
                  ? "Only your city is shown publicly."
                  : "Use these details to return to your workspace."}
            </p>
          </div>
          <div className="progress">
            <span style={{ width: `${(step / 3) * 100}%` }} />
          </div>
          {step === 1 && (
            <div className="choice-grid">
              {(
                [
                  {
                    role: "guardian",
                    purpose: "Rehome a pet",
                    label: "Guardian",
                    copy: "Create listings and choose a responsible next home.",
                  },
                  {
                    role: "adopter",
                    purpose: "Adopt a pet",
                    label: "Adopter",
                    copy: "Browse pets and submit adoption applications.",
                  },
                  {
                    role: "guardian_adopter",
                    purpose: "Both",
                    label: "Guardian + Adopter",
                    copy: "Use both journeys from one personal account.",
                  },
                  {
                    role: "welfare_org",
                    purpose: "Rehome a pet",
                    label: "Welfare Organization",
                    copy: "Manage animals after FurU verifies your organization.",
                  },
                ] as const
              ).map((choice) => (
                <button
                  type="button"
                  className={`purpose-card ${form.accountRole === choice.role ? "selected" : ""}`}
                  onClick={() =>
                    setForm({
                      ...form,
                      accountRole: choice.role,
                      purpose: choice.purpose,
                    })
                  }
                  key={choice.role}
                >
                  <b>{choice.label}</b>
                  <span>{choice.copy}</span>
                </button>
              ))}
            </div>
          )}
          {step === 2 && (
            <div className="form-grid">
              <Field
                label="Username"
                value={form.name}
                minLength={4}
                maxLength={15}
                onChange={(v) => update("name", v)}
              />
              <Field
                label="Phone number"
                type="tel"
                value={form.phone}
                onChange={(v) => update("phone", v)}
              />
              <Field
                label="City / municipality"
                wide
                value={form.location}
                onChange={(v) => update("location", v)}
              />
              {form.accountRole === "welfare_org" && (
                <Field
                  label="Registered organization name"
                  wide
                  value={form.organizationName}
                  onChange={(v) => update("organizationName", v)}
                />
              )}
            </div>
          )}
          {step === 3 && (
            <div className="form-grid">
              <Field
                label="Email"
                type="email"
                wide
                value={form.email}
                onChange={(v) => update("email", v)}
              />
              <Field
                label="Password"
                type="password"
                value={form.password}
                onChange={(v) => update("password", v)}
              />
              <Field
                label="Confirm password"
                type="password"
                value={form.confirm}
                onChange={(v) => update("confirm", v)}
              />
              <label className="wide consent">
                <input type="checkbox" required /> I agree to FurU’s terms,
                privacy policy, and animal welfare commitment.
              </label>
            </div>
          )}
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <div className="form-navigation">
            {step > 1 ? (
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => setStep(step - 1)}
              >
                <ArrowLeft size={16} /> Back
              </button>
            ) : (
              <span />
            )}
            <button className="btn btn-primary">
              {step === 3 ? "Create my account" : "Continue"}
              <ArrowRight size={16} />
            </button>
          </div>
          <p className="center-copy">
            Already registered?{" "}
            <Link href="/sign-in">
              <b>Sign in</b>
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
function Field({
  label,
  type = "text",
  wide = false,
  value,
  onChange,
  minLength,
  maxLength,
}: {
  label: string;
  type?: string;
  wide?: boolean;
  value: string;
  onChange: (v: string) => void;
  minLength?: number;
  maxLength?: number;
}) {
  return (
    <div className={`field ${wide ? "wide" : ""}`}>
      <label>{label}</label>
      <input
        className="input"
        type={type}
        minLength={minLength ?? (type === "password" ? 8 : undefined)}
        maxLength={maxLength}
        placeholder={label === "Username" ? "4–15 characters" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}
