"use client";

import { useMemo, useState } from "react";
import { BarChart3, CheckCircle2, ChevronRight, CreditCard, Download, Heart, Landmark, ReceiptText, ShieldCheck, Smartphone } from "lucide-react";
import { partnerOrganizations } from "@/lib/community-data";
import { useFeedback } from "./FeedbackProvider";

type Method = "GCash" | "Maya" | "Card";
const amounts = [250, 500, 1000, 2500];

export default function DonationsClient() {
  const [organizationId, setOrganizationId] = useState(partnerOrganizations[0].id);
  const [amount, setAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const [method, setMethod] = useState<Method>("GCash");
  const [anonymous, setAnonymous] = useState(false);
  const [receipt, setReceipt] = useState<{ reference: string; date: string; amount: number } | null>(null);
  const { notify } = useFeedback();
  const organization = useMemo(() => partnerOrganizations.find((item) => item.id === organizationId)!, [organizationId]);
  const donationAmount = customAmount ? Number(customAmount) : amount;

  function donate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!Number.isFinite(donationAmount) || donationAmount < 50) {
      notify("Please enter a donation of at least ₱50.", "info");
      return;
    }
    const reference = `FURU-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    setReceipt({ reference, date: new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" }), amount: donationAmount });
    notify("Prototype donation recorded. Your receipt is ready.");
  }

  return (
    <main className="page community-page donations-page">
      <div className="shell">
        <header className="community-hero">
          <div>
            <span className="eyebrow">Give with confidence</span>
            <h1>Make care possible.</h1>
            <p>Choose a verified welfare partner, see what they need, and keep a clear receipt of your support.</p>
          </div>
          <div className="trust-callout"><ShieldCheck /><div><b>Verified partners only</b><span>Identity and welfare work reviewed by FurU</span></div></div>
        </header>

        <section aria-labelledby="partner-heading">
          <div className="community-section-head"><div><span className="eyebrow">01 · Choose a partner</span><h2 id="partner-heading">Where your help lands</h2></div><p>Every partner publishes current needs and a simple fund report.</p></div>
          <div className="org-grid">
            {partnerOrganizations.map((org) => {
              const selected = org.id === organizationId;
              return <button type="button" className={`org-card ${selected ? "selected" : ""}`} onClick={() => setOrganizationId(org.id)} key={org.id} aria-pressed={selected}>
                <span className="org-monogram" style={{ background: org.accent }}>{org.shortName}</span>
                <span className="verified-label"><CheckCircle2 /> Verified partner</span>
                <h3>{org.name}</h3><span className="org-focus">{org.focus} · {org.location}</span><p>{org.description}</p>
                <span className="org-needs">Current needs: {org.needs.join(" · ")}</span>
                <span className="org-card-link">View and support <ChevronRight /></span>
              </button>;
            })}
          </div>
        </section>

        <section className="donation-workspace" aria-label="Donation details">
          <div className="transparency-panel">
            <span className="eyebrow">Partner profile</span><h2>{organization.name}</h2><p>{organization.description}</p>
            <div className="org-stats"><div><b>{organization.animalsHelped}</b><span>animals helped</span></div><div><b>₱{organization.raised.toLocaleString()}</b><span>received this year</span></div><div><b>{Math.round((organization.spent / organization.raised) * 100)}%</b><span>already deployed</span></div></div>
            <div className="report-card"><div className="report-title"><span><BarChart3 /> 2026 fund allocation</span><small>Updated July 31, 2026</small></div>{organization.allocation.map(item => <div className="allocation-row" key={item.label}><div><span>{item.label}</span><b>{item.value}%</b></div><div className="allocation-track"><span style={{ width: `${item.value}%` }} /></div></div>)}<button className="text-button" onClick={() => notify("The July transparency summary is ready for review.", "info")}><Landmark /> View transparency summary</button></div>
          </div>

          <form className="donation-form" onSubmit={donate}>
            {!receipt ? <>
              <div className="form-kicker"><Heart /><div><b>Donation to {organization.name}</b><span>One-time contribution</span></div></div>
              <fieldset><legend>Choose an amount</legend><div className="amount-grid">{amounts.map(value => <button type="button" className={!customAmount && amount === value ? "active" : ""} key={value} onClick={() => { setAmount(value); setCustomAmount(""); }}>₱{value.toLocaleString()}</button>)}</div><div className="money-input"><span>₱</span><input aria-label="Custom amount" inputMode="numeric" min="50" type="number" placeholder="Other amount" value={customAmount} onChange={event => setCustomAmount(event.target.value)} /></div></fieldset>
              <fieldset><legend>Payment method</legend><div className="payment-methods">{(["GCash", "Maya", "Card"] as Method[]).map(item => <button type="button" key={item} className={method === item ? "active" : ""} onClick={() => setMethod(item)}>{item === "Card" ? <CreditCard /> : <Smartphone />}<span>{item}</span><CheckCircle2 /></button>)}</div></fieldset>
              <div className="form-grid"><div className="field"><label>Full name</label><input className="input" required disabled={anonymous} placeholder="Your name" /></div><div className="field"><label>Email for receipt</label><input className="input" type="email" required placeholder="you@example.com" /></div></div>
              {method === "Card" && <div className="card-fields"><div className="field wide"><label>Card number</label><input className="input" inputMode="numeric" required placeholder="1234 5678 9012 3456" maxLength={19} /></div><div className="field"><label>Expiry</label><input className="input" required placeholder="MM / YY" /></div><div className="field"><label>CVC</label><input className="input" inputMode="numeric" required placeholder="123" maxLength={4} /></div></div>}
              <label className="check-row"><input type="checkbox" checked={anonymous} onChange={event => setAnonymous(event.target.checked)} /> Show my donation as anonymous on public reports</label>
              <div className="prototype-note"><ShieldCheck /> Prototype checkout: no money will be charged. A live deployment must connect an approved payment provider.</div>
              <button className="btn btn-primary full-btn">{method === "Card" ? "Record card donation" : `Continue with ${method}`} · ₱{(donationAmount || 0).toLocaleString()}</button>
            </> : <div className="receipt-state">
              <span className="receipt-icon"><ReceiptText /></span><span className="eyebrow">Electronic receipt</span><h2>Thank you for helping.</h2><p>Your prototype donation has been recorded for demonstration. No payment was collected.</p>
              <dl><div><dt>Organization</dt><dd>{organization.name}</dd></div><div><dt>Amount</dt><dd>₱{receipt.amount.toLocaleString()}</dd></div><div><dt>Method</dt><dd>{method}</dd></div><div><dt>Date</dt><dd>{receipt.date}</dd></div><div><dt>Reference</dt><dd>{receipt.reference}</dd></div></dl>
              <button type="button" className="btn btn-dark full-btn" onClick={() => window.print()}><Download /> Print receipt</button><button type="button" className="btn btn-ghost full-btn" onClick={() => setReceipt(null)}>Make another donation</button>
            </div>}
          </form>
        </section>
      </div>
    </main>
  );
}
