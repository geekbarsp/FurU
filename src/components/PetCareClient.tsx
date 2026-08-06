"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Baby,
  Backpack,
  CalendarDays,
  Check,
  ClipboardCheck,
  Clock3,
  CloudSun,
  FileText,
  HandHeart,
  HeartHandshake,
  Home,
  MessageCircleHeart,
  PawPrint,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Utensils,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Dialog } from "@/components/FeedbackProvider";
import {
  petCareCategories,
  petCareFaqs,
  petCareResources,
  type PetCareIcon,
} from "@/lib/pet-care-data";

const iconMap: Record<PetCareIcon, LucideIcon> = {
  home: Home,
  calendar: CalendarDays,
  clipboard: ClipboardCheck,
  utensils: Utensils,
  shield: ShieldCheck,
  heart: HeartHandshake,
  stethoscope: Stethoscope,
  sparkles: Sparkles,
  award: Award,
  message: MessageCircleHeart,
  cloud: CloudSun,
  users: Users,
  alert: AlertTriangle,
  backpack: Backpack,
  clock: Clock3,
  baby: Baby,
  paw: PawPrint,
  handover: HandHeart,
};

const featured = [
  {
    title: "Start your journey",
    description:
      "Learn what to prepare before bringing a pet home, including essential supplies, safe spaces, feeding routines, and the first days of adjustment.",
    action: "View beginner guides",
    href: "#new-pet-essentials",
    Icon: HeartHandshake,
    tone: "peach",
  },
  {
    title: "Keep them healthy and safe",
    description:
      "Understand vaccinations, nutrition, grooming, common warning signs, preventive care, and when your pet may need veterinary attention.",
    action: "Explore health guides",
    href: "#health-and-safety",
    Icon: ShieldCheck,
    tone: "sage",
  },
  {
    title: "Build a stronger bond",
    description:
      "Get practical advice on training, socialization, behavior, enrichment, anxiety, and helping pets feel secure in their new home.",
    action: "Get care tips",
    href: "#behavior-and-training",
    Icon: Award,
    tone: "blue",
  },
];

const newPetItems = [
  "Food and water bowls",
  "Age-appropriate food",
  "Comfortable bed or resting area",
  "Collar, tag, leash, or secure carrier",
  "Litter box and litter for cats",
  "Grooming essentials",
  "Safe toys and enrichment",
  "Cleaning supplies",
  "Veterinary records",
  "Emergency contact details",
];

const firstWeek = [
  ["Day 1", "Keep the environment quiet and allow the pet to explore gradually."],
  ["Days 2–3", "Introduce routines for meals, rest, toilet breaks, and gentle interaction."],
  ["Days 4–5", "Begin short positive training sessions and supervised exploration."],
  ["Days 6–7", "Review appetite, behavior, comfort, and any health concerns."],
];

const routineCare = [
  "Veterinary wellness checks",
  "Vaccinations",
  "Parasite prevention",
  "Dental care",
  "Weight monitoring",
  "Grooming",
  "Proper nutrition",
  "Safe exercise",
];

const warningSigns = [
  "Difficulty breathing",
  "Collapse or severe weakness",
  "Repeated vomiting or diarrhea",
  "Seizures",
  "Heavy bleeding",
  "Suspected poisoning",
  "Inability to urinate",
  "Severe injury",
  "Sudden abdominal swelling",
  "Extreme pain or distress",
];

const trainingTips = [
  ["Reward good behavior", "Use treats, praise, play, or affection immediately after the desired behavior."],
  ["Keep sessions short", "Practice for a few focused minutes to prevent frustration and maintain engagement."],
  ["Respect body language", "Pause when a pet shows fear, avoidance, tension, or overstimulation."],
  ["Stay consistent", "Use the same cues, household rules, and routines across all family members."],
];

const nutritionBasics = [
  "Choose food appropriate for species, age, size, and health needs",
  "Measure portions consistently",
  "Keep fresh water available",
  "Introduce diet changes gradually",
  "Limit treats",
  "Monitor weight and appetite",
  "Ask a veterinarian before using supplements or special diets",
];

const unsafeFoods = [
  "Chocolate",
  "Grapes and raisins",
  "Onions and garlic",
  "Xylitol",
  "Alcohol",
  "Caffeine",
  "Cooked bones",
  "Excessively salty foods",
];

const adjustmentSteps = [
  "Give them a quiet safe space",
  "Keep routines predictable",
  "Limit visitors at first",
  "Allow the pet to approach voluntarily",
  "Introduce family members gradually",
  "Supervise interactions with children and pets",
  "Watch eating, drinking, sleep, and toilet habits",
  "Schedule a veterinary check when appropriate",
];

export default function PetCareClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof petCareCategories)[number]>(
    "All",
  );
  const [visible, setVisible] = useState(9);
  const [vetHelpOpen, setVetHelpOpen] = useState(false);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return petCareResources.filter((item) => {
      const categoryMatch = category === "All" || item.category === category;
      const searchable = [
        item.title,
        item.description,
        item.category,
        ...item.tags,
      ]
        .join(" ")
        .toLowerCase();
      return categoryMatch && (!normalized || searchable.includes(normalized));
    });
  }, [category, query]);

  function resetFilters() {
    setQuery("");
    setCategory("All");
    setVisible(9);
  }

  return (
    <main className="pet-care-page">
      <section className="pet-care-hero">
        <span className="pet-care-orb pet-care-orb-one" aria-hidden="true" />
        <span className="pet-care-orb pet-care-orb-two" aria-hidden="true" />
        <div className="shell pet-care-hero-inner">
          <div className="pet-care-hero-copy">
            <span className="eyebrow">FurU community</span>
            <h1>Pet care<br />resources</h1>
            <p>Practical, vet-informed guides for every stage of life together.</p>
          </div>
          <div className="pet-care-hero-mark" aria-hidden="true">
            <PawPrint />
            <span>Care grows<br />one day at a time.</span>
          </div>
        </div>
      </section>

      <section className="shell featured-care-grid" aria-label="Featured care areas">
        {featured.map(({ title, description, action, href, Icon, tone }) => (
          <a className={`featured-care-card ${tone}`} href={href} key={title}>
            <span className="featured-care-icon"><Icon /></span>
            <h2>{title}</h2>
            <p>{description}</p>
            <span className="featured-care-action">
              {action} <ArrowRight />
            </span>
          </a>
        ))}
      </section>

      <section className="shell pet-care-cta">
        <div>
          <span className="eyebrow">A small step makes a difference</span>
          <h2>Ready to give them the care they deserve?</h2>
          <p>
            Explore clear, compassionate resources designed to help every pet
            feel safe, healthy, understood, and loved throughout their journey.
          </p>
          <div className="pet-care-actions">
            <a className="btn btn-primary" href="#resource-library">
              Browse all resources <ArrowRight size={17} />
            </a>
            <Link className="btn btn-ghost" href="/pet-care/checklist" target="_blank">
              <FileText size={17} /> Download pet care checklist
            </Link>
          </div>
        </div>
        <div className="pet-care-cta-art" aria-hidden="true">
          <PawPrint /><PawPrint /><HeartHandshake />
        </div>
      </section>

      <section className="pet-care-library" id="resource-library">
        <div className="shell">
          <div className="pet-care-section-head">
            <div>
              <span className="eyebrow">Pet care library</span>
              <h2>Helpful guidance for every stage</h2>
              <p>Choose a topic to find practical steps, checklists, and safety information for caring for your pet.</p>
            </div>
          </div>
          <div className="resource-tools">
            <label className="resource-search">
              <span className="sr-only">Search pet care topics</span>
              <Search aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setVisible(9);
                }}
                placeholder="Search pet care topics"
                type="search"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                  <X />
                </button>
              )}
            </label>
            <div className="resource-filters" aria-label="Filter resources by category">
              {petCareCategories.map((filter) => (
                <button
                  type="button"
                  className={category === filter ? "active" : ""}
                  aria-pressed={category === filter}
                  onClick={() => {
                    setCategory(filter);
                    setVisible(9);
                  }}
                  key={filter}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <div className="resource-result-line" aria-live="polite">
            <b>{filtered.length}</b> {filtered.length === 1 ? "guide" : "guides"} found
          </div>
          {filtered.length ? (
            <>
              <div className="resource-card-grid">
                {filtered.slice(0, visible).map((item) => {
                  const Icon = iconMap[item.icon];
                  return (
                    <article className="resource-card" key={item.id}>
                      <div className="resource-card-top">
                        <span className="resource-card-icon"><Icon /></span>
                        {item.featured && <span className="featured-badge">Featured</span>}
                      </div>
                      <span className="category-badge">{item.category}</span>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <div className="resource-card-bottom">
                        <span><Clock3 /> {item.minutes} min read</span>
                        <Link href={`/pet-care/${item.id}`}>
                          Read guide <ArrowRight />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
              {visible < filtered.length && (
                <div className="show-more-row">
                  <button className="btn btn-ghost" onClick={() => setVisible((count) => count + 9)}>
                    Show more guides
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="resource-empty">
              <Search />
              <h3>No matching guides yet</h3>
              <p>We could not find a guide matching your search. Try another keyword or reset the filters.</p>
              <button className="btn btn-primary" onClick={resetFilters}>Reset filters</button>
            </div>
          )}
        </div>
      </section>

      <section className="shell care-deep-section" id="new-pet-essentials">
        <div className="pet-care-section-head narrow">
          <span className="eyebrow">New pet essentials</span>
          <h2>Welcoming a new pet</h2>
          <p>A calm, prepared home can make the transition safer and less stressful for everyone.</p>
        </div>
        <div className="new-pet-layout">
          <div className="care-list-card">
            <h3>Your welcome-home checklist</h3>
            <ul className="care-check-list">
              {newPetItems.map((item) => <li key={item}><Check /> {item}</li>)}
            </ul>
            <Link className="btn btn-primary" href="/pet-care/checklist" target="_blank">
              <FileText size={17} /> Download checklist
            </Link>
          </div>
          <div className="first-week-card">
            <span className="eyebrow">First week plan</span>
            {firstWeek.map(([day, copy], index) => (
              <div className="timeline-step" key={day}>
                <span>{index + 1}</span>
                <div><b>{day}</b><p>{copy}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="health-safety-wrap" id="health-and-safety">
        <div className="shell care-deep-section">
          <div className="pet-care-section-head narrow">
            <span className="eyebrow">Preventive care</span>
            <h2>Health and safety essentials</h2>
          </div>
          <div className="health-columns">
            <ListPanel title="Routine care" icon={HeartHandshake} items={routineCare} />
            <ListPanel title="Warning signs" icon={AlertTriangle} items={warningSigns} urgent />
          </div>
          <div className="emergency-notice">
            <span><AlertTriangle /></span>
            <div>
              <h3>Know when it is urgent</h3>
              <p>Contact a licensed veterinarian or emergency animal clinic immediately when your pet shows severe, sudden, or life-threatening symptoms.</p>
            </div>
            <button className="btn btn-dark" onClick={() => setVetHelpOpen(true)}>Find veterinary help</button>
          </div>
        </div>
      </section>

      <section className="shell care-deep-section" id="behavior-and-training">
        <div className="pet-care-section-head narrow">
          <span className="eyebrow">Gentle guidance</span>
          <h2>Kind training builds trust</h2>
          <p>Use patience, consistency, enrichment, and positive reinforcement to help pets learn safely.</p>
        </div>
        <div className="training-grid">
          {trainingTips.map(([title, copy], index) => (
            <article key={title}><span>{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
        <div className="do-avoid-grid">
          <Comparison title="Do" items={["Reward desired behavior", "Use calm, clear cues", "Provide safe enrichment", "Allow gradual adjustment", "Seek qualified help for serious concerns"]} />
          <Comparison title="Avoid" items={["Physical punishment", "Shouting or intimidation", "Forcing interaction", "Overwhelming introductions", "Ignoring repeated signs of fear or pain"]} avoid />
        </div>
      </section>

      <section className="nutrition-wrap">
        <div className="shell care-deep-section">
          <div className="pet-care-section-head narrow">
            <span className="eyebrow">Nutrition</span>
            <h2>Everyday nutrition basics</h2>
          </div>
          <div className="nutrition-layout">
            <ul className="nutrition-basics">
              {nutritionBasics.map((item) => <li key={item}><Check /> {item}</li>)}
            </ul>
            <div className="unsafe-food-panel">
              <h3>Common foods that may be unsafe</h3>
              <div>{unsafeFoods.map((food) => <span key={food}>{food}</span>)}</div>
              <p><AlertTriangle /> Food risks can differ between species, size, health condition, and amount consumed. Contact a veterinarian promptly if poisoning is suspected.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="shell care-deep-section adoption-adjustment">
        <div className="pet-care-section-head narrow">
          <span className="eyebrow">A gentle arrival</span>
          <h2>Helping adopted pets feel at home</h2>
        </div>
        <ol className="adjustment-steps">
          {adjustmentSteps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>)}
        </ol>
        <div className="adjustment-note"><Clock3 /><p><b>Adjustment may take days, weeks, or longer.</b> Progress should be measured by the pet’s comfort, not by a fixed deadline.</p></div>
      </section>

      <section className="pet-care-faq-wrap">
        <div className="shell care-deep-section pet-care-faq">
          <div className="pet-care-section-head narrow">
            <span className="eyebrow">Common questions</span>
            <h2>Pet care FAQ</h2>
          </div>
          <div className="faq-list">
            {petCareFaqs.map(([question, answer], index) => (
              <details id={`faq-${index + 1}`} key={question}>
                <summary><span>{question}</span><span aria-hidden="true">+</span></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="shell pet-care-support">
        <div>
          <span className="eyebrow">Need more help?</span>
          <h2>You do not have to figure everything out alone.</h2>
          <p>Use FurU’s support resources to learn about adoption, responsible rehoming, pet welfare, and the next steps for your situation.</p>
        </div>
        <div className="pet-care-actions">
          <Link className="btn btn-primary" href="/help">Visit Help Center</Link>
          <Link className="btn btn-ghost" href="/contact">Contact Support</Link>
        </div>
      </section>

      <Dialog open={vetHelpOpen} title="Find licensed veterinary help" onClose={() => setVetHelpOpen(false)}>
        <div className="vet-help-copy">
          <p>Search for a licensed veterinary clinic using your city or municipality. Check current opening hours and call ahead so the clinic can advise you about urgency and arrival.</p>
          <ul>
            <li>Search maps for “licensed veterinary clinic near me.”</li>
            <li>Ask a trusted local welfare organization for established clinics.</li>
            <li>For urgent symptoms, call the nearest open clinic before travelling.</li>
          </ul>
          <p className="notice"><ShieldCheck /> FurU does not request or store your precise location for this search.</p>
          <button className="btn btn-primary full-btn" onClick={() => setVetHelpOpen(false)}>Got it</button>
        </div>
      </Dialog>
    </main>
  );
}

function ListPanel({ title, icon: Icon, items, urgent = false }: { title: string; icon: LucideIcon; items: string[]; urgent?: boolean }) {
  return <article className={`health-list-panel ${urgent ? "urgent" : ""}`}><div><Icon /><h3>{title}</h3></div><ul>{items.map((item) => <li key={item}><Check /> {item}</li>)}</ul></article>;
}

function Comparison({ title, items, avoid = false }: { title: string; items: string[]; avoid?: boolean }) {
  return <article className={avoid ? "avoid" : "do"}><h3>{title}</h3><ul>{items.map((item) => <li key={item}>{avoid ? <X /> : <Check />} {item}</li>)}</ul></article>;
}
