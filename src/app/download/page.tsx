"use client";
import Image from "next/image";
import {
  Apple,
  CheckCircle2,
  Download,
  Monitor,
  ShieldCheck,
  Smartphone,
  XCircle,
} from "lucide-react";
import { useFeedback } from "@/components/FeedbackProvider";

const platforms = [
  {
    name: "Android",
    detail: "Android 10 or newer · Phone and tablet",
    icon: Smartphone,
    available: true,
    label: "Get Android app",
  },
  {
    name: "iOS",
    detail: "iOS 16 or newer · iPhone and iPad",
    icon: Apple,
    available: true,
    label: "Get iOS app",
  },
  {
    name: "Windows",
    detail: "Windows 10 or newer · 64-bit",
    icon: Monitor,
    available: true,
    label: "Download for Windows",
  },
  {
    name: "macOS",
    detail: "macOS 13 Ventura or newer · Apple silicon and Intel",
    icon: Apple,
    available: true,
    label: "Download for Mac",
  },
  {
    name: "Linux",
    detail: "Ubuntu, Fedora, and other distributions",
    icon: Monitor,
    available: false,
    label: "Not supported",
  },
];
export default function DownloadPage() {
  const { notify } = useFeedback();
  return (
    <main className="page download-page">
      <div className="shell">
        <section className="download-hero">
          <div>
            <span className="eyebrow">FurU everywhere</span>
            <h1>Care doesn’t stop when you leave the browser.</h1>
            <p>
              Keep up with applicants, conversations, handovers, and monitoring
              from the FurU app. Your workspace stays synced across supported
              devices.
            </p>
            <div className="download-badges">
              <span>
                <ShieldCheck /> Secure account access
              </span>
              <span>
                <CheckCircle2 /> Free to download
              </span>
            </div>
          </div>
          <div className="app-preview webapp-preview">
            <Image
              src="/images/webapp.png"
              alt="FurU dashboard on desktop and mobile"
              fill
              priority
              quality={90}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
        </section>
        <section className="download-section">
          <div className="section-head">
            <div>
              <span className="eyebrow">Choose your device</span>
              <h2>Download FurU.</h2>
            </div>
            <p>
              Desktop apps are available for Windows and macOS. Mobile apps
              support Android and iOS. Linux is not currently supported.
            </p>
          </div>
          <div className="platform-grid">
            {platforms.map(({ name, detail, icon: Icon, available, label }) => (
              <article
                className={`platform-card ${!available ? "unsupported" : ""}`}
                key={name}
              >
                <span className="platform-icon">
                  <Icon />
                </span>
                <div>
                  <h3>{name}</h3>
                  <p>{detail}</p>
                </div>
                {available ? (
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      notify(
                        `${name} installer is not bundled with this web preview yet.`,
                        "info",
                      )
                    }
                  >
                    <Download size={17} />
                    {label}
                  </button>
                ) : (
                  <button className="btn btn-ghost" disabled>
                    <XCircle size={17} />
                    {label}
                  </button>
                )}
              </article>
            ))}
          </div>
          <p className="release-note">
            The download controls are prepared for production release files and
            app-store links. This web prototype does not bundle native
            installers.
          </p>
        </section>
        <section className="download-info">
          <div>
            <span className="eyebrow">One calm workspace</span>
            <h2>Take every next step with you.</h2>
          </div>
          <div className="download-features">
            <article>
              <b>Instant applicant updates</b>
              <p>
                Know when someone applies and review their full profile wherever
                you are.
              </p>
            </article>
            <article>
              <b>Monitoring reminders</b>
              <p>
                Never miss a day-2, day-7, day-14, or day-30 post-handover
                check-in.
              </p>
            </article>
            <article>
              <b>Private conversations</b>
              <p>
                Keep contact details protected until both sides are ready to
                connect safely.
              </p>
            </article>
            <article>
              <b>Cross-device sync</b>
              <p>
                Start a pet profile on desktop and continue it from your phone.
              </p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
