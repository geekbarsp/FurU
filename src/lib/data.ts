export type Pet = {
  id: string; name: string; type: "Dog" | "Cat" | "Rabbit"; breed: string;
  age: string; ageGroup: "Young" | "Adult" | "Senior"; sex: "Male" | "Female";
  size: "Small" | "Medium" | "Large"; location: string; image: string;
  vaccinated: boolean; goodWith: string[]; specialNeeds?: string;
  urgency: "Standard" | "Soon" | "Urgent"; description: string; traits: string[];
  organization: string;
  photos?: string[];
  listingStatus?: "Published" | "Paused" | "Rehomed";
};

export const pets: Pet[] = [
  { id:"luna", name:"Luna", type:"Dog", breed:"Aspin mix", age:"2 years", ageGroup:"Adult", sex:"Female", size:"Medium", location:"Cabanatuan City", image:"/images/luna.png", vaccinated:true, goodWith:["Children","Dogs"], urgency:"Soon", description:"Sunshine in dog form. Luna is gentle, leash-ready, and happiest beside her people.", traits:["Affectionate","Playful","Gentle"], organization:"Paws & Paths Rescue" },
  { id:"miso", name:"Miso", type:"Cat", breed:"Calico", age:"1 year", ageGroup:"Young", sex:"Female", size:"Small", location:"Quezon City", image:"/images/miso.png", vaccinated:true, goodWith:["Cats","Children"], urgency:"Standard", description:"A curious window-watcher who warms up quickly and loves a good cardboard box.", traits:["Curious","Quiet","Cuddly"], organization:"Bahay Kalinga Cats" },
  { id:"mochi", name:"Mochi", type:"Rabbit", breed:"Dutch mix", age:"10 months", ageGroup:"Young", sex:"Male", size:"Small", location:"Makati", image:"/images/mochi.png", vaccinated:true, goodWith:["Children"], urgency:"Standard", description:"Soft, social, and litter-trained. Mochi enjoys leafy greens and calm afternoons.", traits:["Social","Calm","Food-motivated"], organization:"Small Paws PH" },
  { id:"bruno", name:"Bruno", type:"Dog", breed:"Labrador mix", age:"9 years", ageGroup:"Senior", sex:"Male", size:"Large", location:"Pasig", image:"/images/bruno.png", vaccinated:true, goodWith:["Children","Cats","Dogs"], specialNeeds:"Daily joint supplement", urgency:"Urgent", description:"A dignified senior with a silver muzzle and a heart that still loves long, slow walks.", traits:["Loyal","Mellow","House-trained"], organization:"Second Spring Rescue" },
  { id:"mango", name:"Mango", type:"Cat", breed:"Domestic shorthair", age:"5 months", ageGroup:"Young", sex:"Male", size:"Small", location:"Manila", image:"/images/mango.png", vaccinated:true, goodWith:["Cats","Dogs"], urgency:"Soon", description:"Fearless, funny, and always ready to chase a ribbon or nap in a sunny patch.", traits:["Brave","Energetic","Silly"], organization:"Harbor Tails Manila" },
  { id:"pippa", name:"Pippa", type:"Dog", breed:"Terrier mix", age:"3 years", ageGroup:"Adult", sex:"Female", size:"Small", location:"Cebu City", image:"/images/pippa.png", vaccinated:false, goodWith:["Dogs"], specialNeeds:"Completing vaccination series", urgency:"Soon", description:"A bright little survivor learning that hands bring treats, scratches, and safety.", traits:["Smart","Resilient","Sweet"], organization:"Sugbo Safe Paws" },
  { id:"tala", name:"Tala", type:"Dog", breed:"Aspin", age:"4 years", ageGroup:"Adult", sex:"Female", size:"Medium", location:"Davao City", image:"/images/luna.png", vaccinated:true, goodWith:["Children","Cats"], urgency:"Standard", description:"Steady and soulful, Tala is a wonderful companion for a calm family home.", traits:["Patient","Gentle","Alert"], organization:"Davao Animal Circle" },
  { id:"pepper", name:"Pepper", type:"Cat", breed:"Domestic shorthair", age:"7 years", ageGroup:"Senior", sex:"Male", size:"Small", location:"Quezon City", image:"/images/bruno.png", vaccinated:true, goodWith:["Cats"], specialNeeds:"Kidney-friendly diet", urgency:"Urgent", description:"An old soul who prefers quiet company, soft blankets, and slow introductions.", traits:["Quiet","Independent","Loving"], organization:"Bahay Kalinga Cats" },
  { id:"biscuit", name:"Biscuit", type:"Rabbit", breed:"Lionhead mix", age:"2 years", ageGroup:"Adult", sex:"Female", size:"Small", location:"Cabanatuan City", image:"/images/mochi.png", vaccinated:true, goodWith:["Children"], urgency:"Standard", description:"A tidy house rabbit with excellent manners and an impressive appetite for basil.", traits:["Neat","Gentle","Bright"], organization:"Small Paws PH" },
  { id:"kopi", name:"Kopi", type:"Dog", breed:"Mixed breed", age:"1 year", ageGroup:"Young", sex:"Male", size:"Medium", location:"Makati", image:"/images/pippa.png", vaccinated:true, goodWith:["Dogs","Children"], urgency:"Soon", description:"A bouncy, trainable pup who has never met a tennis ball he didn't love.", traits:["Athletic","Friendly","Trainable"], organization:"Paws & Paths Rescue" },
  { id:"suki", name:"Suki", type:"Cat", breed:"Tortoiseshell", age:"3 years", ageGroup:"Adult", sex:"Female", size:"Small", location:"Pasig", image:"/images/miso.png", vaccinated:true, goodWith:["Cats"], urgency:"Standard", description:"Elegant and observant, Suki saves her loudest purrs for people she trusts.", traits:["Observant","Graceful","Loyal"], organization:"Harbor Tails Manila" },
  { id:"bantay", name:"Bantay", type:"Dog", breed:"Aspin", age:"11 years", ageGroup:"Senior", sex:"Male", size:"Medium", location:"Manila", image:"/images/bruno.png", vaccinated:true, goodWith:["Children","Dogs"], specialNeeds:"Low-impact exercise", urgency:"Urgent", description:"A beloved senior ready to spend his golden years close to a kind family.", traits:["Devoted","Calm","Wise"], organization:"Second Spring Rescue" }
];

export function listingRowToPet(row: Record<string, unknown>): Pet {
  const details = (row.details || {}) as Record<string, string>;
  const goodWith = [details.children === "Yes" && "Children", details.cats === "Yes" && "Cats", details.dogs === "Yes" && "Dogs"].filter(Boolean) as string[];
  const rawType = String(row.animal_type || details.type || "Dog");
  const type: Pet["type"] = rawType === "Cat" || rawType === "Rabbit" ? rawType : "Dog";
  const rawSize = details.size;
  const size: Pet["size"] = rawSize === "Small" || rawSize === "Large" ? rawSize : "Medium";
  const rawSex = details.sex;
  const sex: Pet["sex"] = rawSex === "Male" ? "Male" : "Female";
  const age = String(row.age || "Age not provided");
  const ageGroup: Pet["ageGroup"] = /month|puppy|kitten|young/i.test(age) ? "Young" : /([89]|1[0-9])\s*year|senior/i.test(age) ? "Senior" : "Adult";
  const rawUrgency = details.urgency;
  const urgency: Pet["urgency"] = rawUrgency === "Urgent" || rawUrgency === "Soon" ? rawUrgency : "Standard";
  let photos: string[] = [];
  try { photos = JSON.parse(details.photos || "[]"); } catch { photos = []; }
  return {
    id: String(row.id), name: String(row.name), type, breed: String(row.breed), age, ageGroup,
    sex, size, location: String(row.location), image: details.photo_url || "/images/luna.png",
    vaccinated: details.vaccination === "Up to date", goodWith,
    specialNeeds: details.medical || undefined, urgency,
    description: details.personality || details.routine || String(row.reason || "A pet looking for a thoughtful next home."),
    traits: (details.personality || "Gentle").split(/[,·]/).map((item) => item.trim()).filter(Boolean).slice(0, 4),
    organization: details.organization || "Verified FurU guardian", photos,
    listingStatus:
      row.status === "Paused" || row.status === "Rehomed"
        ? row.status
        : "Published",
  };
}

export const journeySteps = [
  ["01", "Discover", "Browse profiles built around personality, care, and compatibility."],
  ["02", "Apply", "Answer a short, thoughtful application—save and return any time."],
  ["03", "Connect", "Chat safely, review details, and schedule a meet-and-greet."],
  ["04", "Welcome home", "Sign the agreement and start a supported new chapter."]
] as const;

export const routeLabels: Record<string,string> = {
  resources:"Pet care resources", volunteer:"Volunteer with us", donations:"Support verified rescues",
  messages:"Messages", appointments:"Appointments", verification:"Verification center",
  "lost-and-found":"Lost & found", foster:"Emergency foster requests", help:"Help center",
  privacy:"Privacy policy", terms:"Terms & conditions", admin:"Admin dashboard",
  contact:"Contact support", about:"About FurU", safety:"Community safety",
  "community-guidelines":"Community guidelines"
};
