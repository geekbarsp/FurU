import type { Metadata } from "next";
import PetCareClient from "@/components/PetCareClient";
import { petCareFaqs } from "@/lib/pet-care-data";

const title = "Pet Care Resources | FurU";
const description =
  "Explore practical pet care guides for new pets, health, nutrition, grooming, safety, training, adoption adjustment, and senior care.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/pet-care" },
  openGraph: {
    title,
    description,
    type: "website",
    url: "/pet-care",
    images: [
      {
        url: "/images/logo-4k-transparent.png",
        width: 3840,
        height: 1648,
        alt: "FurU pet care resources",
      },
    ],
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function PetCarePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: petCareFaqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replaceAll("<", "\\u003c"),
        }}
      />
      <PetCareClient />
    </>
  );
}
