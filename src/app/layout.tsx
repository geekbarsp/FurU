import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FeedbackProvider } from "@/components/FeedbackProvider";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://fur-u.vercel.app",
  ),
  title: {
    default: "FurU — Rehome with care",
    template: "%s · FurU",
  },
  description:
    "Create a thoughtful pet listing, review adopters, and support a safe handover with FurU.",
  icons: {
    icon: "/images/logo-4k-transparent.png",
    shortcut: "/images/logo-4k-transparent.png",
    apple: "/images/logo-4k-transparent.png",
  },
  openGraph: {
    title: "FurU — Rehome with care",
    description:
      "Create a thoughtful pet listing, review adopters, and support a safe handover with FurU.",
    type: "website",
    images: [
      {
        url: "/images/logo-4k-transparent.png",
        width: 3840,
        height: 1648,
        alt: "FurU",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FurU — Rehome with care",
    description:
      "Create a thoughtful pet listing, review adopters, and support a safe handover with FurU.",
    images: ["/images/logo-4k-transparent.png"],
  },
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><FeedbackProvider><Header/>{children}<Footer/></FeedbackProvider></body></html>}
