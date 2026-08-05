"use client";
import Link from "next/link";
import { ArrowLeft, MessageCircle, ShieldCheck } from "lucide-react";
import PersonStars from "@/components/PersonStars";
import { useAccount } from "@/lib/furu-store";
import { personReviews, personTrustScore } from "@/lib/person-reviews";
export default function ProfileReviewsPage() {
  const account = useAccount();
  if (!account)
    return (
      <main className="page">
        <div className="shell">
          <div className="form-card form-head">
            <h2>Sign in to view profile reviews.</h2>
            <Link href="/sign-in" className="btn btn-primary">
              Sign in
            </Link>
          </div>
        </div>
      </main>
    );
  return (
    <main className="page person-reviews-page">
      <div className="shell">
        <Link href="/profile" className="back-link">
          <ArrowLeft /> Back to profile
        </Link>
        <div className="reviews-title">
          <div>
            <span className="eyebrow">Reviews for {account.name}</span>
            <h1>Trusted by the people who met them.</h1>
            <p>
              Every review is connected to a real FurU conversation, meet-up, or
              handover.
            </p>
          </div>
          <div className="review-score-large">
            <ShieldCheck />
            <b>{personTrustScore.toFixed(1)}</b>
            <PersonStars rating={personTrustScore} size={23} />
            <span>{personReviews.length} verified reviewers</span>
          </div>
        </div>
        <div className="reviews-layout">
          <section className="people-reviews">
            {personReviews.map((review) => (
              <article className="person-review-card" key={review.id}>
                <header>
                  <span className="reviewer-photo">
                    {review.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <div>
                    <h3>{review.name}</h3>
                    <span>
                      {review.relationship} · {review.pet}
                    </span>
                  </div>
                  <div className="reviewer-rating">
                    <PersonStars rating={review.rating} />
                    <b>{review.rating.toFixed(1)}</b>
                  </div>
                </header>
                <p>“{review.review}”</p>
                <div className="review-category-row">
                  <span>
                    Accuracy <b>{review.accuracy}/5</b>
                  </span>
                  <span>
                    Communication <b>{review.communication}/5</b>
                  </span>
                  <span>
                    Care <b>{review.care}/5</b>
                  </span>
                  <span>
                    Handover <b>{review.handover}/5</b>
                  </span>
                </div>
                <small>{review.date}</small>
              </article>
            ))}
          </section>
          <aside className="review-policy">
            <MessageCircle />
            <h3>How reviews work</h3>
            <p>
              Reviews help the community understand a person’s accuracy,
              communication, animal care, and handover process.
            </p>
            <ul>
              <li>Only verified interactions can be reviewed</li>
              <li>The reviewed person cannot edit feedback</li>
              <li>Reports are checked for safety and abuse</li>
              <li>Scores update as new reviews arrive</li>
            </ul>
          </aside>
        </div>
      </div>
    </main>
  );
}
