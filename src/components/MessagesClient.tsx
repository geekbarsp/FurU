"use client";

import { CalendarDays, CheckCircle2, MapPin, Send, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useFeedback } from "@/components/FeedbackProvider";

type Message = { id: string; sender_id: string; body: string; created_at: string };
type Meeting = { id: string; proposed_by: string; starts_at: string; venue_name: string; venue_address: string; notes: string; status: string };
type Conversation = {
  id: string; guardian_id: string; adopter_id: string; current_user_id: string;
  guardian_contact_consent: boolean; adopter_contact_consent: boolean;
  pet_listings: { name?: string; location?: string } | { name?: string; location?: string }[] | null;
  messages: Message[];
  meet_and_greets: Meeting[];
};
const venues = ["Barangay hall public lobby", "Pet-friendly café", "Veterinary clinic reception", "Public park activity area"];

export default function MessagesClient() {
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const { notify } = useFeedback();
  const load = useCallback(async (preferredId?: string) => {
    const response = await fetch("/api/conversations", { headers: { Accept: "application/json" } });
    const data = response.ok ? await response.json() : [];
    setConversations(data);
    setActiveId((current) => {
      if (preferredId && data.some((item: Conversation) => item.id === preferredId)) return preferredId;
      if (current && data.some((item: Conversation) => item.id === current)) return current;
      return data[0]?.id || "";
    });
    setLoading(false);
  }, []);
  useEffect(() => {
    const pet = searchParams.get("pet");
    const requestedConversation = searchParams.get("conversation") || undefined;
    const canStart = pet && /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(pet);
    if (!canStart) {
      void Promise.resolve(requestedConversation).then(load);
      return;
    }
    void fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId: pet }),
    })
      .then(async (response) => {
        const result = await response.json().catch(() => null);
        if (!response.ok) notify(result?.error || "The conversation could not be started.", "info");
        await load(result?.id || requestedConversation);
      });
  }, [load, notify, searchParams]);
  const active = conversations.find((conversation) => conversation.id === activeId);
  const listing = useMemo(() => {
    if (!active?.pet_listings) return {};
    return Array.isArray(active.pet_listings) ? active.pet_listings[0] || {} : active.pet_listings;
  }, [active]);
  const ownConsent = active ? (active.current_user_id === active.guardian_id ? active.guardian_contact_consent : active.adopter_contact_consent) : false;
  const bothConsent = Boolean(active?.guardian_contact_consent && active?.adopter_contact_consent);
  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (!active || !text.trim()) return;
    const response = await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ conversationId: active.id, body: text }) });
    const result = await response.json().catch(() => null);
    if (!response.ok) return notify(result?.error || "Message could not be sent.");
    setText("");
    await load();
  }
  async function toggleConsent() {
    if (!active) return;
    const response = await fetch("/api/conversations", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ conversationId: active.id, consent: !ownConsent }) });
    if (!response.ok) return notify("Contact preference could not be updated.");
    notify(!ownConsent ? "You agreed to share contact details when the other person agrees." : "Contact sharing turned off.");
    await load();
  }
  async function updateMeeting(appointmentId: string, status: "Confirmed" | "Declined" | "Cancelled") {
    const response = await fetch("/api/appointments", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ appointmentId, status }) });
    if (!response.ok) return notify("Meeting could not be updated.");
    notify(`Meet-and-greet ${status.toLowerCase()}.`); await load();
  }
  if (loading) return <div className="panel"><p>Loading private conversations…</p></div>;
  if (!conversations.length) return <div className="panel dashboard-empty"><ShieldCheck size={35} /><div><b>No conversations yet</b><p>Open a database-backed pet listing and select “Message guardian” to begin.</p></div></div>;
  return <>
    <div className="message-layout real-messages">
      <aside className="conversation-list">{conversations.map((conversation) => {
        const relation = Array.isArray(conversation.pet_listings) ? conversation.pet_listings[0] : conversation.pet_listings;
        return <button key={conversation.id} className={`conversation ${conversation.id === activeId ? "active" : ""}`} onClick={() => setActiveId(conversation.id)}><b>{relation?.name || "Pet conversation"}</b><small>{conversation.messages?.length || 0} messages · Private</small></button>;
      })}</aside>
      {active && <section className="chat-panel"><div className="chat-head"><div><b>About {listing.name || "this pet"}</b><small>{listing.location || "Approximate location"} · Verified participants</small></div><ShieldCheck size={20} /></div>
        <div className={`safety-strip ${bothConsent ? "consented" : ""}`}>{bothConsent ? <><CheckCircle2 /> Both participants agreed to contact sharing.</> : "Email and phone details are blocked until both people consent."}<button onClick={toggleConsent}>{ownConsent ? "Withdraw my consent" : "I agree to share later"}</button></div>
        <div className="bubbles">{[...(active.messages || [])].sort((a, b) => a.created_at.localeCompare(b.created_at)).map((message) => <div key={message.id} className={`bubble ${message.sender_id === active.current_user_id ? "mine" : ""}`}>{message.body}<small>{new Date(message.created_at).toLocaleString("en-PH", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</small></div>)}</div>
        <div className="meeting-proposals">{(active.meet_and_greets || []).map((meeting) => <article key={meeting.id}><div><CalendarDays /><span><b>{meeting.venue_name}</b><small>{new Date(meeting.starts_at).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })} · {meeting.venue_address}</small></span></div><strong>{meeting.status}</strong>{meeting.status === "Proposed" && <span className="meeting-actions">{meeting.proposed_by !== active.current_user_id ? <><button onClick={() => updateMeeting(meeting.id, "Confirmed")}>Confirm</button><button onClick={() => updateMeeting(meeting.id, "Declined")}>Decline</button></> : <button onClick={() => updateMeeting(meeting.id, "Cancelled")}>Cancel proposal</button>}</span>}</article>)}</div>
        <div className="chat-tools"><button className="btn btn-ghost btn-small" onClick={() => setScheduleOpen(true)}><CalendarDays size={16} /> Schedule meet-and-greet</button></div>
        <form className="composer" onSubmit={send}><input className="input" value={text} onChange={(event) => setText(event.target.value)} aria-label="Message" placeholder="Write a kind message…" /><button className="icon-btn" aria-label="Send"><Send size={18} /></button></form>
      </section>}
    </div>
    {active && scheduleOpen && <ScheduleMeeting conversationId={active.id} location={listing.location || "your city"} onClose={() => setScheduleOpen(false)} onSaved={() => { setScheduleOpen(false); notify("Meet-and-greet proposal sent."); }} />}
  </>;
}

function ScheduleMeeting({ conversationId, location, onClose, onSaved }: { conversationId: string; location: string; onClose: () => void; onSaved: () => void }) {
  const [venue, setVenue] = useState(venues[0]);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const startsAt = new Date(String(form.get("startsAt"))).toISOString();
    const response = await fetch("/api/appointments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ conversationId, startsAt, venueName: venue, venueAddress: String(form.get("venueAddress")), notes: String(form.get("notes") || "") }) });
    const result = await response.json().catch(() => null);
    if (!response.ok) return setError(result?.error || "Meeting could not be scheduled.");
    onSaved();
  }
  return <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}><section className="dialog meeting-dialog" role="dialog" aria-modal="true" aria-labelledby="meeting-title" onMouseDown={(event) => event.stopPropagation()}><span className="eyebrow">Safe introduction</span><h2 id="meeting-title">Propose a meet-and-greet</h2><p>Choose a staffed or public venue near {location}. Never use a private home for the first meeting.</p><form onSubmit={submit}><div className="field"><label>Date and time</label><input className="input" name="startsAt" type="datetime-local" required /></div><div className="field"><label>Suggested venue</label><select className="input" value={venue} onChange={(event) => setVenue(event.target.value)}>{venues.map((item) => <option key={item}>{item}</option>)}</select></div><div className="field"><label>Full public venue address</label><input className="input" name="venueAddress" placeholder={`${location} landmark or business`} required /></div><div className="field"><label>Notes</label><textarea className="input" name="notes" rows={3} /></div>{error && <p className="error">{error}</p>}<div className="button-group"><button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary"><MapPin size={16} /> Send proposal</button></div></form></section></div>;
}
