import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, CheckCircle2, MapPin, ShieldCheck, Star, Syringe } from "lucide-react";
import { listingRowToPet, pets, type Pet } from "@/lib/data";
import { getRichPetProfile } from "@/lib/pet-profile-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import PetCard from "@/components/PetCard";
import PetProfileActions from "@/components/PetProfileActions";
import ProfileReviews from "@/components/ProfileReviews";
import SafePetImage from "@/components/SafePetImage";

export function generateStaticParams() {
  return pets.map((pet) => ({ id: pet.id }));
}

async function loadPet(id: string): Promise<Pet | undefined> {
  const seeded = pets.find((candidate) => candidate.id === id);
  if (seeded) return seeded;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("pet_listings").select("id,name,animal_type,breed,age,location,reason,details").eq("id", id).eq("status", "Published").maybeSingle();
  return data ? listingRowToPet(data) : undefined;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const pet = await loadPet(id);
  if (!pet) return {};
  return {
    title: `${pet.name} – ${pet.breed} for adoption`,
    description: `${pet.description} View health, behavior, ideal-home, and guardian trust information on FurU.`,
    alternates: { canonical: `/pets/${pet.id}` },
  };
}

export default async function PetProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const basePet = await loadPet(id);
  if (!basePet) notFound();
  const pet = getRichPetProfile(basePet);

  return (
    <main className="page rich-pet-page">
      <div className="shell">
        <nav className="pet-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/browse">Browse pets</Link><span>/</span><span>{pet.name}</span>
        </nav>
        <section className="pet-profile-hero">
          <div className="pet-gallery">
            {pet.photos.map((photo, index) => (
              <div className={index === 0 ? "pet-gallery-main" : "pet-gallery-small"} key={`${photo}-${index}`}>
                <SafePetImage src={photo} alt={`${pet.name} adoption photo ${index + 1}`} priority={index === 0} sizes={index === 0 ? "(max-width: 900px) 100vw, 58vw" : "30vw"} />
              </div>
            ))}
            <span className="photo-note">Verified listing · {pet.photos.length} photos</span>
          </div>
          <div className="profile-content pet-profile-summary">
            <span className="eyebrow">Available for adoption</span>
            <h1>{pet.name}</h1>
            <p className="location-line"><MapPin size={17} /> {pet.location} · Approximate location</p>
            <div className="chips">{pet.traits.map((trait) => <span className="chip" key={trait}>{trait}</span>)}</div>
            <p className="profile-lede">{pet.description}</p>
            <div className="info-list">
              <div className="info"><small>Species & breed</small><b>{pet.type} · {pet.breed}</b></div>
              <div className="info"><small>Age</small><b>{pet.age}</b></div>
              <div className="info"><small>Sex & size</small><b>{pet.sex} · {pet.size}</b></div>
              <div className="info"><small>Vaccinations</small><b>{pet.vaccinated ? "Up to date" : "In progress"}</b></div>
            </div>
            {pet.specialNeeds && <div className="notice"><Syringe size={22} /><span><b>Ongoing care</b><br />{pet.specialNeeds}</span></div>}
            <PetProfileActions id={pet.id} name={pet.name} />
          </div>
        </section>

        <div className="pet-detail-layout">
          <div className="pet-detail-main">
            <section className="pet-detail-section"><span className="eyebrow">Their story</span><h2>Meet {pet.name} properly.</h2><p>{pet.story}</p></section>
            <section className="pet-detail-section"><span className="eyebrow">Personality & behavior</span><h2>What daily life feels like.</h2><div className="detail-check-grid">{pet.behavior.map((item) => <div key={item}><CheckCircle2 />{item}</div>)}</div></section>
            <section className="pet-detail-section"><span className="eyebrow">Health record</span><h2>Care information at a glance.</h2><div className="health-record-table">{pet.healthRecords.map((record) => <div key={record.label}><span><b>{record.label}</b><small>{record.date}</small></span><strong>{record.status}</strong></div>)}</div><p className="record-disclaimer">Ask the guardian to share original veterinary documents during the application process. FurU does not independently diagnose or certify medical records.</p></section>
            <section className="pet-detail-section"><span className="eyebrow">Ideal home</span><h2>A match that can last.</h2><div className="detail-check-grid">{pet.idealHome.map((item) => <div key={item}><CheckCircle2 />{item}</div>)}</div></section>
          </div>
          <aside className="guardian-trust-card">
            <span className="trust-icon"><ShieldCheck /></span>
            <span className="eyebrow">Guardian Trust Score</span>
            <h3>{pet.guardian.name}</h3>
            <div className="guardian-score"><Star fill="currentColor" /><b>{pet.guardian.score.toFixed(1)}</b><span>/ 5</span></div>
            <p>{pet.guardian.reviews} verified post-handover reviews</p>
            <ul><li><BadgeCheck /> Identity and role verified</li><li><CheckCircle2 /> Health disclosure completed</li><li><CheckCircle2 /> {pet.guardian.responseTime}</li></ul>
            <Link className="btn btn-ghost full-btn" href={`/profile/reviews?guardian=${encodeURIComponent(pet.guardian.name)}`}>View guardian reviews</Link>
          </aside>
        </div>
        <ProfileReviews profileId={pet.id} guardian={pet.organization} />
        <section className="section similar"><div className="section-head"><div><span className="eyebrow">You may also love</span><h2>Similar friends.</h2></div></div><div className="cards">{pets.filter((candidate) => candidate.id !== pet.id && candidate.type === pet.type).slice(0, 3).map((candidate) => <PetCard key={candidate.id} pet={candidate} />)}</div></section>
      </div>
    </main>
  );
}
