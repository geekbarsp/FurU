export const petCareCategories = [
  "All",
  "New Pet",
  "Health",
  "Nutrition",
  "Grooming",
  "Training",
  "Safety",
  "Senior Care",
  "Adoption Support",
] as const;

export type PetCareCategory = Exclude<(typeof petCareCategories)[number], "All">;
export type PetCareIcon =
  | "home"
  | "calendar"
  | "clipboard"
  | "utensils"
  | "shield"
  | "heart"
  | "stethoscope"
  | "sparkles"
  | "award"
  | "message"
  | "cloud"
  | "users"
  | "alert"
  | "backpack"
  | "clock"
  | "baby"
  | "paw"
  | "handover";

export type GuideSection = {
  heading: string;
  body: string;
  bullets: string[];
};

export type PetCareResource = {
  id: string;
  title: string;
  description: string;
  category: PetCareCategory;
  minutes: number;
  icon: PetCareIcon;
  featured: boolean;
  tags: string[];
  introduction: string;
  sections: GuideSection[];
  checklist: string[];
  safetyNote: string;
};

const resource = (
  item: Omit<PetCareResource, "featured"> & { featured?: boolean },
): PetCareResource => ({ featured: false, ...item });

export const petCareResources: PetCareResource[] = [
  resource({
    id: "preparing-your-home-for-a-new-pet",
    title: "Preparing Your Home for a New Pet",
    description: "Create a safe, comfortable space before your new companion arrives.",
    category: "New Pet",
    minutes: 7,
    icon: "home",
    featured: true,
    tags: ["home", "supplies", "safe space", "arrival"],
    introduction:
      "A little preparation lowers stress and gives a new pet a quiet place to learn the sounds, smells, and routines of your home.",
    sections: [
      { heading: "Choose a settling-in space", body: "Start with one calm, easy-to-clean area rather than the whole home.", bullets: ["Place food and water away from toileting areas", "Provide a covered retreat or comfortable bed", "Keep visitors and noise low during the first days"] },
      { heading: "Remove common hazards", body: "Explore each room from your pet’s height and secure anything chewable, breakable, toxic, or easy to swallow.", bullets: ["Cover wires and close windows or balconies", "Store medicines, cleaners, and food securely", "Check plants before keeping them within reach"] },
      { heading: "Plan the routine", body: "Agree on feeding, toilet, exercise, sleep, and supervision responsibilities before arrival.", bullets: ["Write down household rules", "Use the same cues and feeding amounts", "Keep the first week flexible and quiet"] },
    ],
    checklist: ["Safe resting area prepared", "Food and water ready", "Hazards secured", "Identification arranged", "Veterinary records collected"],
    safetyNote: "Supervise access to unfamiliar rooms until you understand the pet’s behavior and mobility.",
  }),
  resource({
    id: "first-seven-days-after-adoption",
    title: "First 7 Days After Adoption",
    description: "A simple adjustment plan for helping a newly adopted pet settle in.",
    category: "Adoption Support",
    minutes: 8,
    icon: "calendar",
    featured: true,
    tags: ["first week", "routine", "decompression", "adoption"],
    introduction: "The first week is for safety and observation—not for testing how quickly a pet can adapt.",
    sections: [
      { heading: "Days 1–2: decompress", body: "Offer quiet, predictable care and let the pet choose when to interact.", bullets: ["Use one safe room or small area", "Keep meals and toilet breaks consistent", "Avoid parties, baths, and crowded outings"] },
      { heading: "Days 3–5: build familiarity", body: "Introduce short, positive activities while protecting rest time.", bullets: ["Explore one new area at a time", "Reward calm behavior", "Begin gentle handling only when welcomed"] },
      { heading: "Days 6–7: review wellbeing", body: "Look for trends in appetite, sleep, toileting, movement, and comfort.", bullets: ["Record questions for a veterinarian", "Adjust routines slowly", "Celebrate small signs of trust"] },
    ],
    checklist: ["Pet is eating and drinking", "Toileting is monitored", "Safe space remains available", "Introductions are supervised", "Vet plan is scheduled"],
    safetyNote: "Persistent refusal to eat, breathing difficulty, collapse, repeated vomiting, or severe distress needs prompt veterinary advice.",
  }),
  resource({
    id: "essential-supplies-checklist",
    title: "Essential Supplies Checklist",
    description: "Food, bedding, identification, grooming tools, carriers, toys, and other basics.",
    category: "New Pet",
    minutes: 5,
    icon: "clipboard",
    tags: ["shopping", "checklist", "equipment", "basics"],
    introduction: "Choose safe, correctly sized essentials first. You can learn your pet’s preferences before buying extras.",
    sections: [
      { heading: "Daily essentials", body: "Start with items needed for eating, resting, toileting, and safe movement.", bullets: ["Species- and age-appropriate food", "Washable bowls and bedding", "Secure carrier, collar, tag, or leash"] },
      { heading: "Care and enrichment", body: "Simple tools make routine care and healthy activity easier.", bullets: ["Appropriate brush and nail-care tools", "Safe toys without loose or swallowable parts", "Cleaning supplies stored out of reach"] },
      { heading: "Records and backup supplies", body: "Keep important information together and prepare for delays or emergencies.", bullets: ["Vaccination and medical records", "Recent photo and identification details", "Several days of food and necessary medication"] },
    ],
    checklist: ["Food and bowls", "Bed or resting mat", "Identification", "Carrier or leash", "Toilet supplies", "Grooming tools", "Safe toys"],
    safetyNote: "Inspect toys, collars, carriers, and leads regularly for damage or an unsafe fit.",
  }),
  resource({
    id: "feeding-and-nutrition-basics",
    title: "Feeding and Nutrition Basics",
    description: "Learn about balanced diets, feeding schedules, portion control, and safe treats.",
    category: "Nutrition",
    minutes: 8,
    icon: "utensils",
    featured: true,
    tags: ["food", "portions", "water", "diet"],
    introduction: "Good nutrition is species-specific and changes with age, activity, body condition, and health.",
    sections: [
      { heading: "Choose an appropriate diet", body: "Use complete food intended for the pet’s species and life stage unless a veterinarian recommends otherwise.", bullets: ["Read the feeding guide as a starting point", "Consider body condition and activity", "Ask before using supplements or homemade diets"] },
      { heading: "Build a steady routine", body: "Measured meals make appetite and weight changes easier to notice.", bullets: ["Use a consistent measuring cup or scale", "Keep clean water available", "Count treats as part of daily intake"] },
      { heading: "Change food gradually", body: "A slow transition can reduce digestive upset.", bullets: ["Mix increasing amounts over several days", "Monitor stool, vomiting, itching, and appetite", "Pause and seek advice if concerning symptoms appear"] },
    ],
    checklist: ["Correct species and life stage", "Portion measured", "Fresh water available", "Treats limited", "Weight checked regularly"],
    safetyNote: "Rapid weight change, prolonged appetite loss, or difficulty eating should be discussed with a licensed veterinarian.",
  }),
  resource({
    id: "foods-pets-should-never-eat",
    title: "Foods Pets Should Never Eat",
    description: "Recognize common household foods that may be dangerous to cats and dogs.",
    category: "Safety",
    minutes: 6,
    icon: "shield",
    tags: ["poison", "toxic food", "chocolate", "xylitol"],
    introduction: "Some ordinary foods can cause serious illness. Risk depends on species, body size, amount, and health.",
    sections: [
      { heading: "Keep high-risk foods secured", body: "Prevent access instead of relying on a pet to avoid unsafe food.", bullets: ["Chocolate, caffeine, alcohol, and xylitol", "Grapes, raisins, onions, and garlic", "Cooked bones and excessively salty food"] },
      { heading: "Prevent accidental exposure", body: "Bins, bags, counters, and visitors are common sources of accidental ingestion.", bullets: ["Use lidded bins", "Ask visitors not to share food", "Read ingredient labels on sugar-free products"] },
      { heading: "Respond promptly", body: "If exposure may have occurred, collect useful information without delaying professional advice.", bullets: ["Note the item, amount, and approximate time", "Keep packaging or take a photo", "Do not induce vomiting unless instructed"] },
    ],
    checklist: ["Unsafe foods stored securely", "Household informed", "Bins covered", "Packaging available", "Veterinary contact saved"],
    safetyNote: "Contact a veterinarian promptly if poisoning is suspected. Do not wait for symptoms or use a home remedy unless instructed.",
  }),
  resource({
    id: "vaccination-and-preventive-care",
    title: "Vaccination and Preventive Care",
    description: "Understand routine vaccines, parasite prevention, checkups, and health records.",
    category: "Health",
    minutes: 9,
    icon: "heart",
    tags: ["vaccines", "parasites", "checkup", "records"],
    introduction: "Preventive care should be tailored to species, age, lifestyle, local disease risks, and medical history.",
    sections: [
      { heading: "Create a veterinary plan", body: "A veterinarian can assess current health and recommend an appropriate schedule.", bullets: ["Bring all available records", "Discuss indoor and outdoor exposure", "Ask which vaccines are core or risk-based"] },
      { heading: "Prevent parasites safely", body: "Products and doses are species- and weight-specific.", bullets: ["Discuss fleas, ticks, heartworm, and intestinal parasites", "Never use dog-only products on cats", "Record product and treatment dates"] },
      { heading: "Track everyday health", body: "Routine observations help identify gradual change.", bullets: ["Monitor weight and body condition", "Check skin, mouth, movement, and appetite", "Keep records accessible during emergencies"] },
    ],
    checklist: ["Wellness visit arranged", "Vaccination record updated", "Parasite plan confirmed", "Weight recorded", "Next review date saved"],
    safetyNote: "Only use vaccines and parasite products prescribed or recommended for your pet’s species and weight.",
  }),
  resource({
    id: "when-to-visit-a-veterinarian",
    title: "When to Visit a Veterinarian",
    description: "Learn which symptoms require monitoring, an appointment, or urgent care.",
    category: "Health",
    minutes: 7,
    icon: "stethoscope",
    featured: true,
    tags: ["symptoms", "emergency", "clinic", "warning signs"],
    introduction: "Knowing what is normal for your pet makes sudden or progressive change easier to recognize.",
    sections: [
      { heading: "Seek urgent help", body: "Severe, sudden, or life-threatening signs should not be monitored at home.", bullets: ["Difficulty breathing, collapse, seizure, or severe weakness", "Heavy bleeding, major injury, poisoning, or extreme pain", "Inability to urinate or sudden abdominal swelling"] },
      { heading: "Arrange a timely appointment", body: "Changes that persist, recur, or affect normal activity deserve assessment.", bullets: ["Repeated vomiting or diarrhea", "Skin, eye, ear, dental, or mobility problems", "Changes in thirst, urination, appetite, or weight"] },
      { heading: "Prepare useful information", body: "Clear observations help a clinic triage and assess your pet.", bullets: ["Record timing and frequency", "Take a photo or video when safe", "Bring medicines, records, and possible toxin packaging"] },
    ],
    checklist: ["Symptoms recorded", "Clinic called", "Transport arranged", "Records packed", "Pet kept calm and secure"],
    safetyNote: "When unsure about a severe symptom, call a licensed veterinary clinic for triage rather than waiting for it to worsen.",
  }),
  resource({
    id: "grooming-and-hygiene",
    title: "Grooming and Hygiene",
    description: "Build a routine for bathing, brushing, nail care, dental care, and ear cleaning.",
    category: "Grooming",
    minutes: 8,
    icon: "sparkles",
    tags: ["bath", "brush", "nails", "dental"],
    introduction: "Gentle, regular grooming supports comfort and lets you notice skin, coat, mouth, ear, or mobility changes.",
    sections: [
      { heading: "Match care to the pet", body: "Coat, species, age, health, and lifestyle determine the right routine.", bullets: ["Brush without pulling mats", "Use pet-safe products", "Keep bathing frequency appropriate"] },
      { heading: "Make handling cooperative", body: "Short sessions and rewards can turn care into a predictable experience.", bullets: ["Start with brief touches", "Pause when body language shows distress", "Use a non-slip, quiet area"] },
      { heading: "Know when to get help", body: "Painful or advanced problems need professional care.", bullets: ["Do not cut severe mats close to skin", "Ask for nail-trimming guidance", "Seek advice for odor, discharge, pain, or inflamed skin"] },
    ],
    checklist: ["Brush selected", "Pet-safe cleanser ready", "Nails checked", "Teeth and gums observed", "Ears checked externally"],
    safetyNote: "Never place tools or liquid deep inside an ear canal, and stop any grooming step that causes pain or panic.",
  }),
  resource({
    id: "basic-training-and-positive-reinforcement",
    title: "Basic Training and Positive Reinforcement",
    description: "Use reward-based methods to teach good habits and build trust.",
    category: "Training",
    minutes: 9,
    icon: "award",
    tags: ["rewards", "cues", "behavior", "trust"],
    introduction: "Training works best when the desired choice is clear, achievable, and followed immediately by something the pet values.",
    sections: [
      { heading: "Set up success", body: "Change the environment so the right behavior is easier to choose.", bullets: ["Reduce distractions", "Prepare small rewards", "Teach one simple step at a time"] },
      { heading: "Mark and reward", body: "Reward the behavior you want at the moment it happens.", bullets: ["Use a consistent word or click", "Deliver the reward promptly", "Gradually practice in new places"] },
      { heading: "Respond to mistakes calmly", body: "Mistakes show that the task or environment is too difficult right now.", bullets: ["Avoid punishment and intimidation", "Interrupt safely and redirect", "Return to an easier step"] },
    ],
    checklist: ["Goal behavior defined", "Rewards prepared", "Session kept short", "Household cues consistent", "Progress recorded"],
    safetyNote: "Seek a qualified, reward-based professional for aggression, severe fear, guarding, or behavior that could cause injury.",
  }),
  resource({
    id: "understanding-pet-body-language",
    title: "Understanding Pet Body Language",
    description: "Recognize signs of comfort, fear, stress, excitement, and possible aggression.",
    category: "Training",
    minutes: 8,
    icon: "message",
    tags: ["stress", "fear", "communication", "signals"],
    introduction: "Body language is contextual. Look at the whole body, the situation, and how signals change over time.",
    sections: [
      { heading: "Notice comfortable behavior", body: "Loose movement and voluntary engagement often indicate greater comfort.", bullets: ["Soft face and normal breathing", "Curved, relaxed posture", "Ability to eat, explore, rest, or disengage"] },
      { heading: "Recognize early stress", body: "Small signals are a chance to reduce pressure before behavior escalates.", bullets: ["Turning away, hiding, freezing, or pacing", "Lip licking, yawning, flattened ears, or tucked posture", "Sudden scratching, sniffing, or refusal of food"] },
      { heading: "Create distance safely", body: "Do not punish warning signals; they communicate discomfort.", bullets: ["Stop approaching or handling", "Give a clear exit route", "Separate with barriers instead of reaching into conflict"] },
    ],
    checklist: ["Whole body observed", "Context considered", "Choice and distance provided", "Triggers recorded", "Pain ruled out when behavior changes"],
    safetyNote: "A sudden behavior change can be related to pain or illness and should be discussed with a veterinarian.",
  }),
  resource({
    id: "helping-a-shy-or-anxious-pet",
    title: "Helping a Shy or Anxious Pet",
    description: "Support nervous pets with patience, structure, safe spaces, and gradual exposure.",
    category: "Adoption Support",
    minutes: 8,
    icon: "cloud",
    tags: ["anxiety", "fear", "safe space", "confidence"],
    introduction: "Confidence grows through safety, choice, predictable routines, and experiences that stay below the pet’s fear threshold.",
    sections: [
      { heading: "Protect a retreat", body: "A pet should be able to rest without being followed, touched, or stared at.", bullets: ["Use a quiet room, crate, perch, or covered bed", "Keep essentials easy to reach", "Teach children to leave the retreat undisturbed"] },
      { heading: "Let the pet choose", body: "Voluntary approach builds more trust than forced contact.", bullets: ["Sit sideways and avoid leaning over", "Toss treats without demanding closeness", "Allow the pet to move away"] },
      { heading: "Expand gradually", body: "Introduce one manageable change at a time.", bullets: ["Keep sessions brief", "Pair new experiences with good outcomes", "Return to an easier distance when stress increases"] },
    ],
    checklist: ["Retreat protected", "Routine predictable", "Visitors limited", "Choice respected", "Stress triggers recorded"],
    safetyNote: "Severe anxiety, self-injury, panic, aggression, or inability to perform normal activities needs professional support.",
  }),
  resource({
    id: "socializing-dogs-and-cats-safely",
    title: "Socializing Dogs and Cats Safely",
    description: "Introduce pets to people, animals, sounds, and environments at a safe pace.",
    category: "Training",
    minutes: 9,
    icon: "users",
    tags: ["socialization", "introductions", "exposure", "confidence"],
    introduction: "Safe socialization is positive, gradual exposure—not forced interaction or overwhelming contact.",
    sections: [
      { heading: "Start at a comfortable distance", body: "The pet should still be able to eat, respond, and move normally.", bullets: ["Observe before approaching", "Use barriers and secure equipment", "Reward calm observation"] },
      { heading: "Keep experiences brief", body: "Finish while the pet is still comfortable instead of waiting for distress.", bullets: ["Introduce one variable at a time", "Include recovery and rest", "Repeat easy successes"] },
      { heading: "Respect individual needs", body: "Not every pet needs close contact with unfamiliar animals or people.", bullets: ["Prioritize neutrality over greeting", "Avoid crowded off-leash areas", "Seek help for intense fear or reactivity"] },
    ],
    checklist: ["Secure equipment checked", "Distance planned", "Rewards ready", "Exit route available", "Session ended calmly"],
    safetyNote: "Do not permit direct contact when either animal is stiff, trapped, highly aroused, or unable to disengage.",
  }),
  resource({
    id: "pet-proofing-your-home",
    title: "Pet-Proofing Your Home",
    description: "Reduce risks from wires, chemicals, small objects, toxic plants, open windows, and unsafe rooms.",
    category: "Safety",
    minutes: 7,
    icon: "alert",
    tags: ["hazards", "plants", "chemicals", "windows"],
    introduction: "Pet-proofing is an ongoing habit because curiosity, mobility, and household items change.",
    sections: [
      { heading: "Secure substances and small items", body: "Anything swallowed, chewed, spilled, or climbed into deserves attention.", bullets: ["Lock medicines and cleaning products", "Remove strings, batteries, and small toys", "Check food, plants, and essential oils for risk"] },
      { heading: "Control access", body: "Physical barriers are more reliable than correction after a pet reaches danger.", bullets: ["Screen windows and balconies securely", "Use gates or closed doors", "Block appliances, bins, and unsafe gaps"] },
      { heading: "Review each life stage", body: "Young, newly adopted, aging, or disabled pets may encounter different risks.", bullets: ["Add non-slip surfaces", "Recheck escape points", "Move hazards as reach and mobility change"] },
    ],
    checklist: ["Wires covered", "Chemicals locked", "Plants checked", "Windows secured", "Small objects removed", "Bins covered"],
    safetyNote: "If a pet may have swallowed a toxin or foreign object, contact a veterinarian promptly instead of waiting for symptoms.",
  }),
  resource({
    id: "emergency-preparedness-for-pet-owners",
    title: "Emergency Preparedness for Pet Owners",
    description: "Prepare an emergency kit, evacuation plan, identification, and important records.",
    category: "Safety",
    minutes: 10,
    icon: "backpack",
    featured: true,
    tags: ["disaster", "evacuation", "kit", "records"],
    introduction: "Typhoons, floods, fires, earthquakes, and household emergencies are easier to navigate when a pet plan is ready.",
    sections: [
      { heading: "Build a portable kit", body: "Keep supplies together in a waterproof, easy-to-carry container.", bullets: ["Several days of food, water, and medicine", "Carrier, lead, sanitation supplies, and comfort item", "First-aid basics recommended by your veterinarian"] },
      { heading: "Protect identification and records", body: "Copies help reunite pets and maintain care when systems are disrupted.", bullets: ["Current tag and recent photos", "Vaccination, prescription, and ownership records", "Written contacts stored offline"] },
      { heading: "Practice the plan", body: "Everyone should know who secures each pet and where to meet.", bullets: ["Identify pet-friendly destinations", "Practice calm carrier entry", "Plan for transport without private vehicles"] },
    ],
    checklist: ["Emergency kit packed", "IDs current", "Records copied", "Destinations identified", "Household roles assigned"],
    safetyNote: "Never leave a restrained or confined pet behind during an evacuation when it is safe and permitted to take them.",
  }),
  resource({
    id: "caring-for-senior-pets",
    title: "Caring for Senior Pets",
    description: "Support aging pets through comfort, mobility care, nutrition, and regular health checks.",
    category: "Senior Care",
    minutes: 9,
    icon: "clock",
    tags: ["aging", "mobility", "comfort", "senior"],
    introduction: "Aging is individual. Small home adjustments and earlier health conversations can protect comfort and independence.",
    sections: [
      { heading: "Make movement easier", body: "Reduce slipping, jumping, and long travel between essential areas.", bullets: ["Use rugs, ramps, and supportive bedding", "Keep bowls and toilets accessible", "Maintain gentle activity appropriate to ability"] },
      { heading: "Watch gradual changes", body: "Track patterns rather than assuming every change is normal aging.", bullets: ["Monitor weight, appetite, thirst, and toileting", "Notice sleep, confusion, hearing, vision, and movement", "Record good days and difficult days"] },
      { heading: "Review care regularly", body: "Senior pets may need more frequent health assessment.", bullets: ["Discuss dental and pain care", "Review diet and medication", "Ask about comfort and quality-of-life measures"] },
    ],
    checklist: ["Non-slip paths added", "Bed supportive", "Food and water accessible", "Changes recorded", "Health review scheduled"],
    safetyNote: "Do not give human pain medication. Many common products are dangerous to pets.",
  }),
  resource({
    id: "introducing-a-pet-to-children",
    title: "Introducing a Pet to Children",
    description: "Teach respectful interaction and supervise introductions for everyone’s safety.",
    category: "Safety",
    minutes: 7,
    icon: "baby",
    tags: ["children", "family", "supervision", "boundaries"],
    introduction: "Adults are responsible for managing the environment, reading the pet’s signals, and teaching children gentle boundaries.",
    sections: [
      { heading: "Prepare before contact", body: "Explain simple rules and create a pet-only retreat.", bullets: ["Use quiet voices and slow movement", "Do not disturb eating or sleeping", "Never follow a pet into its safe space"] },
      { heading: "Keep introductions structured", body: "Begin with distance and short interactions led by an adult.", bullets: ["Let the pet approach", "Invite gentle touch on safer body areas", "End before either child or pet becomes overexcited"] },
      { heading: "Supervise actively", body: "Being in the same room is not enough; an adult must be ready to intervene.", bullets: ["Separate during busy moments", "Watch for stress or guarding", "Model respectful interaction every time"] },
    ],
    checklist: ["Safe space protected", "Rules explained", "Adult positioned nearby", "Interaction kept short", "Pet can leave freely"],
    safetyNote: "Never leave a young child and animal together without active adult supervision, regardless of the pet’s history.",
  }),
  resource({
    id: "introducing-pets-to-each-other",
    title: "Introducing Pets to Each Other",
    description: "Use gradual scent, space, and supervised-contact techniques for safer introductions.",
    category: "Adoption Support",
    minutes: 10,
    icon: "paw",
    tags: ["multi-pet", "introduction", "barrier", "scent"],
    introduction: "Successful introductions often happen in stages, with separate resources and enough distance to prevent conflict.",
    sections: [
      { heading: "Begin separately", body: "Give each pet secure resources and time to adjust without direct contact.", bullets: ["Use closed doors or sturdy barriers", "Exchange bedding or scent items", "Feed at comfortable distances on opposite sides"] },
      { heading: "Add controlled visibility", body: "Short visual sessions help you observe comfort before closer contact.", bullets: ["Use gates, leads, or cracked doors safely", "Reward calm disengagement", "Stop when tension rises"] },
      { heading: "Supervise shared time", body: "Increase freedom only after repeated relaxed sessions.", bullets: ["Remove high-value conflict items", "Provide multiple escape routes and resources", "Separate whenever nobody can supervise"] },
    ],
    checklist: ["Separate areas ready", "Resources duplicated", "Barrier secure", "Body language monitored", "Backup separation plan ready"],
    safetyNote: "Do not place hands between fighting animals. Use barriers and seek professional help after serious conflict.",
  }),
  resource({
    id: "responsible-rehoming-guide",
    title: "Responsible Rehoming Guide",
    description: "Learn how to rehome a pet responsibly while protecting the animal’s welfare.",
    category: "Adoption Support",
    minutes: 11,
    icon: "handover",
    featured: true,
    tags: ["rehoming", "screening", "handover", "welfare"],
    introduction: "Responsible rehoming centers the animal’s safety, honest information, careful screening, and a supported handover.",
    sections: [
      { heading: "Explore safe alternatives", body: "Urgent pressure can hide options that keep a pet safely with their family.", bullets: ["Discuss medical or behavior needs with qualified professionals", "Ask trusted welfare groups about temporary support", "Never abandon or give away a pet without screening"] },
      { heading: "Create an honest profile", body: "Accurate health and behavior information helps prevent failed placements.", bullets: ["Share records and known needs", "Describe routines, preferences, and challenges", "Use recent photos and a clear location area"] },
      { heading: "Screen and support the handover", body: "A careful match matters more than speed.", bullets: ["Ask about household, budget, and care plans", "Meet safely and verify identity", "Use a written agreement and follow-up plan"] },
    ],
    checklist: ["Alternatives considered", "Records prepared", "Profile honest", "Adopter screened", "Agreement completed", "Follow-up planned"],
    safetyNote: "Avoid unverified buyers, breeding arrangements, pressure tactics, and meetings that put people or animals at risk.",
  }),
];

export const petCareFaqs = [
  ["How soon should I take a newly adopted pet to a veterinarian?", "Arrange a check soon after adoption, especially when records are incomplete or health needs are known. Ask a clinic how quickly your pet should be seen based on age, species, symptoms, and vaccination history."],
  ["What should I prepare before bringing a pet home?", "Prepare species-appropriate food, bowls, identification, a secure carrier or leash, toileting supplies, a quiet resting area, safe enrichment, cleaning supplies, records, and veterinary contacts."],
  ["How long does it take for a pet to adjust?", "Adjustment may take days, weeks, or longer. Look for growing comfort with eating, resting, exploring, play, and voluntary interaction instead of expecting a fixed deadline."],
  ["What should I do if my pet refuses to eat?", "Reduce stress, confirm the food is familiar and accessible, and monitor drinking and other symptoms. Young, small, medically vulnerable pets—or any pet with prolonged appetite loss—need prompt veterinary advice."],
  ["How can I introduce two pets safely?", "Begin with separation, scent exchange, secure barriers, and short sessions at a comfortable distance. Provide separate resources and do not leave them together unsupervised until repeated interactions are relaxed."],
  ["Should I punish unwanted behavior?", "No. Punishment can increase fear and suppress warning signals. Prevent rehearsal, redirect safely, reward the behavior you want, and seek qualified help for serious concerns."],
  ["How often should pets be groomed?", "Frequency depends on species, coat, age, lifestyle, and health. A veterinarian or experienced groomer can help create a safe routine for brushing, nails, bathing, ears, and dental care."],
  ["How do I know when a situation is an emergency?", "Difficulty breathing, collapse, seizures, heavy bleeding, severe injury or pain, suspected poisoning, inability to urinate, or sudden abdominal swelling require immediate veterinary contact."],
  ["Can I change my pet’s food immediately?", "Unless a veterinarian directs otherwise, transition gradually over several days while monitoring appetite, stool, vomiting, skin, and comfort."],
  ["Where should I keep pet health records?", "Keep paper copies in an accessible folder and secure digital copies you can reach from your phone. Include vaccination, medication, allergy, clinic, identification, and emergency information."],
] as const;

export function getPetCareResource(slug: string) {
  return petCareResources.find((item) => item.id === slug);
}

export function getRelatedResources(resourceItem: PetCareResource) {
  return petCareResources
    .filter(
      (item) =>
        item.id !== resourceItem.id &&
        (item.category === resourceItem.category ||
          item.tags.some((tag) => resourceItem.tags.includes(tag))),
    )
    .slice(0, 3);
}
