import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  ShieldCheck,
} from "lucide-react";
import GuideActions from "@/components/GuideActions";
import {
  getPetCareResource,
  getRelatedResources,
  petCareResources,
} from "@/lib/pet-care-data";

export function generateStaticParams() {
  return petCareResources.map((resource) => ({ slug: resource.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = getPetCareResource(slug);
  if (!resource) return {};
  return {
    title: { absolute: `${resource.title} | FurU Pet Care` },
    description: resource.description,
    alternates: { canonical: `/pet-care/${resource.id}` },
    openGraph: {
      title: resource.title,
      description: resource.description,
      type: "article",
      url: `/pet-care/${resource.id}`,
    },
  };
}

export default async function PetCareGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = getPetCareResource(slug);
  if (!resource) notFound();
  const related = getRelatedResources(resource);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: resource.title,
    description: resource.description,
    author: { "@type": "Organization", name: "FurU" },
    publisher: { "@type": "Organization", name: "FurU" },
    dateModified: "2026-08-06",
    mainEntityOfPage: `/pet-care/${resource.id}`,
  };

  return (
    <main className="care-guide-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema).replaceAll("<", "\\u003c"),
        }}
      />
      <div className="shell care-guide-shell">
        <nav className="care-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link><ChevronRight />
          <Link href="/pet-care">Pet Care</Link><ChevronRight />
          <span aria-current="page">{resource.title}</span>
        </nav>

        <header className="care-guide-header">
          <div>
            <span className="category-badge">{resource.category}</span>
            <h1>{resource.title}</h1>
            <p>{resource.introduction}</p>
            <div className="guide-meta">
              <span><Clock3 /> {resource.minutes} minute read</span>
              <span><ShieldCheck /> Last reviewed August 2026</span>
            </div>
          </div>
          <GuideActions title={resource.title} />
        </header>

        <div className="care-guide-layout">
          <aside className="guide-toc">
            <span className="eyebrow">In this guide</span>
            <nav aria-label="Table of contents">
              {resource.sections.map((section, index) => (
                <a href={`#section-${index + 1}`} key={section.heading}>{section.heading}</a>
              ))}
              <a href="#practical-checklist">Practical checklist</a>
              <a href="#important-safety-note">Important safety note</a>
            </nav>
          </aside>
          <article className="guide-article">
            {resource.sections.map((section, index) => (
              <section id={`section-${index + 1}`} key={section.heading}>
                <span className="guide-section-number">0{index + 1}</span>
                <h2>{section.heading}</h2>
                <p>{section.body}</p>
                <ul>
                  {section.bullets.map((bullet) => <li key={bullet}><Check /> <span>{bullet}</span></li>)}
                </ul>
              </section>
            ))}
            <section className="guide-checklist" id="practical-checklist">
              <div><BookOpen /><h2>Practical checklist</h2></div>
              <ul>{resource.checklist.map((item) => <li key={item}><span aria-hidden="true" />{item}</li>)}</ul>
            </section>
            <aside className="guide-safety-note" id="important-safety-note">
              <AlertTriangle />
              <div><h2>Important safety note</h2><p>{resource.safetyNote}</p></div>
            </aside>
            <p className="medical-disclaimer">
              Educational information only. This guide does not replace advice
              from a licensed veterinarian.
            </p>
          </article>
        </div>

        <section className="related-guides">
          <span className="eyebrow">Continue learning</span>
          <h2>Related resources</h2>
          <div>
            {related.map((item) => (
              <Link href={`/pet-care/${item.id}`} key={item.id}>
                <span className="category-badge">{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <b>Read guide <ArrowRight /></b>
              </Link>
            ))}
          </div>
        </section>

        <Link href="/pet-care" className="btn btn-dark back-to-care">
          <ArrowLeft /> Back to Pet Care
        </Link>
      </div>
    </main>
  );
}
