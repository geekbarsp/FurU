import { Suspense } from "react";
import MessagesClient from "@/components/MessagesClient";
import { requirePageAuth } from "@/lib/auth";

export default async function MessagesPage() {
  await requirePageAuth("/messages");
  return <main className="page supporting-page"><div className="shell"><div className="page-title"><span className="eyebrow">Private and protected</span><h1>Messages</h1><p>Plan the next step without exposing personal contact details too early.</p></div><Suspense fallback={<div className="panel">Loading…</div>}><MessagesClient /></Suspense></div></main>;
}
