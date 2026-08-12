"use client";

import Script from "next/script";
import { ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const developmentSiteKey = "1x00000000000000000000AA";
const configuredSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const siteKey =
  configuredSiteKey ||
  (process.env.NODE_ENV === "development" ? developmentSiteKey : "");

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      theme: "light";
      size: "flexible";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function HumanCheck({
  onChange,
}: {
  onChange: (token: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [challengeError, setChallengeError] = useState(false);

  const renderChallenge = useCallback(() => {
    if (!siteKey || !containerRef.current || !window.turnstile) return;
    if (widgetIdRef.current !== null) return;

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "light",
      size: "flexible",
      callback: (token) => {
        setChallengeError(false);
        onChange(token);
      },
      "expired-callback": () => onChange(""),
      "error-callback": () => {
        setChallengeError(true);
        onChange("");
      },
    });
  }, [onChange]);

  useEffect(() => {
    if (scriptReady) renderChallenge();
    return () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [renderChallenge, scriptReady]);

  if (!siteKey) {
    return (
      <div className="human-check human-check-error" role="alert">
        CAPTCHA is not configured. Add a Turnstile site key to continue.
      </div>
    );
  }

  return (
    <div className="human-check">
      <div className="human-check-label">
        <ShieldCheck size={17} aria-hidden="true" />
        <span>Are you human?</span>
      </div>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() => setChallengeError(true)}
      />
      <div ref={containerRef} className="turnstile-container" />
      {challengeError && (
        <small role="alert">
          The human check could not load. Refresh the page and try again.
        </small>
      )}
    </div>
  );
}
