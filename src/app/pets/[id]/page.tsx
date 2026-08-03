import Image from "next/image";
import { notFound } from "next/navigation";
import { BadgeCheck,MapPin,Syringe } from "lucide-react";
import { pets } from "@/lib/data";
import PetCard from "@/components/PetCard";
import PetProfileActions from "@/components/PetProfileActions";

export function generateStaticParams(){return pets.map(p=>({id:p.id}))}

export default async function PetProfile({params}:{params:Promise<{id:string}>}){
 const {id}=await params;const pet=pets.find(p=>p.id===id);if(!pet)notFound();
 return <main className="page"><div className="shell"><div className="profile-grid">
  <div className="profile-image"><Image src={pet.image} alt={`${pet.name}, ${pet.breed}`} width={700} height={700} priority/><div className="photo-note">Original FurU portrait · Verified listing</div></div>
  <div className="profile-content"><span className="eyebrow">Available for adoption</span><h1>{pet.name}</h1><p className="location-line"><MapPin size={17}/> {pet.location} · Approximate location</p><div className="chips">{pet.traits.map(t=><span className="chip" key={t}>{t}</span>)}</div><p className="profile-lede">{pet.description}</p>
   <div className="info-list"><div className="info"><small>Breed</small><b>{pet.breed}</b></div><div className="info"><small>Age</small><b>{pet.age}</b></div><div className="info"><small>Sex & size</small><b>{pet.sex} · {pet.size}</b></div><div className="info"><small>Vaccinations</small><b>{pet.vaccinated?"Up to date":"In progress"}</b></div></div>
   {pet.specialNeeds&&<div className="notice"><Syringe size={22}/><span><b>Care note</b><br/>{pet.specialNeeds}</span></div>}
   <h3 className="profile-question">Could you be {pet.name}&apos;s person?</h3><p>Good with {pet.goodWith.join(", ").toLowerCase()}. A secure indoor sleeping area and an introductory meet-and-greet are preferred.</p><PetProfileActions id={pet.id} name={pet.name}/>
   <div className="notice partner-notice"><BadgeCheck size={22}/><span><b>{pet.organization}</b><br/>Verified welfare partner · Responds in about 1 day</span></div>
  </div></div>
  <section className="section similar"><div className="section-head"><div><span className="eyebrow">You may also love</span><h2>Similar friends.</h2></div></div><div className="cards">{pets.filter(p=>p.id!==pet.id&&p.type===pet.type).slice(0,3).map(p=><PetCard key={p.id} pet={p}/>)}</div></section>
 </div></main>
}
