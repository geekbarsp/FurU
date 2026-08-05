"use client";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { signOut, useAccount } from "@/lib/furu-store";
import { useFeedback } from "./FeedbackProvider";
import logo4k from "../../public/images/logo-4k-transparent.png";
const links = [
  ["/", "Home"],
  ["/browse", "Adopt"],
  ["/listings/new", "Rehome a pet"],
  ["/resources", "Pet Care"],
  ["/download", "Download"],
];
export default function Header() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const account = useAccount();
  const { notify } = useFeedback();
  function leave() {
    signOut();
    setAccountOpen(false);
    setOpen(false);
    notify("You’re signed out.", "info");
  }
  const first = account?.name.split(" ")[0];
  return (
    <header className="header">
      <nav className="nav shell" aria-label="Main navigation">
        <Link href="/" className="logo brand-logo" aria-label="FurU home">
          <Image
            src={logo4k}
            alt="FurU"
            fill
            priority
            quality={85}
            sizes="120px"
          />
        </Link>
        <div className="nav-links">
          {links.map(([href, label]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </div>
        <div className="nav-actions">
          {account ? (
            <div className="account-wrap">
              <Link
                className="btn btn-primary btn-small dashboard-link"
                href="/listings/new"
              >
                <PlusCircle size={16} /> Rehome a pet
              </Link>
              <button
                className="account-button"
                onClick={() => setAccountOpen(!accountOpen)}
                aria-label="Open account menu"
                aria-expanded={accountOpen}
              >
                <UserRound size={18} />
                <span>{first}</span>
              </button>
              {accountOpen && (
                <div className="account-menu">
                  <div className="account-summary">
                    <span className="account-avatar">
                      {account.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <b>{account.name}</b>
                      <small>{account.purpose}</small>
                    </div>
                  </div>
                  <Link href="/dashboard" onClick={() => setAccountOpen(false)}>
                    <LayoutDashboard size={16} /> My dashboard
                  </Link>
                  <Link
                    href="/listings/new"
                    onClick={() => setAccountOpen(false)}
                  >
                    <PlusCircle size={16} /> Rehome a pet
                  </Link>
                  <button onClick={leave}>
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link className="btn btn-ghost btn-small" href="/sign-in">
                Sign in
              </Link>
              <Link className="btn btn-primary btn-small" href="/sign-up">
                Create account
              </Link>
            </>
          )}
          <button
            className="icon-btn mobile-menu"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <div className="menu-panel">
            {links.map(([href, label]) => (
              <Link onClick={() => setOpen(false)} key={href} href={href}>
                {label}
              </Link>
            ))}
            {account ? (
              <>
                <Link onClick={() => setOpen(false)} href="/dashboard">
                  My dashboard
                </Link>
                <button className="mobile-signout" onClick={leave}>
                  Sign out
                </button>
              </>
            ) : (
              <Link onClick={() => setOpen(false)} href="/sign-in">
                Sign in
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
