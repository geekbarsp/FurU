"use client";
import { useEffect, useState } from "react";
import { AlertTriangle, Camera, CheckCircle2, Clock3 } from "lucide-react";
import { useFeedback } from "@/components/FeedbackProvider";

type Checkin = { id: string; day_number: number; welfare_status: string; notes: string; photo_url?: string; created_at: string };
const days = [2, 7, 14, 30] as const;
export default function MonitoringClient({ applicationId }: { applicationId: string }) {
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [day, setDay] = useState<(typeof days)[number]>(2);
  const [status, setStatus] = useState("Doing well");
  const [notes, setNotes] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState("");
  const { notify } = useFeedback();
  async function load() {
    const response = await fetch(`/api/monitoring?applicationId=${encodeURIComponent(applicationId)}`);
    if (response.ok) setCheckins(await response.json());
  }
  useEffect(() => {
    let active = true;
    void fetch(`/api/monitoring?applicationId=${encodeURIComponent(applicationId)}`)
      .then((response) => response.ok ? response.json() : [])
      .then((data) => { if (active) setCheckins(data); });
    return () => { active = false; };
  }, [applicationId]);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError("");
    const response = await fetch("/api/monitoring", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ applicationId, dayNumber: day, welfareStatus: status, notes, photoUrl }) });
    const result = await response.json().catch(() => null);
    if (!response.ok) return setError(result?.error || "Check-in could not be submitted.");
    setNotes(""); setPhotoUrl(""); await load();
    notify(status === "Urgent concern" ? "Urgent concern escalated to FurU welfare support." : "Check-in submitted.");
  }
  return <div className="monitoring-layout"><section><div className="monitor-grid">{days.map((item) => { const complete = checkins.some((checkin) => checkin.day_number === item); return <button key={item} className={`${day === item ? "active" : ""} ${complete ? "complete" : ""}`} onClick={() => setDay(item)}><b>{complete ? <CheckCircle2 /> : <Clock3 />} Day {item}</b><span>{complete ? "Update received" : "Awaiting check-in"}</span></button>; })}</div><div className="panel monitoring-history"><h3>Update history</h3>{checkins.length ? checkins.map((checkin) => <article key={checkin.id}><div><b>Day {checkin.day_number} · {checkin.welfare_status}</b><small>{new Date(checkin.created_at).toLocaleDateString("en-PH")}</small></div><p>{checkin.notes}</p>{checkin.photo_url && <a href={checkin.photo_url} target="_blank" rel="noreferrer"><Camera size={15} /> View photo update</a>}</article>) : <p>No check-ins have been submitted yet.</p>}</div></section><form className="form-card" onSubmit={submit}><span className="eyebrow">Day {day} update</span><h2>How is the adjustment going?</h2><div className="field"><label>Welfare status</label><select className="input" value={status} onChange={(event) => setStatus(event.target.value)}><option>Doing well</option><option>Needs support</option><option>Urgent concern</option></select></div>{status === "Urgent concern" && <div className="notice urgent"><AlertTriangle />Submitting will immediately open a welfare escalation. For immediate danger, contact a local veterinarian or emergency service now.</div>}<div className="field"><label>Behavior, appetite, health, and routine notes</label><textarea className="input" rows={7} value={notes} onChange={(event) => setNotes(event.target.value)} minLength={10} required /></div><div className="field"><label>Photo update URL (optional)</label><input className="input" type="url" value={photoUrl} onChange={(event) => setPhotoUrl(event.target.value)} placeholder="https://…" /></div>{error && <p className="error">{error}</p>}<button className="btn btn-primary full-btn">Submit day {day} check-in</button></form></div>;
}
