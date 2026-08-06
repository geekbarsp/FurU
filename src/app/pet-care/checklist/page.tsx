import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, PawPrint } from "lucide-react";
import PrintButton from "@/components/PrintButton";

export const metadata: Metadata = {
  title: { absolute: "FurU Pet Care Checklist" },
  description: "A printable checklist for welcoming and caring for a pet.",
  robots: { index: false, follow: true },
};

const sections = [
  ["New pet supplies", ["Food and water bowls", "Appropriate food", "Bed or resting area", "Identification", "Carrier, collar, or leash", "Toilet supplies", "Safe toys", "Grooming tools"]],
  ["Home safety check", ["Wires secured", "Medicines and cleaners locked", "Plants checked", "Windows and balconies secured", "Small objects removed", "Bins covered"]],
  ["Feeding information", ["Food brand and type recorded", "Daily amount measured", "Meal schedule written", "Treat limit agreed", "Fresh water location checked"]],
  ["Veterinary and health", ["Clinic contact recorded", "First appointment scheduled", "Vaccination records collected", "Parasite prevention discussed", "Medication instructions available"]],
  ["Emergency plan", ["Emergency clinic identified", "Transport plan ready", "Recent pet photo saved", "Records copied", "Emergency kit packed"]],
  ["Daily care", ["Feeding routine", "Exercise or enrichment", "Toilet cleaning", "Grooming schedule", "Rest and quiet time", "Behavior observations"]],
] as const;

export default function PetCareChecklistPage() {
  return (
    <main className="printable-checklist-page">
      <div className="checklist-screen-actions shell">
        <Link className="btn btn-ghost" href="/pet-care"><ArrowLeft /> Back to Pet Care</Link>
        <PrintButton />
      </div>
      <article className="printable-checklist">
        <header>
          <span><PawPrint /> FurU</span>
          <h1>FurU Pet Care Checklist</h1>
          <p>A practical page to prepare, record, and review your pet’s everyday care.</p>
        </header>
        <div className="checklist-info-grid">
          <label>Pet’s name <span /></label>
          <label>Species / age <span /></label>
          <label>Primary caregiver <span /></label>
          <label>Veterinary clinic <span /></label>
        </div>
        <div className="print-checklist-grid">
          {sections.map(([title, items]) => (
            <section key={title}>
              <h2>{title}</h2>
              {items.map((item) => <label key={item}><input type="checkbox" /> {item}</label>)}
            </section>
          ))}
        </div>
        <section className="checklist-notes">
          <h2>Medication notes</h2><span /><span /><span />
          <h2>Important behavior observations</h2><span /><span /><span />
          <h2>Other notes</h2><span /><span /><span />
        </section>
        <footer>
          <p>Educational planning tool only. Contact a licensed veterinarian for medical advice or urgent concerns.</p>
          <b>Made for second chances.</b>
        </footer>
      </article>
    </main>
  );
}
