export const APP_NAME = "GemmaLens";
export const APP_TAGLINE = "Understand any document, in your language.";
export const APP_DESCRIPTION =
  "GemmaLens uses local AI to help you truly understand complex documents — housing contracts, government forms, medical paperwork — in plain language and your own cultural context.";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी (Hindi)" },
  { code: "ne", label: "नेपाली (Nepali)" },
  { code: "zh", label: "中文 (Chinese)" },
  { code: "ar", label: "العربية (Arabic)" },
  { code: "es", label: "Español (Spanish)" },
  { code: "fr", label: "Français (French)" },
  { code: "de", label: "Deutsch (German)" },
  { code: "it", label: "Italiano (Italian)" },
  { code: "pt", label: "Português (Portuguese)" },
  { code: "ru", label: "Русский (Russian)" },
  { code: "uk", label: "Українська (Ukrainian)" },
  { code: "pl", label: "Polski (Polish)" },
  { code: "cs", label: "Čeština (Czech)" },
  { code: "ro", label: "Română (Romanian)" },
  { code: "hu", label: "Magyar (Hungarian)" },
  { code: "nl", label: "Nederlands (Dutch)" },
  { code: "sv", label: "Svenska (Swedish)" },
  { code: "no", label: "Norsk (Norwegian)" },
  { code: "da", label: "Dansk (Danish)" },
  { code: "fi", label: "Suomi (Finnish)" },
  { code: "el", label: "Ελληνικά (Greek)" },
  { code: "tr", label: "Türkçe (Turkish)" },
  { code: "he", label: "עברית (Hebrew)" },
  { code: "fa", label: "فارسی (Persian)" },
  { code: "ur", label: "اردو (Urdu)" },
  { code: "bn", label: "বাংলা (Bengali)" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "ms", label: "Bahasa Melayu (Malay)" },
  { code: "th", label: "ภาษาไทย (Thai)" },
  { code: "vi", label: "Tiếng Việt (Vietnamese)" },
  { code: "ko", label: "한국어 (Korean)" },
  { code: "ja", label: "日本語 (Japanese)" },
  { code: "tl", label: "Filipino (Tagalog)" },
  { code: "sw", label: "Kiswahili (Swahili)" },
] as const;

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  rental_agreement: "Rental Agreement",
  government_form: "Government Form",
  healthcare: "Healthcare / Medical",
  banking: "Banking / Financial",
  employment_contract: "Employment Contract",
  immigration: "Immigration Document",
  educational: "Educational Document",
  unknown: "General Document",
};

export const RISK_LEVEL_CONFIG = {
  low: {
    label: "Low Risk",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    dot: "bg-green-500",
  },
  medium: {
    label: "Needs Attention",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  high: {
    label: "Important",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
  },
} as const;
