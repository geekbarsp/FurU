import { pets, type Pet } from "@/lib/data";

export type PetHealthRecord = {
  label: string;
  status: string;
  date: string;
};

export type RichPetProfile = Pet & {
  photos: string[];
  story: string;
  behavior: string[];
  idealHome: string[];
  healthRecords: PetHealthRecord[];
  guardian: {
    name: string;
    score: number;
    reviews: number;
    responseTime: string;
    verified: boolean;
  };
};

const stories: Record<string, string> = {
  luna: "Luna was found waiting outside a neighborhood bakery and quickly showed everyone how much she loves people. She has lived with a foster family, learned home routines, and is now ready for a steady home of her own.",
  miso: "Miso entered foster care with her litter and grew into a confident, observant cat. She likes to investigate first, then settle close once she knows the room is safe.",
  mochi: "Mochi was surrendered when his first family moved. His foster taught him litter habits and handling at his pace; he now approaches familiar people for greens and gentle attention.",
  bruno: "Bruno spent most of his life as a family dog. A change in his guardian’s circumstances brought him into rescue, where he continues to charm everyone with his patient, affectionate nature.",
  mango: "Mango was rescued as a tiny roadside kitten. He recovered in foster care and has become a bold, playful companion who thrives on enrichment and friendly company.",
  pippa: "Pippa arrived cautious but curious. With predictable routines and reward-based training, she has learned to seek affection and enjoy walks with people she trusts.",
  tala: "Tala has been a calm neighborhood companion and is happiest when included in ordinary family life. She is looking for patient people who value her steady temperament.",
  pepper: "Pepper came into care after his guardian became unwell. He is a quiet senior who bonds deeply and prefers a peaceful routine with soft places to rest.",
  biscuit: "Biscuit has lived indoors and knows her litter area well. She enjoys exploring supervised spaces, chewing safe toys, and greeting people who bring fresh herbs.",
  kopi: "Kopi is an energetic young dog who was rescued with his siblings. He learns quickly, enjoys structured play, and would love an active household committed to continued training.",
  suki: "Suki is a thoughtful cat who takes her time with new situations. Once comfortable, she follows her person from room to room and offers a surprisingly loud purr.",
  bantay: "Bantay is a cherished senior whose guardian can no longer provide daily care. He remains gentle and engaged and deserves a comfortable, loving retirement.",
};

export function getRichPetProfile(pet: Pet): RichPetProfile {
  const actualPhotos = pet.photos?.length ? pet.photos : [pet.image];
  return {
    ...pet,
    photos: [actualPhotos[0], actualPhotos[1] || actualPhotos[0], actualPhotos[2] || actualPhotos[0]],
    story: stories[pet.id] || pet.description,
    behavior: [
      ...pet.traits,
      pet.type === "Dog" ? "Enjoys reward-based training" : pet.type === "Cat" ? "Prefers gentle introductions" : "Comfortable with calm handling",
      pet.goodWith.length ? `Has lived well with ${pet.goodWith.join(" and ").toLowerCase()}` : "Best introduced slowly to other animals",
    ],
    idealHome: [
      pet.size === "Large" ? "Secure space with room to move" : "A safe indoor resting area",
      pet.ageGroup === "Young" ? "Time for play, training, and supervision" : pet.ageGroup === "Senior" ? "A calm routine and accessible resting spaces" : "A consistent daily routine",
      pet.specialNeeds ? `Able to continue: ${pet.specialNeeds.toLowerCase()}` : "Able to maintain preventive veterinary care",
      `Within reasonable travel distance of ${pet.location}`,
    ],
    healthRecords: [
      { label: "Vaccinations", status: pet.vaccinated ? "Up to date" : "Series in progress", date: "Reviewed Jul 2026" },
      { label: "Veterinary examination", status: "Completed", date: "18 Jul 2026" },
      { label: "Parasite prevention", status: "Current", date: "Next due Sep 2026" },
      { label: "Medical notes", status: pet.specialNeeds || "No ongoing condition reported", date: "Guardian disclosed" },
    ],
    guardian: {
      name: pet.organization,
      score: pet.urgency === "Urgent" ? 4.8 : 4.7,
      reviews: pet.urgency === "Urgent" ? 7 : 5,
      responseTime: "Usually within 1 day",
      verified: true,
    },
  };
}

export const richPetProfiles = pets.map(getRichPetProfile);
