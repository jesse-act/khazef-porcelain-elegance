import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import frCommon from "@/locales/fr/common.json";
import arCommon from "@/locales/ar/common.json";

export type SupportedLocale = "fr" | "ar";
export const SUPPORTED_LOCALES: SupportedLocale[] = ["fr", "ar"];
export const RTL_LOCALES: SupportedLocale[] = ["ar"];

/**
 * i18n initialisation — latest-gen stack (i18next v23 + react-i18next v14).
 *
 * - Resources are inlined at build time (small corpus — no HTTP backend needed).
 * - Language is detected from localStorage then navigator, falling back to FR.
 * - `suspense: false` keeps SSR/hydration simple for this CSR app.
 * - `returnEmptyString: false` surfaces missing keys in dev so translators
 *   can catch gaps early.
 */
void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { common: frCommon },
      ar: { common: arCommon },
    },
    fallbackLng: "fr",
    supportedLngs: SUPPORTED_LOCALES,
    ns: ["common"],
    defaultNS: "common",
    returnEmptyString: false,
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "luxuryliving-lang",
    },
    react: { useSuspense: false },
  });

export function isRtlLocale(lang: string): boolean {
  return RTL_LOCALES.includes(lang as SupportedLocale);
}

/**
 * Apply <html lang> + <html dir> whenever the language changes so that
 * Tailwind's `rtl:` variants and native text direction flip correctly.
 */
export function applyDocumentDirection(lang: string): void {
  const html = document.documentElement;
  html.setAttribute("lang", lang);
  html.setAttribute("dir", isRtlLocale(lang) ? "rtl" : "ltr");
}

// Wire up direction updates on language change + initial mount.
i18n.on("languageChanged", (lang) => applyDocumentDirection(lang));
if (typeof document !== "undefined") {
  applyDocumentDirection(i18n.language ?? "fr");
}

export default i18n;
