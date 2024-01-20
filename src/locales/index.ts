import { cn } from "./cn";
import { tw } from "./tw";
import { en } from "./en";

const ALL_LOCALES = {
  cn,
  tw,
  en,
};

export type LOCALE = keyof typeof ALL_LOCALES;

export const ALL_LOCALES_OPTIONS: Record<LOCALE, string> = {
  cn: "🇨🇳 简体中文",
  tw: "🇭🇰 繁体中文",
  en: "🇺🇸 English",
};

export function getLang() {
  try {
    return (localStorage.getItem("lang") as LOCALE) || "en";
  } catch {
    return "en";
  }
}

function getLocale() {
  const lang = getLang();
  if (!lang) return en;
  return ALL_LOCALES[lang] || en;
}

const Locale = getLocale();

export default Locale;
