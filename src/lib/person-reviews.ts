export type PersonReview = {
  id: string;
  name: string;
  rating: number;
  date: string;
  relationship: string;
  pet: string;
  review: string;
  accuracy: number;
  communication: number;
  care: number;
  handover: number;
};
export const personReviews: PersonReview[] = [
  {
    id: "mara",
    name: "Baldo Miranda",
    rating: 5,
    date: "July 18, 2026",
    relationship: "Completed adoption",
    pet: "Luna",
    review:
      "The pet profile was honest and complete. Every medical record was ready, questions were answered clearly, and the handover gave Luna enough time to feel safe.",
    accuracy: 5,
    communication: 5,
    care: 5,
    handover: 5,
  },
  {
    id: "paolo",
    name: "Nathaniel aka David Luna",
    rating: 4.5,
    date: "June 2, 2026",
    relationship: "Meet-and-greet",
    pet: "Miso",
    review:
      "Warm, thoughtful, and very open about Miso’s routine. Scheduling took a little time, but I never felt pressured and all of my questions were welcomed.",
    accuracy: 5,
    communication: 4,
    care: 5,
    handover: 4,
  },
  {
    id: "lea",
    name: "Si Kuya Dom",
    rating: 4,
    date: "May 11, 2026",
    relationship: "Completed adoption",
    pet: "Bruno",
    review:
      "Bruno arrived with his supplies, care notes, and veterinary history. The first-week check-in was genuinely helpful during his adjustment.",
    accuracy: 4,
    communication: 4,
    care: 5,
    handover: 4,
  },
  {
    id: "nico",
    name: "Francis Vamos",
    rating: 5,
    date: "March 29, 2026",
    relationship: "Completed adoption",
    pet: "Mango",
    review:
      "An excellent guardian who clearly cared about finding the right home rather than the fastest one. The full process was calm, safe, and respectful.",
    accuracy: 5,
    communication: 5,
    care: 5,
    handover: 5,
  },
  {
    id: "aisha",
    name: "Angel Lose",
    rating: 4,
    date: "February 14, 2026",
    relationship: "Applicant conversation",
    pet: "Pippa",
    review:
      "The listing matched what I learned in our conversation. I appreciated the honest explanation of Pippa’s vaccination schedule and home needs.",
    accuracy: 5,
    communication: 4,
    care: 4,
    handover: 3,
  },
    {
    id: "dre",
    name: "Xander Cruz",
    rating: 3,
    date: "February 16, 2026",
    relationship: "Applicant conversation",
    pet: "Doggydawgs",
    review:
      "Cute siya hehe. Pero medyo kulang sa details about the pet. I had to ask a lot of questions to understand the pet's needs and behavior.",
    accuracy: 5,
    communication: 4,
    care: 4,
    handover: 3,
  },
];
export const personTrustScore =
  personReviews.reduce((sum, review) => sum + review.rating, 0) /
  personReviews.length;
