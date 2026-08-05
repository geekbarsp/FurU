"use client";
import { useSyncExternalStore } from "react";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";

export type Account = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  purpose: "Rehome a pet" | "Adopt a pet" | "Both";
  roles: ("guardian" | "adopter" | "welfare_org")[];
  welfareOrgVerified: boolean;
  organizationName?: string;
  createdAt: string;
  avatar?: string;
  bio?: string;
};
export type CreateAccountInput = Omit<
  Account,
  | "id"
  | "createdAt"
  | "avatar"
  | "bio"
  | "roles"
  | "welfareOrgVerified"
> & {
  password: string;
  accountRole: "guardian" | "adopter" | "guardian_adopter" | "welfare_org";
};
export type UserListing = {
  id: string;
  ownerEmail: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  location: string;
  reason: string;
  status: "Published" | "Paused" | "Rehomed";
  createdAt: string;
  details?: Record<string, string>;
};
export type ProfileReview = {
  id: string;
  name: string;
  rating: number;
  date: string;
  details: string;
  accuracy: number;
  communication: number;
  care: number;
  handover: number;
};
export type AdoptionStatus =
  "Under review" | "Monitoring" | "Completed" | "Declined" | "Withdrawn";
export type AdoptionApplication = {
  id: string;
  userEmail: string;
  petId: string;
  petName: string;
  status: AdoptionStatus;
  submittedAt: string;
};
type StoreState = {
  account: Account | null;
  listings: UserListing[];
  applications: AdoptionApplication[];
  ready: boolean;
};
const initialState: StoreState = {
  account: null,
  listings: [],
  applications: [],
  ready: false,
};
let state = initialState;
let initialized = false;
const listeners = new Set<() => void>();
const KEYS = {
  accounts: "furu-accounts",
  session: "furu-session",
  listings: "furu-listings",
  applications: "furu-applications",
};
const prototypeFallbackEnabled =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_ENABLE_LOCAL_AUTH === "true";
const emit = (next: StoreState) => {
  state = next;
  listeners.forEach((listener) => listener());
  window.dispatchEvent(new Event("furu-store"));
};
const read = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    return JSON.parse(localStorage.getItem(key) || "") as T;
  } catch {
    return fallback;
  }
};
const mapListing = (
  row: Record<string, unknown>,
  email: string,
): UserListing => ({
  id: String(row.id),
  ownerEmail: email,
  name: String(row.name),
  type: String(row.animal_type),
  breed: String(row.breed),
  age: String(row.age),
  location: String(row.location),
  reason: String(row.reason),
  status: row.status as UserListing["status"],
  createdAt: String(row.created_at),
  details: (row.details || {}) as Record<string, string>,
});
const mapApplication = (
  row: Record<string, unknown>,
  email: string,
): AdoptionApplication => ({
  id: String(row.id),
  userEmail: email,
  petId: String(row.pet_key),
  petName: String(row.pet_name),
  status: row.status as AdoptionStatus,
  submittedAt: String(row.submitted_at),
});

async function reload() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    if (!prototypeFallbackEnabled) {
      emit({ ...initialState, ready: true });
      return;
    }
    const email = localStorage.getItem(KEYS.session) || "";
    const legacy =
      read<(Account & { password?: string })[]>(KEYS.accounts, []).find(
        (a) => a.email === email,
      ) || null;
    emit({
      account: legacy
        ? {
            ...legacy,
            id: legacy.id || email,
            roles:
              legacy.roles ||
              (legacy.purpose === "Rehome a pet"
                ? ["guardian"]
                : legacy.purpose === "Adopt a pet"
                  ? ["adopter"]
                  : ["guardian", "adopter"]),
            welfareOrgVerified: legacy.welfareOrgVerified || false,
          }
        : null,
      listings: read<UserListing[]>(KEYS.listings, []).map((x) =>
        (x.status as string) === "Under review"
          ? { ...x, status: "Published" }
          : x,
      ),
      applications: read<AdoptionApplication[]>(KEYS.applications, []),
      ready: true,
    });
    return;
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    emit({ ...initialState, ready: true });
    return;
  }
  const [{ data: profile }, { data: listings }, { data: applications }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      supabase
        .from("pet_listings")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("adoption_applications")
        .select("*")
        .eq("applicant_id", user.id)
        .order("submitted_at", { ascending: false }),
    ]);
  const metadata = user.user_metadata || {};
  const account: Account = {
    id: user.id,
    name: String(profile?.username || metadata.username || "FurU user"),
    email: user.email || "",
    phone: String(profile?.phone || metadata.phone || ""),
    location: String(profile?.location || metadata.location || ""),
    purpose: (profile?.purpose ||
      metadata.purpose ||
      "Both") as Account["purpose"],
    roles: (profile?.roles || metadata.roles || ["adopter"]) as Account["roles"],
    welfareOrgVerified: Boolean(profile?.welfare_org_verified),
    organizationName:
      profile?.organization_name || metadata.organization_name || undefined,
    createdAt: String(profile?.created_at || user.created_at),
    avatar: profile?.avatar_url || undefined,
    bio: profile?.bio || undefined,
  };
  emit({
    account,
    listings: (listings || []).map((row) => mapListing(row, account.email)),
    applications: (applications || []).map((row) =>
      mapApplication(row, account.email),
    ),
    ready: true,
  });
}
async function initialize() {
  if (initialized) return;
  initialized = true;
  await reload();
  const supabase = getSupabaseBrowserClient();
  supabase?.auth.onAuthStateChange(() => {
    void reload();
  });
}
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  void initialize();
  return () => listeners.delete(listener);
};
const getSnapshot = () => state;
const getServerSnapshot = () => initialState;
export function useAccount() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
    .account;
}
export function useListings() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
    .listings;
}
export function useApplications() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
    .applications;
}
export function isUsingSupabase() {
  return isSupabaseConfigured;
}

export async function createAccount(input: CreateAccountInput) {
  const username = input.name.trim();
  if (username.length < 4 || username.length > 15)
    throw new Error("Username must be 4–15 characters.");
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        data: {
          username,
          phone: input.phone,
          location: input.location,
          purpose: input.purpose,
          account_role: input.accountRole,
          organization_name: input.organizationName || "",
        },
      },
    });
    if (error) throw error;
    if (data.session) await reload();
    return { needsEmailConfirmation: !data.session };
  }
  if (!prototypeFallbackEnabled)
    throw new Error("Supabase is not configured for authentication.");
  const accounts = read<(Account & { password: string })[]>(KEYS.accounts, []);
  if (accounts.some((a) => a.email.toLowerCase() === input.email.toLowerCase()))
    throw new Error("An account with this email already exists.");
  const account = {
    ...input,
    id: crypto.randomUUID(),
    name: username,
    roles:
      input.accountRole === "guardian_adopter"
        ? (["guardian", "adopter"] as Account["roles"])
        : ([input.accountRole] as Account["roles"]),
    welfareOrgVerified: false,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(KEYS.accounts, JSON.stringify([...accounts, account]));
  localStorage.setItem(KEYS.session, input.email);
  await reload();
  return { needsEmailConfirmation: false };
}
export async function signIn(email: string, password: string) {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return false;
    await reload();
    return true;
  }
  if (!prototypeFallbackEnabled) return false;
  const account = read<(Account & { password: string })[]>(
    KEYS.accounts,
    [],
  ).find(
    (a) =>
      a.email.toLowerCase() === email.toLowerCase() && a.password === password,
  );
  if (!account) return false;
  localStorage.setItem(KEYS.session, account.email);
  await reload();
  return true;
}

export async function sendEmailOtp(email: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
    },
  });
  if (error) throw error;
}

export async function verifyEmailOtp(email: string, token: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.auth.verifyOtp({
    email: email.trim().toLowerCase(),
    token: token.trim(),
    type: "email",
  });
  if (error) throw error;
  await reload();
}

export async function requestPasswordReset(email: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.auth.resetPasswordForEmail(
    email.trim().toLowerCase(),
    { redirectTo: `${window.location.origin}/auth/callback?next=/update-password` },
  );
  if (error) throw error;
}

export async function updatePassword(password: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}
export async function signOut() {
  const supabase = getSupabaseBrowserClient();
  if (supabase) await supabase.auth.signOut();
  else localStorage.removeItem(KEYS.session);
  emit({ ...initialState, ready: true });
}
export async function updateAccount(
  email: string,
  changes: Partial<
    Pick<Account, "name" | "phone" | "location" | "purpose" | "avatar" | "bio">
  >,
) {
  if (
    changes.name !== undefined &&
    (changes.name.trim().length < 4 || changes.name.trim().length > 15)
  )
    throw new Error("Username must be 4–15 characters.");
  const supabase = getSupabaseBrowserClient();
  if (supabase && state.account) {
    const payload: Record<string, unknown> = {};
    if (changes.name !== undefined) payload.username = changes.name.trim();
    if (changes.phone !== undefined) payload.phone = changes.phone;
    if (changes.location !== undefined) payload.location = changes.location;
    if (changes.purpose !== undefined) payload.purpose = changes.purpose;
    if (changes.avatar !== undefined) payload.avatar_url = changes.avatar;
    if (changes.bio !== undefined) payload.bio = changes.bio;
    const { error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", state.account.id);
    if (error) throw error;
    await reload();
    return;
  }
  if (!prototypeFallbackEnabled)
    throw new Error("Supabase is not configured.");
  const accounts = read<Account[]>(KEYS.accounts, []);
  localStorage.setItem(
    KEYS.accounts,
    JSON.stringify(
      accounts.map((account) =>
        account.email === email ? { ...account, ...changes } : account,
      ),
    ),
  );
  await reload();
}
export async function updateAvatar(dataUrl: string) {
  if (!state.account) throw new Error("Sign in before uploading an avatar.");
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    await updateAccount(state.account.email, { avatar: dataUrl });
    return;
  }
  const blob = await (await fetch(dataUrl)).blob();
  const path = `${state.account.id}/avatar.jpg`;
  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, blob, { contentType: "image/jpeg", upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  await updateAccount(state.account.email, {
    avatar: `${data.publicUrl}?v=${Date.now()}`,
  });
}
export function getListings(email?: string) {
  return email
    ? state.listings.filter((x) => x.ownerEmail === email)
    : state.listings;
}
export async function addListing(listing: UserListing) {
  const supabase = getSupabaseBrowserClient();
  if (supabase && state.account) {
    const response = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: listing.name,
        type: listing.type,
        breed: listing.breed,
        age: listing.age,
        location: listing.location,
        reason: listing.reason,
        details: listing.details || {},
      }),
    });
    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      throw new Error(result?.error || "Unable to create the listing.");
    }
    await reload();
    return;
  }
  if (!prototypeFallbackEnabled)
    throw new Error("Sign in before creating a listing.");
  localStorage.setItem(
    KEYS.listings,
    JSON.stringify([listing, ...read<UserListing[]>(KEYS.listings, [])]),
  );
  await reload();
}
export function getApplications(email?: string) {
  return email
    ? state.applications.filter((x) => x.userEmail === email)
    : state.applications;
}
export async function addApplication(application: AdoptionApplication) {
  const supabase = getSupabaseBrowserClient();
  if (supabase && state.account) {
    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ petId: application.petId, answers: {} }),
    });
    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      throw new Error(result?.error || "Unable to submit this application.");
    }
    await reload();
    return;
  }
  if (!prototypeFallbackEnabled)
    throw new Error("Sign in before submitting an application.");
  localStorage.setItem(
    KEYS.applications,
    JSON.stringify([
      application,
      ...read<AdoptionApplication[]>(KEYS.applications, []),
    ]),
  );
  await reload();
}
export function getAdoptionLock(email: string) {
  const active = getApplications(email).find(
    (a) => a.status === "Under review" || a.status === "Monitoring",
  );
  if (!active) return null;
  return {
    application: active,
    message:
      active.status === "Monitoring"
        ? `You are currently in the post-adoption monitoring period for ${active.petName}. You can apply again after monitoring is completed.`
        : `Your application for ${active.petName} is under review. You can submit another application once a decision is made.`,
  };
}

export async function getFavoritePetKeys() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return Object.keys(localStorage)
      .filter(
        (key) => key.startsWith("fav-") && localStorage.getItem(key) === "1",
      )
      .map((key) => key.slice(4));
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("favorites")
    .select("pet_key")
    .eq("user_id", user.id);
  if (error) throw error;
  return (data || []).map((row) => row.pet_key);
}

export async function setFavorite(petKey: string, favorite: boolean) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    localStorage.setItem(`fav-${petKey}`, favorite ? "1" : "0");
    window.dispatchEvent(new Event("furu-favorites"));
    return;
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in to save pets to your favorites.");
  const query = favorite
    ? supabase.from("favorites").upsert({ user_id: user.id, pet_key: petKey })
    : supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("pet_key", petKey);
  const { error } = await query;
  if (error) throw error;
  window.dispatchEvent(new Event("furu-favorites"));
}

export async function getProfileReviews(
  profileId: string,
): Promise<ProfileReview[]> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return read<ProfileReview[]>(`furu-reviews-${profileId}`, []);
  }
  const { data, error } = await supabase
    .from("reviews")
    .select(
      "id,reviewer_id,rating,review,accuracy,communication,care,handover,created_at",
    )
    .eq("pet_key", profileId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (data || []).map((row) => ({
    id: row.id,
    name:
      row.reviewer_id === user?.id && state.account
        ? state.account.name
        : "FurU member",
    rating: Number(row.rating),
    date: new Date(row.created_at).toLocaleDateString("en-PH", {
      month: "long",
      year: "numeric",
    }),
    details: row.review,
    accuracy: row.accuracy,
    communication: row.communication,
    care: row.care,
    handover: row.handover,
  }));
}

export async function addProfileReview(
  profileId: string,
  rating: number,
  details: string,
) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    const review: ProfileReview = {
      id: crypto.randomUUID(),
      name: state.account?.name || "FurU member",
      rating,
      date: "Just now",
      details,
      accuracy: rating,
      communication: rating,
      care: rating,
      handover: rating,
    };
    localStorage.setItem(
      `furu-reviews-${profileId}`,
      JSON.stringify([
        review,
        ...read<ProfileReview[]>(`furu-reviews-${profileId}`, []),
      ]),
    );
    return review;
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in before posting a review.");
  const { error } = await supabase.from("reviews").insert({
    reviewer_id: user.id,
    pet_key: profileId,
    rating,
    review: details,
    accuracy: rating,
    communication: rating,
    care: rating,
    handover: rating,
  });
  if (error) throw error;
}

export async function addReport(
  petKey: string,
  reason: string,
  details: string,
) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in before reporting a listing.");
  const { error } = await supabase
    .from("reports")
    .insert({ reporter_id: user.id, pet_key: petKey, reason, details });
  if (error) throw error;
}
