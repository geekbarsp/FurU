"use client";
import Link from "next/link";
import { Heart,LayoutDashboard,LogOut,Menu,UserRound,X } from "lucide-react";
import { useState,useSyncExternalStore } from "react";
import { useFeedback } from "./FeedbackProvider";

const links=[["/browse","Find a pet"],["/#how-it-works","How it works"],["/resources","Resources"],["/volunteer","Get involved"]];
const subscribe=(callback:()=>void)=>{window.addEventListener("storage",callback);window.addEventListener("furu-auth",callback);return()=>{window.removeEventListener("storage",callback);window.removeEventListener("furu-auth",callback)}};
const getSnapshot=()=>localStorage.getItem("furu-session")==="demo";
const getServerSnapshot=()=>false;

export default function Header(){
 const [open,setOpen]=useState(false);const [accountOpen,setAccountOpen]=useState(false);const signedIn=useSyncExternalStore(subscribe,getSnapshot,getServerSnapshot);const {notify}=useFeedback();
 function signOut(){localStorage.removeItem("furu-session");window.dispatchEvent(new Event("furu-auth"));setAccountOpen(false);setOpen(false);notify("You’re signed out. Come back whenever you’re ready.","info")}
 return <header className="header"><nav className="nav shell" aria-label="Main navigation">
  <Link href="/" className="logo"><span className="logo-mark"><Heart size={19} fill="currentColor"/></span>FurU</Link>
  <div className="nav-links">{links.map(([href,label])=><Link key={href} href={href}>{label}</Link>)}</div>
  <div className="nav-actions">{signedIn?<div className="account-wrap"><Link className="btn btn-ghost btn-small dashboard-link" href="/dashboard"><LayoutDashboard size={16}/> Dashboard</Link><button className="account-button" onClick={()=>setAccountOpen(!accountOpen)} aria-label="Open account menu" aria-expanded={accountOpen}><UserRound size={18}/><span>Sam</span></button>{accountOpen&&<div className="account-menu"><div className="account-summary"><span className="account-avatar">S</span><div><b>Sam Rivera</b><small>Demo adopter</small></div></div><Link href="/dashboard" onClick={()=>setAccountOpen(false)}><LayoutDashboard size={16}/> My dashboard</Link><button onClick={signOut}><LogOut size={16}/> Sign out</button></div>}</div>:<><Link className="btn btn-ghost btn-small" href="/sign-in">Sign in</Link><Link className="btn btn-primary btn-small" href="/sign-up">Join FurU</Link></>}<button className="icon-btn mobile-menu" onClick={()=>setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>{open?<X/>:<Menu/>}</button></div>
  {open&&<div className="menu-panel">{links.map(([href,label])=><Link onClick={()=>setOpen(false)} key={href} href={href}>{label}</Link>)}{signedIn?<><Link onClick={()=>setOpen(false)} href="/dashboard">My dashboard</Link><button className="mobile-signout" onClick={signOut}>Sign out</button></>:<Link onClick={()=>setOpen(false)} href="/sign-in">Sign in</Link>}</div>}
 </nav></header>
}
