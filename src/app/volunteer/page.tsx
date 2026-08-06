import type { Metadata } from "next";
import VolunteerClient from "@/components/VolunteerClient";

export const metadata: Metadata = {
  title: "Volunteer",
  description: "Offer transport, fostering, or event support to verified animal welfare organizations.",
};

export default function VolunteerPage() {
  return <VolunteerClient />;
}
