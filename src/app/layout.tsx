import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FeedbackProvider } from "@/components/FeedbackProvider";

export const metadata: Metadata = { title: { default:"FurU — A new home. A new beginning.", template:"%s · FurU" }, description:"A safer, kinder way to adopt and responsibly rehome pets across the Philippines." };

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body><FeedbackProvider><Header/>{children}<Footer/></FeedbackProvider></body></html>;
}
