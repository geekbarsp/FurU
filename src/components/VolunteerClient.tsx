"use client";

import { useState } from "react";
import { CalendarDays, Car, CheckCircle2, ChevronRight, HeartHandshake, Home, MapPin, MessagesSquare, PartyPopper, ShieldCheck } from "lucide-react";
import { partnerOrganizations, volunteerRoles } from "@/lib/community-data";
import { useFeedback } from "./FeedbackProvider";

const roleIcons = [Car, Home, PartyPopper];

export default function VolunteerClient() {
  const [role, setRole] = useState("transport");
  const [submitted, setSubmitted] = useState(false);
  const [organization, setOrganization] = useState(partnerOrganizations[0].id);
  const { notify } = useFeedback();
  const selectedRole = volunteerRoles.find(item => item.id === role)!;
  const selectedOrg = partnerOrganizations.find(item => item.id === organization)!;

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    notify("Your volunteer interest has been sent.");
  }

  return <main className="page community-page volunteer-page"><div className="shell">
    <header className="community-hero volunteer-hero"><div><span className="eyebrow">Time changes lives</span><h1>Show up where it matters.</h1><p>Match your time and strengths with a verified organization. They coordinate the details; FurU keeps the next steps clear.</p></div><div className="volunteer-hero-mark"><HeartHandshake /><span>Flexible, local, welfare-first</span></div></header>
    <section aria-labelledby="roles-heading"><div className="community-section-head"><div><span className="eyebrow">01 · Find your role</span><h2 id="roles-heading">There is more than one way to help.</h2></div><p>Choose a role to see its commitment and screening requirements.</p></div>
      <div className="role-grid">{volunteerRoles.map((item, index) => { const Icon = roleIcons[index]; const active = role === item.id; return <button type="button" className={`role-card ${active ? "selected" : ""}`} key={item.id} onClick={() => setRole(item.id)} aria-pressed={active}><span className="role-icon"><Icon /></span><span className="role-check"><CheckCircle2 /></span><h3>{item.title}</h3><p>{item.description}</p><dl><div><dt>Typical commitment</dt><dd>{item.commitment}</dd></div><div><dt>Before you start</dt><dd>{item.requirements}</dd></div></dl></button>; })}</div>
    </section>
    <section className="volunteer-workspace" id="volunteer-form">
      <div className="coordination-panel"><span className="eyebrow">How coordination works</span><h2>Supported from hello to handoff.</h2><div className="coordination-steps"><article><span>1</span><div><b>Tell us where you fit</b><p>Share your role, location, schedule, and practical limits.</p></div></article><article><span>2</span><div><b>The organization checks in</b><p>A verified coordinator reviews the match and messages you about orientation.</p></div></article><article><span>3</span><div><b>Confirm one clear task</b><p>Dates, contact person, safety notes, and pet needs are agreed before you begin.</p></div></article></div><div className="coordination-note"><ShieldCheck /><div><b>Never self-deploy to a rescue</b><span>Wait for the organization to confirm the task, location, and safety plan.</span></div></div></div>
      <form className="volunteer-form" onSubmit={submit}>
        {!submitted ? <><span className="eyebrow">02 · Register interest</span><h2>Join the volunteer pool.</h2><p>You are registering for <b>{selectedRole.title.toLowerCase()}</b>. This is not yet a confirmed assignment.</p>
          <div className="form-grid"><div className="field"><label>Full name</label><input className="input" required placeholder="Your name" /></div><div className="field"><label>Email</label><input className="input" type="email" required placeholder="you@example.com" /></div><div className="field"><label>Mobile number</label><input className="input" type="tel" required placeholder="09XX XXX XXXX" /></div><div className="field"><label>City or municipality</label><input className="input" required placeholder="e.g. Quezon City" /></div><div className="field wide"><label>Preferred organization</label><select className="input" value={organization} onChange={event => setOrganization(event.target.value)}>{partnerOrganizations.map(org => <option value={org.id} key={org.id}>{org.name} · {org.location}</option>)}</select></div><div className="field"><label>Best days</label><select className="input" required><option>Weekends</option><option>Weekdays</option><option>Either</option></select></div><div className="field"><label>Best time</label><select className="input" required><option>Morning</option><option>Afternoon</option><option>Evening</option><option>Flexible</option></select></div><div className="field wide"><label>Relevant experience or practical limits</label><textarea className="input" placeholder="Tell the coordinator what would help make this a safe, sustainable match." /></div></div>
          <label className="check-row"><input type="checkbox" required /> I am at least 18 and agree to complete the organization&apos;s screening and safety orientation.</label><button className="btn btn-primary full-btn">Send interest to {selectedOrg.name}</button>
        </> : <div className="volunteer-success"><span className="success-mark"><CheckCircle2 /></span><span className="eyebrow">Interest received</span><h2>You&apos;re in the volunteer pool.</h2><p>{selectedOrg.name} can now review your <b>{selectedRole.title.toLowerCase()}</b> interest. This prototype keeps the coordination handoff visible without claiming an assignment is confirmed.</p><div className="next-step-card"><MessagesSquare /><div><b>What happens next</b><span>A coordinator reviews your details and sends orientation options through FurU.</span></div></div><div className="next-step-card"><CalendarDays /><div><b>No task is scheduled yet</b><span>Only travel or prepare after the organization confirms the assignment.</span></div></div><button type="button" className="btn btn-dark full-btn" onClick={() => setSubmitted(false)}>Update my availability</button></div>}
      </form>
    </section>
    <section className="org-match-strip"><div><MapPin /><span><b>Prefer to start nearby?</b> Choose a verified organization serving your city.</span></div><a className="btn btn-ghost" href="#volunteer-form">Choose organization <ChevronRight /></a></section>
  </div></main>;
}
