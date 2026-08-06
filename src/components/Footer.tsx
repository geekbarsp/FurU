import Link from "next/link";
import Image from "next/image";
import logo4k from "../../public/images/logo-4k-transparent.png";
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-grid">
          <div>
            <Link
              href="/"
              className="logo brand-logo footer-brand"
              aria-label="FurU home"
            >
              <Image src={logo4k} alt="FurU" fill sizes="150px" quality={85} />
            </Link>
            <p>
              A safer, kinder path from waiting
              <br />
              to welcome home.
            </p>
          </div>
          <div className="footer-col">
            <b>Adopt</b>
            <Link href="/browse">Browse pets</Link>
            <Link href="/application/luna">How to adopt</Link>
            <Link href="/pet-care">Pet care</Link>
            <Link href="/listings/new">Rehome a pet</Link>
          </div>
          <div className="footer-col">
            <b>Community</b>
            <Link href="/volunteer">Volunteer</Link>
            <Link href="/donations">Donate</Link>
            <Link href="/lost-and-found">Lost & found</Link>
            <Link href="/safety">Safety</Link>
          </div>
          <div className="footer-col">
            <b>FurU</b>
            <Link href="/help">Help center</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/about">About FurU</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/community-guidelines">Community guidelines</Link>
            <Link href="/download">Download apps</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} FurU. Made for second chances.</span>
          <span>English · Philippines</span>
        </div>
      </div>
    </footer>
  );
}
