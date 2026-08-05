"use client";

import { useSyncExternalStore } from "react";

export type Account = {
  name: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  purpose: "Rehome a pet" | "Adopt a pet" | "Both";
  createdAt: string;
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
  status: "Under review" | "Published" | "Rehomed";
  createdAt: string;
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

const KEYS = {
  accounts: "furu-accounts",
  session: "furu-session",
  listings: "furu-listings",
  applications: "furu-applications",
};
const empty = "";
const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener("furu-store", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("furu-store", callback);
  };
};
const sessionSnapshot = () => localStorage.getItem(KEYS.session) || empty;
const serverSnapshot = () => empty;
const read = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    return JSON.parse(localStorage.getItem(key) || "") as T;
  } catch {
    return fallback;
  }
};
const changed = () => window.dispatchEvent(new Event("furu-store"));

export function useAccount() {
  const email = useSyncExternalStore(
    subscribe,
    sessionSnapshot,
    serverSnapshot,
  );
  return (
    read<Account[]>(KEYS.accounts, []).find((a) => a.email === email) || null
  );
}
export function getAccount(email: string) {
  return (
    read<Account[]>(KEYS.accounts, []).find(
      (a) => a.email.toLowerCase() === email.toLowerCase(),
    ) || null
  );
}
export function createAccount(account: Account) {
  const accounts = read<Account[]>(KEYS.accounts, []);
  if (
    accounts.some((a) => a.email.toLowerCase() === account.email.toLowerCase())
  )
    throw new Error("An account with this email already exists.");
  localStorage.setItem(KEYS.accounts, JSON.stringify([...accounts, account]));
  localStorage.setItem(KEYS.session, account.email);
  changed();
}
export function signIn(email: string, password: string) {
  const account = getAccount(email);
  if (!account || account.password !== password) return false;
  localStorage.setItem(KEYS.session, account.email);
  changed();
  return true;
}
export function signOut() {
  localStorage.removeItem(KEYS.session);
  changed();
}
export function getListings(email?: string) {
  const all = read<UserListing[]>(KEYS.listings, []).map((x) =>
    x.status === "Under review" ? { ...x, status: "Published" as const } : x,
  );
  return email ? all.filter((x) => x.ownerEmail === email) : all;
}
export function addListing(listing: UserListing) {
  localStorage.setItem(
    KEYS.listings,
    JSON.stringify([listing, ...getListings()]),
  );
  changed();
}
export function getApplications(email?: string) {
  const all = read<AdoptionApplication[]>(KEYS.applications, []);
  return email ? all.filter((x) => x.userEmail === email) : all;
}
export function addApplication(application: AdoptionApplication) {
  localStorage.setItem(
    KEYS.applications,
    JSON.stringify([application, ...getApplications()]),
  );
  changed();
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
