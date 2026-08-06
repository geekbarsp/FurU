"use client";
import Link from "next/link";
import { Star, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useFeedback } from "./FeedbackProvider";
import {
  addProfileReview,
  getProfileReviews,
  useAccount,
  type ProfileReview as Review,
} from "@/lib/furu-store";
const seeded: Review[] = [
  {
    id: "seed-mara",
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
    id: "seed-paolo",
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
    id: "seed-lea",
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
export default function ProfileReviews({
  profileId,
  guardian,
}: {
  profileId: string;
  guardian: string;
}) {
  const account = useAccount();
  const { notify } = useFeedback();
  const [ownReviews, setOwnReviews] = useState<Review[]>([]);
  useEffect(() => {
    let active = true;
    void getProfileReviews(profileId).then((reviews) => {
      if (active) setOwnReviews(reviews);
    });
    return () => {
      active = false;
    };
  }, [profileId]);
  const reviews = [...ownReviews, ...seeded];
  const [scores, setScores] = useState({ accuracy: 5, communication: 5, care: 5, handover: 5 });
  const [details, setDetails] = useState("");
  const average =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const category = (key: "accuracy" | "communication" | "care" | "handover") =>
    (reviews.reduce((sum, r) => sum + r[key], 0) / reviews.length).toFixed(1);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!account) return;
    try {
      await addProfileReview(profileId, scores, details);
      setOwnReviews(await getProfileReviews(profileId));
      setDetails("");
      notify("Your review was added to this profile.");
    } catch (error) {
      notify(
        error instanceof Error
          ? error.message
          : "The review could not be saved.",
        "info",
      );
    }
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
        {reviews.map((review) => (
          <article className="review-card" key={review.id}>
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
              <div className="category-rating-inputs">
                {(["accuracy", "communication", "care", "handover"] as const).map((key) => <RatingInput key={key} label={key === "accuracy" ? "Listing accuracy" : key} value={scores[key]} onChange={(value) => setScores((current) => ({ ...current, [key]: value }))} />)}
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
function RatingInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <div className="category-rating"><span>{label}</span><div className="rating-input" aria-label={`${label}: ${value} out of 5 stars`}>{[1, 2, 3, 4, 5].map((number) => <button type="button" onClick={() => onChange(number)} aria-label={`${number} stars for ${label}`} key={number}><Star fill={number <= value ? "currentColor" : "none"} /></button>)}</div></div>;
}
