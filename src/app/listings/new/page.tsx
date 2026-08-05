"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  HeartHandshake,
  ImagePlus,
  Save,
  ShieldCheck,
} from "lucide-react";
import { addListing, useAccount } from "@/lib/furu-store";
const steps = [
  "Pet basics",
  "Their story",
  "Health & records",
  "The right home",
  "Photos & promise",
];
export default function NewListing() {
  const account = useAccount();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [values, setValues] = useState<Record<string, string>>({
    type: "Dog",
    sex: "Female",
    size: "Medium",
    energy: "Moderate",
    training: "In training",
    vaccination: "Up to date",
    fixed: "Yes",
    children: "Yes",
    cats: "Unknown",
    dogs: "Yes",
    urgency: "Standard",
  });
  const update = (name: string, value: string) =>
    setValues((v) => ({ ...v, [name]: value }));
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!account) return;
    try {
      await addListing({
        id: `listing-${Date.now()}`,
        ownerEmail: account.email,
        name: values.name,
        type: values.type,
        breed: values.breed,
        age: values.age,
        location: values.location,
        reason: values.reason,
        status: "Published",
        createdAt: new Date().toISOString(),
        details: values,
      });
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to publish this pet.",
      );
    }
  }
  if (!account)
    return (
      <main className="page">
        <div className="shell">
          <div className="form-card form-head">
            <HeartHandshake
              size={52}
              style={{ margin: "auto", color: "var(--orange)" }}
            />
            <span className="eyebrow">Responsible rehoming starts here</span>
            <h2>Sign in to create a pet profile.</h2>
            <p>
              Your listing, applicants, conversations, and handover monitoring
              will stay together in one private workspace.
            </p>
            <div className="hero-actions" style={{ justifyContent: "center" }}>
              <Link className="btn btn-primary" href="/sign-up">
                Create an account
              </Link>
              <Link className="btn btn-ghost" href="/sign-in">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  if (done)
    return (
      <main className="page">
        <div className="shell">
          <div className="form-card success-state">
            <CheckCircle2 size={58} />
            <span className="eyebrow">Published</span>
            <h2>{values.name} is now listed.</h2>
            <p>
              Adopters can discover the profile immediately. You can manage
              applicants and monitoring from your dashboard.
            </p>
            <Link href="/dashboard" className="btn btn-primary">
              Manage this listing
            </Link>
          </div>
        </div>
      </main>
    );
  return (
    <main className="page rehome-page">
      <div className="shell">
        <div className="rehome-intro">
          <div>
            <span className="eyebrow">Rehome with care</span>
            <h1>Find the right next home.</h1>
            <p>
              Tell the whole story. FurU helps you review applicants, plan a
              safe handover, and follow the pet’s adjustment afterward.
            </p>
          </div>
          <div className="rehome-assurance">
            <ShieldCheck />
            <b>No selling or breeding</b>
            <span>
              Your pet profile is published as soon as you complete it.
            </span>
          </div>
        </div>
        <div className="workflow">
          <aside className="workflow-steps">
            {steps.map((label, i) => (
              <div
                className={`workflow-step ${i === step ? "active" : ""} ${i < step ? "complete" : ""}`}
                key={label}
              >
                <span>{i < step ? "✓" : i + 1}</span>
                <div>
                  <b>{label}</b>
                  <small>
                    {i === step
                      ? "In progress"
                      : i < step
                        ? "Complete"
                        : "Up next"}
                  </small>
                </div>
              </div>
            ))}
            <div className="care-note">
              <ClipboardCheck />
              <b>What happens next?</b>
              <p>
                Your listing publishes immediately. You stay in control of who
                can meet and adopt your pet.
              </p>
            </div>
          </aside>
          <form className="form-card listing-form" onSubmit={submit}>
            <span className="eyebrow">Step {step + 1} of 5</span>
            <h2>{steps[step]}</h2>
            <p>
              {step === 0
                ? "Start with details adopters use to understand basic fit."
                : step === 1
                  ? "Honesty helps your pet reach a home prepared for them."
                  : step === 2
                    ? "Share current care needs—unknown answers are okay."
                    : step === 3
                      ? "Describe the environment where your pet can thrive."
                      : "Recent, clear photos help adopters connect with your pet."}
            </p>
            <div className="progress">
              <span style={{ width: `${(step + 1) * 20}%` }} />
            </div>
            {step === 0 && (
              <div className="form-grid">
                <F n="name" l="Pet name" v={values.name} u={update} />
                <S
                  n="type"
                  l="Animal type"
                  o={["Dog", "Cat", "Rabbit", "Other"]}
                  v={values.type}
                  u={update}
                />
                <F n="breed" l="Breed or mix" v={values.breed} u={update} />
                <S
                  n="sex"
                  l="Sex"
                  o={["Female", "Male", "Unknown"]}
                  v={values.sex}
                  u={update}
                />
                <F n="age" l="Age" v={values.age} u={update} />
                <S
                  n="size"
                  l="Size"
                  o={["Small", "Medium", "Large"]}
                  v={values.size}
                  u={update}
                />
                <F
                  n="location"
                  l="City / municipality"
                  wide
                  v={values.location || account.location}
                  u={update}
                />
                <F
                  n="reason"
                  l="Why are you rehoming?"
                  wide
                  area
                  v={values.reason}
                  u={update}
                />
              </div>
            )}
            {step === 1 && (
              <div className="form-grid">
                <F
                  n="personality"
                  l="Personality in a few words"
                  wide
                  v={values.personality}
                  u={update}
                />
                <S
                  n="energy"
                  l="Energy level"
                  o={["Low", "Moderate", "High"]}
                  v={values.energy}
                  u={update}
                />
                <S
                  n="training"
                  l="Training status"
                  o={["Not started", "In training", "Trained"]}
                  v={values.training}
                  u={update}
                />
                <F
                  n="routine"
                  l="Daily routine and behavior"
                  wide
                  area
                  v={values.routine}
                  u={update}
                />
                <F
                  n="favorites"
                  l="Favorite things"
                  wide
                  v={values.favorites}
                  u={update}
                />
              </div>
            )}
            {step === 2 && (
              <div className="form-grid">
                <S
                  n="vaccination"
                  l="Vaccination status"
                  o={["Up to date", "In progress", "Unknown"]}
                  v={values.vaccination}
                  u={update}
                />
                <S
                  n="fixed"
                  l="Spayed / neutered"
                  o={["Yes", "No", "Unknown"]}
                  v={values.fixed}
                  u={update}
                />
                <F
                  n="medical"
                  l="Medical conditions or ongoing care"
                  wide
                  area
                  v={values.medical}
                  u={update}
                  optional
                />
                <F
                  n="vet"
                  l="Veterinary clinic"
                  wide
                  v={values.vet}
                  u={update}
                  optional
                />
                <div className="notice wide">
                  <ShieldCheck size={19} /> Records remain private and are
                  shared only with authorized reviewers and the selected
                  adopter.
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="form-grid">
                <S
                  n="children"
                  l="Good with children"
                  o={["Yes", "No", "Unknown"]}
                  v={values.children}
                  u={update}
                />
                <S
                  n="cats"
                  l="Good with cats"
                  o={["Yes", "No", "Unknown"]}
                  v={values.cats}
                  u={update}
                />
                <S
                  n="dogs"
                  l="Good with dogs"
                  o={["Yes", "No", "Unknown"]}
                  v={values.dogs}
                  u={update}
                />
                <S
                  n="urgency"
                  l="Rehoming urgency"
                  o={["Standard", "Soon", "Urgent"]}
                  v={values.urgency}
                  u={update}
                />
                <F
                  n="adopter"
                  l="What should the next guardian be ready for?"
                  wide
                  area
                  v={values.adopter}
                  u={update}
                />
                <F
                  n="home"
                  l="Ideal home environment"
                  wide
                  area
                  v={values.home}
                  u={update}
                />
              </div>
            )}
            {step === 4 && (
              <div>
                <div className="photo-drop">
                  <ImagePlus size={38} />
                  <h3>Add recent photos</h3>
                  <p>
                    Choose at least one clear JPG, PNG, or WebP image. Photos
                    are preview-only in this local prototype.
                  </p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    required
                  />
                </div>
                <div className="review-summary">
                  <b>Ready to publish</b>
                  <span>
                    {values.name} · {values.breed} ·{" "}
                    {values.location || account.location}
                  </span>
                </div>
                <label className="consent">
                  <input type="checkbox" required /> I am authorized to rehome
                  this pet, the information is honest, and this is not a sale.
                </label>
              </div>
            )}
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            {saved && (
              <p role="status" className="saved-note">
                Draft saved for this session.
              </p>
            )}
            <div className="form-navigation">
              {step > 0 ? (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setStep(step - 1)}
                >
                  <ArrowLeft size={16} /> Back
                </button>
              ) : (
                <span />
              )}
              <div className="button-group">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setSaved(true)}
                >
                  <Save size={16} /> Save
                </button>
                <button className="btn btn-primary">
                  {step === 4 ? "Publish pet" : "Continue"}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
function F({
  n,
  l,
  v = "",
  u,
  wide = false,
  area = false,
  optional = false,
}: {
  n: string;
  l: string;
  v?: string;
  u: (n: string, v: string) => void;
  wide?: boolean;
  area?: boolean;
  optional?: boolean;
}) {
  return (
    <div className={`field ${wide ? "wide" : ""}`}>
      <label htmlFor={n}>
        {l}
        {optional && <small> (optional)</small>}
      </label>
      {area ? (
        <textarea
          id={n}
          className="input"
          value={v}
          onChange={(e) => u(n, e.target.value)}
          required={!optional}
        />
      ) : (
        <input
          id={n}
          className="input"
          value={v}
          onChange={(e) => u(n, e.target.value)}
          required={!optional}
        />
      )}
    </div>
  );
}
function S({
  n,
  l,
  o,
  v,
  u,
}: {
  n: string;
  l: string;
  o: string[];
  v?: string;
  u: (n: string, v: string) => void;
}) {
  return (
    <div className="field">
      <label htmlFor={n}>{l}</label>
      <select
        id={n}
        className="input"
        value={v}
        onChange={(e) => u(n, e.target.value)}
      >
        {o.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
    </div>
  );
}
