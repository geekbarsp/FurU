"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Save,
  ShieldAlert,
} from "lucide-react";
import { pets } from "@/lib/data";
import { addApplication, useAccount, useApplications } from "@/lib/furu-store";
const labels = ["About you", "Your home", "Care plan", "References", "Review"];
type ApplicationPet = { id: string; name: string; organization: string };
export default function Application() {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<ApplicationPet | null | undefined>(() =>
    pets.find((candidate) => candidate.id === id),
  );
  const account = useAccount();
  const applications = useApplications();
  const active = applications.find(
    (a) => a.status === "Under review" || a.status === "Monitoring",
  );
  const lock = active
    ? {
        message:
          active.status === "Monitoring"
            ? `You are currently in the post-adoption monitoring period for ${active.petName}. You can apply again after monitoring is completed.`
            : `Your application for ${active.petName} is under review. You can submit another application once a decision is made.`,
      }
    : null;
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({
    do_you_own_or_rent: "Own",
    home_type: "House",
    children_at_home: "No",
    current_pets: "No",
  });
  useEffect(() => {
    if (pet !== undefined) return;
    let activeRequest = true;
    void fetch(`/api/listings/${encodeURIComponent(id)}`, {
      headers: { Accept: "application/json" },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("This pet listing is unavailable.");
        return response.json();
      })
      .then((listing) => {
        if (activeRequest) setPet(listing);
      })
      .catch((requestError) => {
        if (activeRequest) {
          setPet(null);
          setError(
            requestError instanceof Error
              ? requestError.message
              : "This pet listing is unavailable.",
          );
        }
      });
    return () => {
      activeRequest = false;
    };
  }, [id, pet]);
  if (pet === undefined)
    return (
      <main className="page">
        <div className="shell">
          <div className="form-card form-head">
            <h2>Loading pet listing…</h2>
          </div>
        </div>
      </main>
    );
  if (pet === null)
    return (
      <main className="page">
        <div className="shell">
          <div className="form-card form-head">
            <ShieldAlert size={52} />
            <h2>Pet listing unavailable.</h2>
            <p>{error}</p>
            <Link href="/browse" className="btn btn-primary">
              Browse available pets
            </Link>
          </div>
        </div>
      </main>
    );
  if (!account)
    return (
      <main className="page">
        <div className="shell">
          <div className="form-card form-head">
            <ShieldAlert
              size={52}
              style={{ margin: "auto", color: "var(--orange)" }}
            />
            <span className="eyebrow">Account required</span>
            <h2>Sign in before applying for {pet.name}.</h2>
            <p>
              Your account helps us protect pets and keep every application,
              review, and monitoring period accountable.
            </p>
            <div className="hero-actions" style={{ justifyContent: "center" }}>
              <Link href="/sign-up" className="btn btn-primary">
                Create account
              </Link>
              <Link href="/sign-in" className="btn btn-ghost">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  if (lock)
    return (
      <main className="page">
        <div className="shell">
          <div className="form-card form-head">
            <Clock3
              size={52}
              style={{ margin: "auto", color: "var(--orange)" }}
            />
            <span className="eyebrow">Application paused</span>
            <h2>You can’t apply for another pet yet.</h2>
            <p>{lock.message}</p>
            <div className="policy-box">
              <b>Why FurU limits active adoptions</b>
              <span>
                One active review or monitoring period at a time protects animal
                welfare and gives each placement the attention it deserves.
              </span>
            </div>
            <Link href="/dashboard" className="btn btn-primary">
              View current status
            </Link>
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
            <h2>Application submitted.</h2>
            <p>
              {pet.organization} has received your application for {pet.name}.
              Other adoption applications are now paused while this one is under
              review.
            </p>
            <Link href="/dashboard" className="btn btn-primary">
              View application status
            </Link>
          </div>
        </div>
      </main>
    );
  const selectedPet = pet;
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    try {
      await addApplication({
        id: `application-${Date.now()}`,
        userEmail: account!.email,
        petId: selectedPet.id,
        petName: selectedPet.name,
        status: "Under review",
        submittedAt: new Date().toISOString(),
        answers: {
          ...answers,
          full_name: answers.full_name || account!.name,
          contact_number: answers.contact_number || account!.phone,
          city_municipality: answers.city_municipality || account!.location,
        },
      });
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit this application.",
      );
    }
  }
  return (
    <main className="page">
      <div className="shell">
        <form
          className="form-card"
          onSubmit={submit}
          onChange={(event) => {
            const target = event.target as unknown as HTMLInputElement | HTMLSelectElement;
            if (!target.name) return;
            setAnswers((current) => ({
              ...current,
              [target.name]: target instanceof HTMLInputElement && target.type === "checkbox"
                ? String(target.checked)
                : target.value,
            }));
          }}
        >
          <span className="eyebrow">Adoption application · {pet.name}</span>
          <h2>{labels[step]}</h2>
          <p>
            Step {step + 1} of {labels.length} · Only one application can be
            under review at a time.
          </p>
          <div className="progress">
            <span style={{ width: `${((step + 1) / 5) * 100}%` }} />
          </div>
          {step === 0 && (
            <div className="form-grid">
              <Field label="Full name" value={account.name} />
              <Field label="Age" type="number" />
              <Field label="Contact number" value={account.phone} />
              <Field label="Occupation" />
              <Field
                label="City / municipality"
                value={account.location}
                wide
              />
              <Field label="Household size" type="number" />
              <Field label="Emergency contact" />
            </div>
          )}
          {step === 1 && (
            <div className="form-grid">
              <Select
                label="Do you own or rent?"
                options={["Own", "Rent", "Other"]}
              />
              <Select
                label="Home type"
                options={["House", "Apartment", "Condo", "Other"]}
              />
              <Select label="Children at home?" options={["No", "Yes"]} />
              <Select label="Current pets?" options={["No", "Yes"]} />
              <Field label="Describe the available space" wide />
              <label className="wide consent">
                <input name="household_support" type="checkbox" required /> Everyone in my household
                supports this adoption.
              </label>
            </div>
          )}
          {step === 2 && (
            <div className="form-grid">
              <Field label="Primary caregiver" />
              <Field label="Monthly pet-care budget" />
              <Field label="Daily exercise plan" wide />
              <Field label="Veterinary care plan" wide />
              <Field label="Travel and emergency plan" wide />
              <div className="notice wide">
                Fit depends on experience, environment, commitment, and{" "}
                {pet.name}’s individual needs.
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="form-grid">
              <Field label="Personal reference" />
              <Field label="Reference contact" />
              <Field label="Veterinary reference" />
              <Field label="Landlord reference (if applicable)" />
              <div className="notice wide">
                References help guardians make a careful, welfare-first
                decision.
              </div>
            </div>
          )}
          {step === 4 && (
            <div>
              <div className="policy-box">
                <b>What happens after you submit</b>
                <span>
                  The guardian reviews your profile. If selected, you’ll meet
                  safely, complete a handover agreement, and enter a 30-day
                  monitoring period. You cannot apply for another pet while
                  review or monitoring is active.
                </span>
              </div>
              <label className="consent">
                <input name="accuracy_consent" type="checkbox" required /> I confirm these details are
                accurate and accept the one-active-adoption policy.
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
            <div>
              {step > 0 && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setStep(step - 1)}
                >
                  <ArrowLeft size={16} /> Back
                </button>
              )}
            </div>
            <div className="button-group">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setSaved(true)}
              >
                <Save size={16} /> Save
              </button>
              <button className="btn btn-primary">
                {step === 4 ? "Submit application" : "Continue"}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
function fieldName(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}
function Field({
  label,
  type = "text",
  wide = false,
  value,
}: {
  label: string;
  type?: string;
  wide?: boolean;
  value?: string;
}) {
  return (
    <div className={`field ${wide ? "wide" : ""}`}>
      <label>{label}</label>
      <input className="input" name={fieldName(label)} type={type} defaultValue={value} required />
    </div>
  );
}
function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="field">
      <label>{label}</label>
      <select className="input" name={fieldName(label)} required>
        {options.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
    </div>
  );
}
