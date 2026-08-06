import type { Metadata } from "next";
import HelpCenterClient from "@/components/HelpCenterClient";

export const metadata: Metadata = {
  title: "Help center",
  description: "Search FurU help articles or contact the support team.",
};

export default function HelpPage() {
  return <HelpCenterClient />;
}
