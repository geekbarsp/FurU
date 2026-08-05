"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  ClipboardList,
  HeartHandshake,
  Home,
  MessageCircle,
  PlusCircle,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import {
  getAdoptionLock,
  useAccount,
  useListings,
  type UserListing,
} from "@/lib/furu-store";
import { useFeedback } from "@/components/FeedbackProvider";
const tabs = [
  ["Overview", Home],
  ["My pets", HeartHandshake],
  ["Applicants", UserCheck],
  ["Monitoring", ShieldCheck],
  ["Messages", MessageCircle],
  ["Notifications", Bell],
] as const;
export default function Dashboard() {
  const account = useAccount();
  const allListings = useListings();
  const [tab, setTab] = useState("Overview");
  const { notify } = useFeedback();
  if (!account)
    return (
      <main className="page">
        <div className="shell">
          <div className="form-card form-head">
            <h2>Your dashboard is private.</h2>
            <p>Sign in to manage pet listings, applicants, and monitoring.</p>
            <Link href="/sign-in" className="btn btn-primary">
              Sign in
            </Link>
          </div>
        </div>
      </main>
    );
  const listings = allListings.filter((x) => x.ownerEmail === account.email);
  const lock = getAdoptionLock(account.email);
  const first = account.name.split(" ")[0];
  return (
    <main className="page dashboard-page">
      <div className="shell">
        <div className="dashboard-welcome">
          <div>
            <span className="eyebrow">Guardian workspace</span>
            <h2>Good to see you, {first}.</h2>
            <p>
              Everything you need to find a responsible next home—and follow
              through.
            </p>
          </div>
          <Link href="/listings/new" className="btn btn-primary">
            <PlusCircle size={18} /> Rehome another pet
          </Link>
        </div>
        <div className="dashboard-grid">
          <aside className="sidebar">
            <b className="sidebar-title">Your workspace</b>
            {tabs.map(([label, Icon]) => (
              <button
                type="button"
                className={tab === label ? "active" : ""}
                onClick={() => setTab(label)}
                key={label}
              >
                <Icon size={17} />
                {label}
              </button>
            ))}
          </aside>
          <div>
            {tab === "Overview" && (
              <>
                <section className="metric-grid">
                  <Metric
                    value={String(listings.length)}
                    label="Pet listings"
                  />
                  <Metric
                    value={String(
                      listings.filter((x) => x.status === "Published").length,
                    )}
                    label="Published"
                  />
                  <Metric value="0" label="New applicants" />
                  <Metric value="0" label="In monitoring" />
                </section>
                {lock ? (
                  <div className="eligibility-card locked">
                    <ShieldCheck />
                    <div>
                      <span className="eyebrow">
                        Adoption eligibility paused
                      </span>
                      <h3>One pet at a time, with full support.</h3>
                      <p>{lock.message}</p>
                    </div>
                  </div>
                ) : (
                  <div className="eligibility-card">
                    <CheckCircle2 />
                    <div>
                      <span className="eyebrow">Eligible to adopt</span>
                      <h3>
                        You have no active adoption review or monitoring period.
                      </h3>
                      <p>
                        You may browse and apply. Once you submit, new
                        applications pause until the current review or
                        monitoring closes.
                      </p>
                    </div>
                    <Link href="/browse" className="btn btn-ghost btn-small">
                      Browse pets
                    </Link>
                  </div>
                )}
                <div className="panel">
                  <div className="panel-head">
                    <div>
                      <span className="eyebrow">Your pets</span>
                      <h3>Rehoming activity</h3>
                    </div>
                    <Link
                      href="/listings/new"
                      className="btn btn-primary btn-small"
                    >
                      <PlusCircle size={16} /> Add a pet
                    </Link>
                  </div>
                  {listings.length ? (
                    <ListingRows listings={listings} />
                  ) : (
                    <Empty
                      title="No pet listings yet"
                      copy="Create a thoughtful profile and manage applicant screening, handover, and follow-up."
                      action="Start a listing"
                      href="/listings/new"
                    />
                  )}
                </div>
                <div className="guardian-steps">
                  <div>
                    <b>1. You publish</b>
                    <span>Your pet appears immediately</span>
                  </div>
                  <div>
                    <b>2. You choose</b>
                    <span>Compare complete applicants</span>
                  </div>
                  <div>
                    <b>3. Meet safely</b>
                    <span>Plan a supported introduction</span>
                  </div>
                  <div>
                    <b>4. We monitor</b>
                    <span>Follow the pet’s adjustment</span>
                  </div>
                </div>
              </>
            )}
            {tab === "My pets" && (
              <div className="panel">
                <div className="panel-head">
                  <div>
                    <span className="eyebrow">Managed by you</span>
                    <h3>My pet listings</h3>
                  </div>
                  <Link
                    href="/listings/new"
                    className="btn btn-primary btn-small"
                  >
                    <PlusCircle size={16} /> New listing
                  </Link>
                </div>
                {listings.length ? (
                  <ListingRows listings={listings} />
                ) : (
                  <Empty
                    title="Your first pet profile starts here"
                    copy="Share their needs, personality, health, and ideal home."
                    action="Rehome a pet"
                    href="/listings/new"
                  />
                )}
              </div>
            )}
            {tab === "Applicants" && (
              <div className="panel">
                <span className="eyebrow">Decide with context</span>
                <h3>Applicant review</h3>
                <Empty
                  title="No applications to review"
                  copy="When your listing is published, you’ll see verified profiles, household details, care plans, and references here. Contact details stay private until you choose to connect."
                />
              </div>
            )}
            {tab === "Monitoring" && (
              <>
                <div className="panel soft-panel">
                  <span className="eyebrow">After the handover</span>
                  <h3>30-day adjustment monitoring</h3>
                  <p>
                    FurU schedules check-ins with you and the new guardian.
                    Welfare concerns can reopen the case, and the adopter cannot
                    apply for another pet while monitoring is active.
                  </p>
                </div>
                <div className="monitor-grid">
                  <div>
                    <b>Day 2</b>
                    <span>Arrival and safety check</span>
                  </div>
                  <div>
                    <b>Day 7</b>
                    <span>Routine and health update</span>
                  </div>
                  <div>
                    <b>Day 14</b>
                    <span>Behavior and adjustment</span>
                  </div>
                  <div>
                    <b>Day 30</b>
                    <span>Placement review</span>
                  </div>
                </div>
              </>
            )}
            {tab === "Messages" && (
              <div className="panel">
                <h3>Messages</h3>
                <Empty
                  title="No conversations yet"
                  copy="Conversations with approved applicants will appear here. FurU keeps early contact inside the platform for safety."
                />
              </div>
            )}
            {tab === "Notifications" && (
              <div className="panel">
                <div className="panel-head">
                  <h3>Notifications</h3>
                  <button
                    className="btn btn-ghost btn-small"
                    onClick={() => notify("Notifications marked as read.")}
                  >
                    Mark all as read
                  </button>
                </div>
                {listings.map((x) => (
                  <div className="application-row" key={x.id}>
                    <div>
                      <b>{x.name} was submitted</b>
                      <p className="row-detail">
                        The pet profile is live and ready for adopters to
                        discover.
                      </p>
                    </div>
                    <Status text={x.status} />
                  </div>
                ))}
                {!listings.length && (
                  <Empty
                    title="You’re all caught up"
                    copy="Listing, applicant, handover, and monitoring updates will appear here."
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="metric">
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}
function Status({ text }: { text: string }) {
  return (
    <span
      className={`status status-${text.toLowerCase().replaceAll(" ", "-")}`}
    >
      {text}
    </span>
  );
}
function ListingRows({ listings }: { listings: UserListing[] }) {
  return (
    <>
      {listings.map((x) => (
        <div className="listing-row" key={x.id}>
          <div className="listing-avatar">{x.name.charAt(0).toUpperCase()}</div>
          <div>
            <b>{x.name}</b>
            <p>
              {x.breed} · {x.age} · {x.location}
            </p>
          </div>
          <Status text={x.status} />
          <button className="btn btn-ghost btn-small" type="button">
            Manage
          </button>
        </div>
      ))}
    </>
  );
}
function Empty({
  title,
  copy,
  action,
  href,
}: {
  title: string;
  copy: string;
  action?: string;
  href?: string;
}) {
  return (
    <div className="dashboard-empty">
      <ClipboardList size={32} />
      <div>
        <b>{title}</b>
        <p>{copy}</p>
      </div>
      {action && href && (
        <Link href={href} className="btn btn-dark btn-small">
          {action}
        </Link>
      )}
    </div>
  );
}
