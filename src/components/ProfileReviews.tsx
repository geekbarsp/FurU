"use client";
import Link from "next/link";
import { Star, ShieldCheck } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { useFeedback } from "./FeedbackProvider";
import { useAccount } from "@/lib/furu-store";

type Review = {
  name: string;
  rating: number;
  date: string;
  details: string;
  accuracy: number;
  communication: number;
  care: number;
  handover: number;
};
const seeded: Review[] = [
  {
    name: "Mara D.",
    rating: 5,
    date: "June 2026",
    details:
      "The profile matched the pet exactly. Records were organized, questions were answered clearly, and the introduction was calm and unhurried.",
    accuracy: 5,
    communication: 5,
    care: 5,
    handover: 5,
  },
  {
    name: "Paolo R.",
    rating: 4,
    date: "April 2026",
    details:
      "A thoughtful guardian who shared the complete routine and checked in after the handover. Scheduling took a little time, but expectations were clear.",
    accuracy: 5,
    communication: 4,
    care: 5,
    handover: 4,
  },
  {
    name: "Lea S.",
    rating: 5,
    date: "February 2026",
    details:
      "We received honest health details and practical supplies for the first week. The follow-up support made the adjustment much easier.",
    accuracy: 5,
    communication: 5,
    care: 5,
    handover: 5,
  },
];
const subscribeReviews = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener("furu-reviews", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("furu-reviews", callback);
  };
};
export default function ProfileReviews({
  profileId,
  guardian,
}: {
  profileId: string;
  guardian: string;
}) {
  const account = useAccount();
  const { notify } = useFeedback();
  const storageKey = `furu-reviews-${profileId}`;
  const savedRaw = useSyncExternalStore(
    subscribeReviews,
    () => localStorage.getItem(storageKey) || "",
    () => "",
  );
  let ownReviews: Review[] = [];
  try { ownReviews = savedRaw ? JSON.parse(savedRaw) : []; } catch { ownReviews = []; }
  const reviews = [...ownReviews, ...seeded];
  const [rating, setRating] = useState(5);
  const [details, setDetails] = useState("");
  const average =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const category = (key: "accuracy" | "communication" | "care" | "handover") =>
    (reviews.reduce((sum, r) => sum + r[key], 0) / reviews.length).toFixed(1);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!account) return;
    const review: Review = {
      name: account.name,
      rating,
      date: "Just now",
      details,
      accuracy: rating,
      communication: rating,
      care: rating,
      handover: rating,
    };
    localStorage.setItem(storageKey, JSON.stringify([review, ...ownReviews]));
    window.dispatchEvent(new Event("furu-reviews"));
    setDetails("");
    notify("Your review was added to this profile.");
  }
  return (
    <section className="profile-reviews">
      <div className="review-heading">
        <div>
          <span className="eyebrow">Guardian reputation</span>
          <h2>Trust Score</h2>
          <p>
            Reviews reflect handover experiences and help adopters understand
            how this guardian communicates and cares for pets.
          </p>
        </div>
        <div className="trust-score">
          <b>{average.toFixed(1)}</b>
          <Stars value={Math.round(average)} />
          <span>{reviews.length} verified reviews</span>
        </div>
      </div>
      <div className="trust-breakdown">
        {[
          ["Listing accuracy", category("accuracy")],
          ["Communication", category("communication")],
          ["Animal care", category("care")],
          ["Safe handover", category("handover")],
        ].map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <b>{value} / 5</b>
            <div className="score-track">
              <i style={{ width: `${Number(value) * 20}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="review-list">
        {reviews.map((review, i) => (
          <article className="review-card" key={`${review.name}-${i}`}>
            <div className="review-meta">
              <span className="review-avatar">{review.name.charAt(0)}</span>
              <div>
                <b>{review.name}</b>
                <small>Verified adoption · {review.date}</small>
              </div>
              <Stars value={review.rating} />
            </div>
            <p>{review.details}</p>
            <div className="review-details">
              <span>Accuracy {review.accuracy}/5</span>
              <span>Communication {review.communication}/5</span>
              <span>Care {review.care}/5</span>
              <span>Handover {review.handover}/5</span>
            </div>
          </article>
        ))}
      </div>
      <div className="leave-review">
        <ShieldCheck />
        <div>
          <h3>Review {guardian}</h3>
          <p>
            Only leave a review based on a genuine conversation, meet-up, or
            completed handover.
          </p>
          {account ? (
            <form onSubmit={submit}>
              <div
                className="rating-input"
                aria-label={`${rating} out of 5 stars`}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    type="button"
                    onClick={() => setRating(n)}
                    aria-label={`${n} stars`}
                    key={n}
                  >
                    <Star fill={n <= rating ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
              <textarea
                className="input"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                minLength={20}
                required
                placeholder="Share details about communication, pet care, and the handover…"
              />
              <button className="btn btn-primary btn-small">Post review</button>
            </form>
          ) : (
            <Link href="/sign-in" className="btn btn-ghost btn-small">
              Sign in to review
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
function Stars({ value }: { value: number }) {
  return (
    <span className="stars" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star size={17} fill={n <= value ? "currentColor" : "none"} key={n} />
      ))}
    </span>
  );
}
