import { requirePageAuth } from "@/lib/auth";
import HandoverReviewForm from "@/components/HandoverReviewForm";
export default async function NewReviewPage({ searchParams }: { searchParams: Promise<{ application?: string }> }) {
  await requirePageAuth("/reviews/new");
  const { application = "" } = await searchParams;
  return <main className="page"><div className="shell"><div className="page-title"><span className="eyebrow">Community trust</span><h1>Review a completed handover</h1><p>Only verified placement participants can submit a review. Personal attacks and private contact details are moderated.</p></div><HandoverReviewForm applicationId={application} /></div></main>;
}
