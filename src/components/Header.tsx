"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  UserRound,
  X,
} from "lucide-react";
import { type MouseEvent, useState } from "react";
import { signOut, useAccount } from "@/lib/furu-store";
import { useFeedback } from "./FeedbackProvider";
import logo4k from "../../public/images/logo-4k-transparent.png";
const links = [
  ["/", "Home"],
  ["/browse", "Adopt"],
  ["/listings/new", "Rehome a pet"],
  ["/pet-care", "Pet Care"],
  ["/download", "Download"],
];
export default function Header() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const account = useAccount();
  const { notify } = useFeedback();
  const canAdopt = account?.roles.includes("adopter") ?? false;
  const canRehome =
    account?.roles.includes("guardian") ||
    (account?.roles.includes("welfare_org") && account.welfareOrgVerified);
  const visibleLinks = links.filter(([href]) => {
    if (href === "/browse") return canAdopt;
    if (href === "/listings/new") return Boolean(canRehome);
    return true;
  });
  async function leave() {
    await signOut();
    setAccountOpen(false);
    setOpen(false);
    notify("You’re signed out.", "info");
  }
  function refreshActivePage(
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    if (pathname !== href) return;
    event.preventDefault();
    setOpen(false);
    router.refresh();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  const first = account?.name.split(" ")[0];
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
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
          {visibleLinks.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={isActive(href) ? "active" : undefined}
              aria-current={isActive(href) ? "page" : undefined}
              onClick={(event) => refreshActivePage(event, href)}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="nav-actions">
          {account ? (
            <div className="account-wrap">
              {canRehome && (
                <Link
                  className="btn btn-primary btn-small dashboard-link"
                  href="/listings/new"
                >
                  <PlusCircle size={16} /> Rehome a pet
                </Link>
              )}
              <button
                className="account-button"
                onClick={() => setAccountOpen(!accountOpen)}
                aria-label="Open account menu"
                aria-expanded={accountOpen}
              >
                {account.avatar ? (
                  <span
                    className="account-button-avatar"
                    style={{ backgroundImage: `url(${account.avatar})` }}
                  />
                ) : (
                  <UserRound size={18} />
                )}
                <span>{first}</span>
              </button>
              {accountOpen && (
                <div className="account-menu">
                  <div className="account-summary">
                    <span
                      className="account-avatar"
                      style={
                        account.avatar
                          ? { backgroundImage: `url(${account.avatar})` }
                          : undefined
                      }
                    >
                      {!account.avatar && account.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <b>{account.name}</b>
                      <small>
                        {account.roles.includes("welfare_org")
                          ? account.welfareOrgVerified
                            ? "Verified welfare organization"
                            : "Welfare verification pending"
                          : account.roles.join(" + ")}
                      </small>
                    </div>
                  </div>
                  <Link href="/dashboard" onClick={() => setAccountOpen(false)}>
                    <LayoutDashboard size={16} /> My dashboard
                  </Link>
                  <Link href="/profile" onClick={() => setAccountOpen(false)}>
                    <UserRound size={16} /> My profile
                  </Link>
                  {canRehome && (
                    <Link
                      href="/listings/new"
                      onClick={() => setAccountOpen(false)}
                    >
                      <PlusCircle size={16} /> Rehome a pet
                    </Link>
                  )}
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
            {visibleLinks.map(([href, label]) => (
              <Link
                onClick={(event) => {
                  setOpen(false);
                  refreshActivePage(event, href);
                }}
                key={href}
                href={href}
                className={isActive(href) ? "active" : undefined}
                aria-current={isActive(href) ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
            {account ? (
              <>
                <Link onClick={() => setOpen(false)} href="/dashboard">
                  My dashboard
                </Link>
                <Link onClick={() => setOpen(false)} href="/profile">
                  My profile
                </Link>
                <button className="mobile-signout" onClick={leave}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link onClick={() => setOpen(false)} href="/sign-in">
                  Sign in
                </Link>
                <Link onClick={() => setOpen(false)} href="/sign-up">
                  Create account
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
