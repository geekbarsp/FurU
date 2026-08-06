import type { Metadata } from "next";
import DonationsClient from "@/components/DonationsClient";

export const metadata: Metadata = {
  title: "Donate to verified rescues",
  description: "Support verified Philippine animal welfare organizations and see transparent impact reporting.",
};

export default function DonationsPage() {
  return <DonationsClient />;
}
