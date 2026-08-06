"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, Clock3, Mail, MessageCircle, Search, Send, ShieldAlert } from "lucide-react";
import { helpFaqs } from "@/lib/community-data";
import { useFeedback } from "./FeedbackProvider";

const categories = ["All", "Adoption", "Rehoming", "Donations", "Volunteering", "Safety", "Account"];

export default function HelpCenterClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sent, setSent] = useState(false);
  const { notify } = useFeedback();
  const results = useMemo(() => { const normalized = query.trim().toLowerCase(); return helpFaqs.filter(item => (category === "All" || item.category === category) && (!normalized || `${item.question} ${item.answer} ${item.category}`.toLowerCase().includes(normalized))); }, [category, query]);

  function contact(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); setSent(true); notify("Your support request has been recorded."); }

  return <main className="page community-page help-page"><div className="shell">
    <header className="help-hero"><span className="eyebrow">Help center</span><h1>How can we help?</h1><p>Search for a quick answer, or send the support team enough context to help on the first reply.</p><div className="help-search"><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search adoption, donations, safety…" aria-label="Search help articles" /><kbd>{results.length} answers</kbd></div></header>
    <div className="help-layout">
      <section className="faq-section" aria-labelledby="faq-heading"><div className="faq-heading"><div><span className="eyebrow">Frequently asked</span><h2 id="faq-heading">Clear answers, no runaround.</h2></div>{query && <button className="text-button" onClick={() => setQuery("")}>Clear search</button>}</div><div className="category-pills" aria-label="FAQ categories">{categories.map(item => <button type="button" className={category === item ? "active" : ""} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
        <div className="help-faq-list">{results.map((item, index) => <details key={item.question} open={Boolean(query) && index === 0}><summary><span><small>{item.category}</small>{item.question}</span><ChevronDown /></summary><p>{item.answer}</p></details>)}{!results.length && <div className="faq-empty"><Search /><h3>No exact answer found</h3><p>Try fewer words or send the support team a message below.</p><a className="btn btn-primary" href="#contact">Contact support</a></div>}</div>
      </section>
      <aside className="support-aside"><div className="support-card"><MessageCircle /><span className="eyebrow">Human support</span><h3>We&apos;ll help you find the next step.</h3><p>For account, adoption, rehoming, donation, or volunteer questions.</p><div><Clock3 /><span><b>Typical reply</b><small>Within 1–2 business days</small></span></div><div><Mail /><span><b>Email</b><small>support@furu.ph</small></span></div><a className="btn btn-dark full-btn" href="#contact">Send a message</a></div><div className="urgent-support"><ShieldAlert /><div><b>Animal in immediate danger?</b><p>Contact a nearby veterinarian, local animal welfare office, or emergency service. FurU support is not an emergency line.</p></div></div></aside>
    </div>
    <section className="contact-section" id="contact"><div><span className="eyebrow">Still need help?</span><h2>Tell us what happened.</h2><p>Include relevant pet, listing, application, donation, or volunteer details—never send passwords or full card information.</p><ul><li><CheckCircle2 /> One support reference for follow-up</li><li><CheckCircle2 /> Routed to the right FurU team</li><li><CheckCircle2 /> Sensitive details handled privately</li></ul></div>
      <form className="contact-form" onSubmit={contact}>{!sent ? <><div className="form-grid"><div className="field"><label>Name</label><input className="input" required placeholder="Your name" /></div><div className="field"><label>Email</label><input className="input" type="email" required placeholder="you@example.com" /></div><div className="field wide"><label>What do you need help with?</label><select className="input" required defaultValue=""><option value="" disabled>Choose a topic</option><option>Adoption or application</option><option>Rehoming or listing</option><option>Donation or receipt</option><option>Volunteering</option><option>Account access</option><option>Safety concern</option><option>Something else</option></select></div><div className="field wide"><label>Subject</label><input className="input" required minLength={5} placeholder="A short summary" /></div><div className="field wide"><label>What happened?</label><textarea className="input" required minLength={20} placeholder="Share the relevant details and what outcome would help." /></div></div><button className="btn btn-primary full-btn"><Send /> Send to FurU support</button></> : <div className="contact-success"><CheckCircle2 /><span className="eyebrow">Message recorded</span><h3>We have your request.</h3><p>Prototype reference <b>HELP-{new Date().getFullYear()}-1048</b>. In a live deployment, a confirmation would also be emailed to you.</p><button type="button" className="btn btn-ghost" onClick={() => setSent(false)}>Send another message</button></div>}</form>
    </section>
  </div></main>;
}
