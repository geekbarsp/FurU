import Link from "next/link";
import { Heart } from "lucide-react";
export default function Footer(){return <footer className="footer"><div className="shell"><div className="footer-grid">
  <div><Link href="/" className="logo"><span className="logo-mark"><Heart size={19} fill="currentColor"/></span>FurU</Link><p>A safer, kinder path from waiting<br/>to welcome home.</p></div>
  <div className="footer-col"><b>Adopt</b><Link href="/browse">Browse pets</Link><Link href="/application/luna">How to adopt</Link><Link href="/resources">Pet care</Link></div>
  <div className="footer-col"><b>Community</b><Link href="/volunteer">Volunteer</Link><Link href="/donations">Donate</Link><Link href="/lost-and-found">Lost & found</Link></div>
  <div className="footer-col"><b>FurU</b><Link href="/help">Help center</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
  </div><div className="footer-bottom"><span>© 2026 FurU. Made for second chances.</span><span>English · Philippines</span></div></div></footer>}
