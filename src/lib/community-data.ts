export type PartnerOrganization = {
  id: string;
  name: string;
  shortName: string;
  location: string;
  focus: string;
  description: string;
  verifiedSince: string;
  animalsHelped: number;
  raised: number;
  spent: number;
  needs: string[];
  allocation: { label: string; value: number }[];
  accent: string;
};

export const partnerOrganizations: PartnerOrganization[] = [
  {
    id: "paws-paths",
    name: "Paws & Paths Rescue",
    shortName: "P&P",
    location: "Cabanatuan City",
    focus: "Rescue, recovery & rehoming",
    description:
      "A foster-led team helping abandoned dogs recover, learn home life, and meet well-matched adopters.",
    verifiedSince: "March 2024",
    animalsHelped: 148,
    raised: 184500,
    spent: 151290,
    needs: ["Veterinary care", "Dog food", "Transport"],
    allocation: [
      { label: "Veterinary care", value: 58 },
      { label: "Food & supplies", value: 27 },
      { label: "Transport", value: 15 },
    ],
    accent: "#dceadf",
  },
  {
    id: "bahay-kalinga",
    name: "Bahay Kalinga Cats",
    shortName: "BKC",
    location: "Quezon City",
    focus: "Community cats & TNR",
    description:
      "A neighborhood network providing trap-neuter-return, urgent treatment, and foster placement for community cats.",
    verifiedSince: "August 2024",
    animalsHelped: 231,
    raised: 126800,
    spent: 110316,
    needs: ["Spay & neuter", "Kitten formula", "Foster kits"],
    allocation: [
      { label: "Spay & neuter", value: 51 },
      { label: "Medical care", value: 31 },
      { label: "Foster supplies", value: 18 },
    ],
    accent: "#f4d9c7",
  },
  {
    id: "second-spring",
    name: "Second Spring Rescue",
    shortName: "SSR",
    location: "Pasig City",
    focus: "Senior & special-needs pets",
    description:
      "A small rescue giving older and special-needs animals the comfort, medical support, and dignity they deserve.",
    verifiedSince: "January 2025",
    animalsHelped: 74,
    raised: 213400,
    spent: 183524,
    needs: ["Maintenance medicine", "Diagnostics", "Soft bedding"],
    allocation: [
      { label: "Medicine & diagnostics", value: 64 },
      { label: "Special diets", value: 24 },
      { label: "Comfort supplies", value: 12 },
    ],
    accent: "#dcecf0",
  },
];

export const volunteerRoles = [
  {
    id: "transport",
    title: "Rescue transport",
    description: "Help pets travel safely to clinics, foster homes, and meet-and-greets.",
    commitment: "2–4 hours per trip",
    requirements: "Valid licence and safe vehicle",
  },
  {
    id: "foster",
    title: "Temporary foster",
    description: "Offer a calm landing place while a pet recovers or waits for the right home.",
    commitment: "2–6 weeks",
    requirements: "Home check and orientation",
  },
  {
    id: "events",
    title: "Events & outreach",
    description: "Welcome visitors, support adoption days, and help share responsible pet care.",
    commitment: "3–5 hours per event",
    requirements: "Brief online orientation",
  },
];

export const helpFaqs = [
  { category: "Adoption", question: "How do I apply to adopt a pet?", answer: "Open a pet profile and choose Apply to adopt. You can save your answers, return later, and track the application from your dashboard." },
  { category: "Adoption", question: "Does submitting an application guarantee adoption?", answer: "No. Guardians and welfare organizations review fit, care plans, and the pet’s needs. FurU encourages transparent decisions and respectful updates." },
  { category: "Adoption", question: "Can I meet a pet before deciding?", answer: "Yes. When your application moves forward, use FurU messages to coordinate a safe meet-and-greet with the guardian or organization." },
  { category: "Rehoming", question: "Who can publish a pet listing?", answer: "Verified guardians and approved welfare organizations can publish. Listings are reviewed for clear welfare information and responsible placement." },
  { category: "Rehoming", question: "How does FurU protect a pet after handover?", answer: "FurU supports handover records and scheduled welfare check-ins. Concerns can be escalated from the monitoring page." },
  { category: "Donations", question: "Where does my donation go?", answer: "You choose a verified partner. Each profile shows its current needs and reported allocation. FurU’s prototype does not deduct platform fees." },
  { category: "Donations", question: "Will I receive a receipt?", answer: "Yes. The donation flow creates an electronic receipt with a unique reference. In production, the payment provider confirmation would be attached to it." },
  { category: "Volunteering", question: "Do I need animal-care experience?", answer: "Not for every role. Event volunteers receive an orientation, while fostering and transport require role-specific screening before coordination begins." },
  { category: "Volunteering", question: "How are volunteers matched with organizations?", answer: "Your role, location, availability, and preferences are shared with the verified organization you choose. They confirm the next step through FurU." },
  { category: "Safety", question: "Should I share my phone number in messages?", answer: "Keep personal contact details private until both participants consent. Use FurU messages for early planning and report suspicious requests." },
  { category: "Account", question: "How do I reset my password?", answer: "Choose Forgot password on the sign-in page. FurU will email a secure reset link to the address on your account." },
];
