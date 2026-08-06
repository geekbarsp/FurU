"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, MessageCircle, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, useFeedback } from "./FeedbackProvider";
import { addReport, getFavoritePetKeys, setFavorite } from "@/lib/furu-store";

export default function PetProfileActions({
  id,
  name,
  available = true,
}: {
  id: string;
  name: string;
  available?: boolean;
}) {
  const [saved, setSaved] = useState(false);
  const [report, setReport] = useState(false);
  const [startingConversation, setStartingConversation] = useState(false);
  const router = useRouter();
  const { notify } = useFeedback();
  useEffect(() => {
    let active = true;
    void getFavoritePetKeys().then((keys) => {
      if (active) setSaved(keys.includes(id));
    });
    return () => {
      active = false;
    };
  }, [id]);
  async function toggle() {
    const next = !saved;
    try {
      await setFavorite(id, next);
      setSaved(next);
      notify(
        next
          ? `${name} was added to your favorites.`
          : `${name} was removed from your favorites.`,
        "info",
      );
    } catch (error) {
      notify(
        error instanceof Error
          ? error.message
          : "The favorite could not be saved.",
        "info",
      );
    }
  }
  async function submitReport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await addReport(
        id,
        String(form.get("reason")),
        String(form.get("details")),
      );
      setReport(false);
      notify("Thank you. Our moderation team will review this listing.");
    } catch (error) {
      notify(
        error instanceof Error
          ? error.message
          : "The report could not be sent.",
        "info",
      );
    }
  }
  async function askQuestion() {
    if (startingConversation) return;
    setStartingConversation(true);
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: id }),
      });
      const result = await response.json().catch(() => null);
      if (response.status === 401) {
        const destination = `/messages?pet=${id}`;
        router.push(`/sign-in?next=${encodeURIComponent(destination)}`);
        return;
      }
      if (!response.ok || !result?.id) {
        notify(result?.error || "The conversation could not be started.", "info");
        return;
      }
      router.push(`/messages?conversation=${encodeURIComponent(result.id)}`);
    } catch {
      notify("The conversation could not be started.", "info");
    } finally {
      setStartingConversation(false);
    }
  }
  return (
    <>
      {!available ? (
        <div className="hero-actions">
          <Link className="btn btn-primary" href="/dashboard">
            Manage this placement
          </Link>
        </div>
      ) : (
        <>
      <div className="hero-actions">
        <Link className="btn btn-primary" href={`/application/${id}`}>
          Apply to adopt
        </Link>
        <button type="button" className="btn btn-ghost" onClick={toggle}>
          <Heart size={18} fill={saved ? "currentColor" : "none"} />{" "}
          {saved ? "Saved" : "Save"}
        </button>
        <button
          className="btn btn-ghost"
          type="button"
          onClick={askQuestion}
          disabled={startingConversation}
        >
          <MessageCircle size={18} /> {startingConversation ? "Opening conversation…" : "Ask a question"}
        </button>
      </div>
      <button
        type="button"
        className="btn"
        style={{ marginTop: 10, color: "var(--muted)" }}
        onClick={() => setReport(true)}
      >
        <ShieldAlert size={16} /> Report listing
      </button>
      <Dialog
        open={report}
        title="Report this listing"
        onClose={() => setReport(false)}
      >
        <p>
          Tell our welfare team what concerns you. Reports are confidential.
        </p>
        <form onSubmit={submitReport}>
          <div className="field">
            <label htmlFor="report-reason">Reason</label>
            <select id="report-reason" name="reason" className="input">
              <option>Misleading information</option>
              <option>Animal welfare concern</option>
              <option>Possible sale or breeding</option>
              <option>Fraud or unsafe transfer</option>
            </select>
          </div>
          <div className="field" style={{ marginTop: 14 }}>
            <label htmlFor="report-detail">Details</label>
            <textarea
              id="report-detail"
              name="details"
              className="input"
              required
              placeholder="Share what you noticed…"
            />
          </div>
          <button className="btn btn-primary" style={{ marginTop: 18 }}>
            Send confidential report
          </button>
        </form>
      </Dialog>
        </>
      )}
    </>
  );
}
