"use client";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Mail,
  MapPin,
  PawPrint,
  Pencil,
  Phone,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import PersonStars from "@/components/PersonStars";
import { useFeedback } from "@/components/FeedbackProvider";
import {
  useListings,
  updateAvatar,
  updateAccount,
  useAccount,
  type Account,
} from "@/lib/furu-store";
import { personReviews, personTrustScore } from "@/lib/person-reviews";
export default function ProfilePage() {
  const account = useAccount();
  const allListings = useListings();
  const [editing, setEditing] = useState(false);
  if (!account)
    return (
      <main className="page">
        <div className="shell">
          <div className="form-card form-head">
            <UserRound size={50} style={{ margin: "auto" }} />
            <h2>Sign in to see your profile.</h2>
            <p>
              Your public guardian information, pet listings, and reviews live
              here.
            </p>
            <Link href="/sign-in" className="btn btn-primary">
              Sign in
            </Link>
          </div>
        </div>
      </main>
    );
  const listings = allListings.filter((x) => x.ownerEmail === account.email);
  return (
    <main className="page profile-page">
      <div className="shell">
        <section className="person-hero">
          <ProfilePhoto account={account} />
          <div className="person-identity">
            <span className="eyebrow">Guardian profile</span>
            <h1>{account.name}</h1>
            <p>
              {account.bio ||
                "A FurU guardian committed to honest profiles, thoughtful matches, and safe new beginnings."}
            </p>
            <div className="person-meta">
              <span>
                <MapPin /> {account.location}
              </span>
              <span>
                <Mail /> {account.email}
              </span>
              <span>
                <Phone /> {account.phone}
              </span>
            </div>
          </div>
          <button
            className="btn btn-ghost"
            onClick={() => setEditing(!editing)}
          >
            <Pencil size={17} />
            {editing ? "Close editor" : "Edit profile"}
          </button>
        </section>
        {editing && (
          <EditProfile
            key={account.email}
            account={account}
            onDone={() => setEditing(false)}
          />
        )}
        <section className="person-stats">
          <div>
            <b>{listings.length}</b>
            <span>Animals posted</span>
          </div>
          <div>
            <b>{personTrustScore.toFixed(1)}</b>
            <span>Trust Score</span>
          </div>
          <div>
            <b>{personReviews.length}</b>
            <span>People reviewed</span>
          </div>
          <div>
            <b>100%</b>
            <span>Profile complete</span>
          </div>
        </section>
        <section className="person-content">
          <div>
            <div className="section-head compact-head">
              <div>
                <span className="eyebrow">Shared with care</span>
                <h2>Animals posted</h2>
              </div>
              <Link href="/listings/new" className="btn btn-primary btn-small">
                Post another pet
              </Link>
            </div>
            {listings.length ? (
              <div className="posted-grid">
                {listings.map((pet) => (
                  <article className="posted-pet" key={pet.id}>
                    <span className="posted-pet-mark">
                      <PawPrint />
                    </span>
                    <div>
                      <h3>{pet.name}</h3>
                      <p>
                        {pet.breed} · {pet.age}
                        <br />
                        {pet.location}
                      </p>
                      <span className="status">{pet.status}</span>
                    </div>
                    <button className="btn btn-ghost btn-small">Manage</button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="profile-empty">
                <PawPrint />
                <div>
                  <h3>No animals posted yet</h3>
                  <p>
                    Create a complete profile when you’re ready to find a
                    responsible next home.
                  </p>
                </div>
                <Link href="/listings/new" className="btn btn-dark btn-small">
                  Rehome a pet
                </Link>
              </div>
            )}
          </div>
          <aside className="person-review-summary">
            <span className="trust-shield">
              <ShieldCheck />
            </span>
            <span className="eyebrow">Community trust</span>
            <div className="rating-line">
              <b>{personTrustScore.toFixed(1)}</b>
              <PersonStars rating={personTrustScore} size={21} />
            </div>
            <p>
              Reviewed by {personReviews.length} people after conversations,
              meet-ups, and completed handovers.
            </p>
            <div className="mini-breakdown">
              <span>
                Listing accuracy <b>4.8</b>
              </span>
              <span>
                Communication <b>4.4</b>
              </span>
              <span>
                Animal care <b>4.8</b>
              </span>
              <span>
                Safe handover <b>4.2</b>
              </span>
            </div>
            <Link href="/profile/reviews" className="btn btn-primary full-btn">
              Show all reviews <ArrowRight size={17} />
            </Link>
            <small>
              <Star size={13} fill="currentColor" /> Reviews cannot be edited by
              the person being reviewed.
            </small>
          </aside>
        </section>
      </div>
    </main>
  );
}
function ProfilePhoto({ account }: { account: Account }) {
  const { notify } = useFeedback();
  return (
    <div className="person-photo">
      {account.avatar ? (
        <Image
          src={account.avatar}
          alt={`${account.name}'s profile`}
          fill
          sizes="160px"
          unoptimized
        />
      ) : (
        <span>{account.name.charAt(0).toUpperCase()}</span>
      )}
      <label className="photo-edit">
        <Camera />
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file)
              try {
                await updateAvatar(await resizeAvatar(file));
                notify("Your profile picture was updated.");
              } catch {
                notify("That picture could not be processed.", "info");
              }
          }}
        />
        <span className="sr-only">Change profile picture</span>
      </label>
    </div>
  );
}
function EditProfile({
  account,
  onDone,
}: {
  account: Account;
  onDone: () => void;
}) {
  const { notify } = useFeedback();
  const [name, setName] = useState(account.name);
  const [phone, setPhone] = useState(account.phone);
  const [location, setLocation] = useState(account.location);
  const [bio, setBio] = useState(account.bio || "");
  return (
    <form
      className="profile-editor"
      onSubmit={async (e) => {
        e.preventDefault();
        await updateAccount(account.email, {
          name: name.trim(),
          phone,
          location,
          bio,
        });
        notify("Your profile was updated.");
        onDone();
      }}
    >
      <div className="field">
        <label>Username</label>
        <input
          className="input"
          value={name}
          minLength={4}
          maxLength={15}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <small>4–15 characters</small>
      </div>
      <div className="field">
        <label>Phone</label>
        <input
          className="input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label>City / municipality</label>
        <input
          className="input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>
      <div className="field wide">
        <label>About you</label>
        <textarea
          className="input"
          value={bio}
          maxLength={280}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell adopters and guardians about your approach to animal care…"
        />
      </div>
      <button className="btn btn-primary">Save profile</button>
    </form>
  );
}
async function resizeAvatar(file: File) {
  return new Promise<string>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 420;
      canvas.height = 420;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Image processing is unavailable."));
        return;
      }
      const size = Math.min(img.width, img.height);
      ctx.drawImage(
        img,
        (img.width - size) / 2,
        (img.height - size) / 2,
        size,
        size,
        0,
        0,
        420,
        420,
      );
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", 0.84));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to read that image."));
    };
    img.src = objectUrl;
  });
}
