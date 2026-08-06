import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MonitoringClient from "@/components/MonitoringClient";
import { requirePageAuth } from "@/lib/auth";

export default async function MonitoringPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePageAuth("/monitoring");
  const { id } = await params;
  return <main className="page monitoring-page"><div className="shell"><Link className="btn btn-ghost btn-small" href="/dashboard"><ArrowLeft size={15} /> Dashboard</Link><div className="page-title"><span className="eyebrow">Supported placement</span><h1>30-day pet check-ins</h1><p>Share updates on days 2, 7, 14, and 30. Concerns are visible to both placement participants and can be escalated to welfare support.</p></div><MonitoringClient applicationId={id} /></div></main>;
}
