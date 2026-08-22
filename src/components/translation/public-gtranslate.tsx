import { useEffect, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";

declare global {
  interface Window {
    gtranslateSettings?: Record<string, unknown>;
  }
}

const SCRIPT_ID = "aurelia-world-gtranslate-script";
const RESET_GUARD_KEY = "aurelia-world-gtranslate-private-reset";
const TRANSLATION_CONSENT_KEY = "aurelia-world-public-translation";

/**
 * GTranslate is deliberately limited to public, non-sensitive Aurelia World pages
 * and is opt-in. It must never load on authenticated areas, account creation/sign-in,
 * safeguarding reports or contact/intake forms because rendered private/sensitive
 * content must not be exposed to an external page-translation service.
 */
const EXCLUDED_ROUTE_PREFIXES = [
  "/auth",
  "/dashboard",
  "/alumni",
  "/contact-enquiry",
  "/report-concern",
] as const;

const SENSITIVE_SELECTOR = [
  "input",
  "textarea",
  "select",
  "option",
  '[contenteditable="true"]',
  "code",
  "pre",
  "[data-notranslate]",
  'a[href^="mailto:"]',
  'a[href^="tel:"]',
  'iframe[src*="dodo" i]',
  'iframe[name*="dodo" i]',
  'iframe[title*="card" i]',
  'iframe[title*="payment" i]',
].join(",");

const SENSITIVE_TERMS = [
  "password",
  "passcode",
  "one-time-code",
  "otp",
  "api-key",
  "api_key",
  "token",
  "secret",
  "account-number",
  "account_number",
  "sort-code",
  "sort_code",
  "card-number",
  "card_number",
  "payment",
  "billing",
  "banking",
  "safeguarding",
  "concern",
] as const;

const BRAND_TERMS = new Set([
  "Aurelia",
  "Aurelia World",
  "AURELIA",
  "AURELIA WORLD",
  "Create · Learn · Achieve",
]);

function isExcludedRoute(pathname: string) {
  return EXCLUDED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function markNoTranslate(element: Element) {
  element.setAttribute("translate", "no");
  element.classList.add("notranslate");
}

function protectSensitiveNodes(root: ParentNode | Element = document) {
  const elements = new Set<Element>();

  if (root instanceof Element) elements.add(root);
  root.querySelectorAll(SENSITIVE_SELECTOR).forEach((element) => elements.add(element));
  elements.forEach((element) => {
    if (element.matches(SENSITIVE_SELECTOR)) markNoTranslate(element);
  });

  root
    .querySelectorAll<HTMLElement>("[id], [name], [autocomplete], [placeholder], [aria-label]")
    .forEach((element) => {
      const descriptor = [
        element.id,
        element.getAttribute("name"),
        element.getAttribute("autocomplete"),
        element.getAttribute("placeholder"),
        element.getAttribute("aria-label"),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (SENSITIVE_TERMS.some((term) => descriptor.includes(term))) {
        markNoTranslate(element);
      }
    });

  root
    .querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6, a, span, strong, b, small")
    .forEach((element) => {
      if (BRAND_TERMS.has((element.textContent || "").trim())) {
        markNoTranslate(element);
      }
    });
}

function hasTranslationState() {
  return (
    document.cookie.includes("googtrans=") ||
    document.documentElement.classList.contains("translated-ltr") ||
    document.documentElement.classList.contains("translated-rtl") ||
    document.body.classList.contains("translated-ltr") ||
    document.body.classList.contains("translated-rtl")
  );
}

function expireTranslationCookies() {
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`];

  for (const name of ["googtrans", "googtransopt"]) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ""} SameSite=Lax`;
    }
  }
}

function removeTranslationChrome() {
  document.getElementById(SCRIPT_ID)?.remove();
  document
    .querySelectorAll(
      ".gt_float_switcher, .gt_switcher_wrapper, iframe.goog-te-banner-frame, .goog-te-banner-frame",
    )
    .forEach((element) => element.remove());

  document.documentElement.classList.remove("translated-ltr", "translated-rtl");
  document.body.classList.remove("translated-ltr", "translated-rtl");
  document.documentElement.style.removeProperty("top");
  document.body.style.removeProperty("top");
}

export function PublicGTranslate({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const excluded = isExcludedRoute(pathname);
  const [translationEnabled, setTranslationEnabled] = useState(false);
  const [preferenceLoaded, setPreferenceLoaded] = useState(false);

  useEffect(() => {
    if (excluded) {
      setTranslationEnabled(false);
      setPreferenceLoaded(true);
      return;
    }

    setTranslationEnabled(localStorage.getItem(TRANSLATION_CONSENT_KEY) === "enabled");
    setPreferenceLoaded(true);
  }, [excluded]);

  useEffect(() => {
    const currentPath = window.location.pathname;

    if (excluded) {
      const translationWasActive = hasTranslationState();
      removeTranslationChrome();
      expireTranslationCookies();
      delete window.gtranslateSettings;

      if (
        translationWasActive &&
        sessionStorage.getItem(RESET_GUARD_KEY) !== currentPath
      ) {
        sessionStorage.setItem(RESET_GUARD_KEY, currentPath);
        window.location.reload();
        return;
      }

      sessionStorage.removeItem(RESET_GUARD_KEY);
      return;
    }

    if (!preferenceLoaded) return;

    if (!translationEnabled) {
      const translationWasActive = hasTranslationState();
      removeTranslationChrome();
      expireTranslationCookies();
      delete window.gtranslateSettings;
      if (translationWasActive) window.location.reload();
      return;
    }

    sessionStorage.removeItem(RESET_GUARD_KEY);
    protectSensitiveNodes(document);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) protectSensitiveNodes(node);
        });
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    window.gtranslateSettings = {
      default_language: "en",
      detect_browser_language: false,
      all_languages: true,
      wrapper_selector: ".gtranslate_wrapper",
      flag_style: "3d",
      flag_size: 24,
      switcher_horizontal_position: "right",
      switcher_vertical_position: "bottom",
      switcher_open_direction: "top",
      alt_flags: {},
      native_language_names: true,
    };

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://cdn.gtranslate.net/widgets/latest/float.js";
      script.defer = true;
      document.body.appendChild(script);
    }

    return () => {
      observer.disconnect();
      removeTranslationChrome();
      delete window.gtranslateSettings;
    };
  }, [excluded, preferenceLoaded, translationEnabled]);

  const enableTranslation = () => {
    localStorage.setItem(TRANSLATION_CONSENT_KEY, "enabled");
    setTranslationEnabled(true);
  };

  const disableTranslation = () => {
    localStorage.setItem(TRANSLATION_CONSENT_KEY, "disabled");
    removeTranslationChrome();
    expireTranslationCookies();
    delete window.gtranslateSettings;
    setTranslationEnabled(false);
    if (hasTranslationState()) window.location.reload();
  };

  return (
    <>
      {children}
      {!excluded && preferenceLoaded && !translationEnabled ? (
        <div
          className="notranslate fixed bottom-4 right-4 z-[100] max-w-[18rem] rounded-xl border border-border bg-background/95 p-3 shadow-lg backdrop-blur"
          translate="no"
          data-notranslate
          aria-label="Language translation choice"
        >
          <p className="text-xs leading-relaxed text-muted-foreground">
            Want another language? Translation is optional and uses a third-party service only on public pages.
          </p>
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={enableTranslation}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              Enable languages
            </button>
            <a href="/cookie-notice" className="text-xs font-medium text-foreground underline underline-offset-4">
              Privacy
            </a>
          </div>
        </div>
      ) : null}
      {!excluded && translationEnabled ? (
        <>
          <div
            className="gtranslate_wrapper notranslate"
            translate="no"
            data-notranslate
            aria-label="Website language selector"
          />
          <button
            type="button"
            onClick={disableTranslation}
            className="notranslate fixed bottom-4 left-4 z-[100] rounded-md border border-border bg-background/90 px-2.5 py-1.5 text-[0.7rem] font-medium text-muted-foreground shadow-sm backdrop-blur hover:text-foreground"
            translate="no"
            data-notranslate
          >
            Turn translation off
          </button>
        </>
      ) : null}
    </>
  );
}
