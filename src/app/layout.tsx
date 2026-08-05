import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FeedbackProvider } from "@/components/FeedbackProvider";

export const metadata: Metadata = { title: { default:"FurU — Rehome with care", template:"%s · FurU" }, description:"Create a thoughtful pet listing, review adopters, and support a safe handover with FurU." };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><FeedbackProvider><Header/>{children}<Footer/></FeedbackProvider></body></html>}
