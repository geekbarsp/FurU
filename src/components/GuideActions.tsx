"use client";

import { Check, Printer, Share2 } from "lucide-react";
import { useState } from "react";

export default function GuideActions({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // A cancelled native share should fall back to a copy action.
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="guide-actions">
      <button className="btn btn-ghost btn-small" type="button" onClick={share}>
        {copied ? <Check /> : <Share2 />}
        {copied ? "Link copied" : "Share guide"}
      </button>
      <button className="btn btn-ghost btn-small" type="button" onClick={() => window.print()}>
        <Printer /> Print
      </button>
    </div>
  );
}
