"use client";
import { Star } from "lucide-react";
import { useState } from "react";
import { useFeedback } from "@/components/FeedbackProvider";
const keys = ["accuracy", "communication", "care", "handover"] as const;
export default function HandoverReviewForm({ applicationId }: { applicationId: string }) {
  const [scores, setScores] = useState({ accuracy: 5, communication: 5, care: 5, handover: 5 });
  const [review, setReview] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const { notify } = useFeedback();
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError("");
    const response = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ applicationId, review, ...scores }) });
    const result = await response.json().catch(() => null);
    if (!response.ok) return setError(result?.error || "Review could not be submitted.");
    setDone(true); notify("Review submitted for moderation.");
  }
  if (done) return <div className="form-card success-state"><Star size={48} /><h2>Thank you for the honest feedback.</h2><p>Your verified review is awaiting moderation. Approved reviews contribute to the public Trust Score.</p></div>;
  return <form className="form-card handover-review-form" onSubmit={submit}><span className="eyebrow">Verified handover</span><h2>Rate the experience</h2><p>Each category contributes equally to the 1–5 Trust Score.</p>{keys.map((key) => <div className="category-rating" key={key}><b>{key === "accuracy" ? "Listing accuracy" : key.charAt(0).toUpperCase() + key.slice(1)}</b><div className="rating-input">{[1,2,3,4,5].map((number) => <button type="button" key={number} onClick={() => setScores((current) => ({ ...current, [key]: number }))} aria-label={`${number} stars for ${key}`}><Star fill={number <= scores[key] ? "currentColor" : "none"} /></button>)}</div></div>)}<div className="field"><label>What should the community know?</label><textarea className="input" rows={6} minLength={20} maxLength={2000} required value={review} onChange={(event) => setReview(event.target.value)} /></div>{error && <p className="error">{error}</p>}<button className="btn btn-primary full-btn">Submit verified review</button></form>;
}
