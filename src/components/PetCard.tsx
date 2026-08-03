"use client";
import Image from "next/image";import Link from "next/link";import { BadgeCheck, Heart, MapPin } from "lucide-react";import { useState } from "react";import type { Pet } from "@/lib/data";
export default function PetCard({pet}:{pet:Pet}){
 const [fav,setFav]=useState(()=>typeof window!=="undefined"&&localStorage.getItem(`fav-${pet.id}`)==="1");
 const toggle=()=>{const next=!fav;setFav(next);localStorage.setItem(`fav-${pet.id}`,next?"1":"0")};
 return <article className="pet-card"><div className="pet-image"><Image src={pet.image} alt={`${pet.name}, a ${pet.breed} available for adoption`} fill sizes="(max-width: 620px) 100vw, (max-width: 900px) 50vw, 33vw"/><button onClick={toggle} className={`icon-btn favorite ${fav?"active":""}`} aria-label={`${fav?"Remove":"Add"} ${pet.name} ${fav?"from":"to"} favorites`}><Heart size={18} fill={fav?"currentColor":"none"}/></button>{pet.urgency!=="Standard"&&<span className="urgency">{pet.urgency==="Urgent"?"Needs a home soon":"Recently added"}</span>}</div><div className="pet-body">
 <div className="pet-top"><div><h3>{pet.name}</h3><div className="pet-meta"><span>{pet.breed}</span><span>·</span><span>{pet.age}</span></div></div><span className="verified"><BadgeCheck size={15}/> Verified</span></div>
 <div className="chips"><span className="chip"><MapPin size={11}/> {pet.location}</span><span className="chip">{pet.sex}</span><span className="chip">{pet.size}</span></div><p className="pet-desc">{pet.description}</p>
 <div className="pet-actions"><Link className="btn btn-ghost btn-small" href={`/pets/${pet.id}`}>View profile</Link><Link className="btn btn-dark btn-small" href={`/application/${pet.id}`}>Apply</Link></div></div></article>
}
