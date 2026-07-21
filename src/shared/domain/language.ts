/** Output language for AI-generated content (pure, framework-free). */
export type Language = "en" | "id";

/** Coerce an untrusted value into a supported language, defaulting to English. */
export function parseLanguage(value: unknown): Language {
  return value === "id" ? "id" : "en";
}

/** Instruction appended to a prompt so the model writes in the chosen language. */
export function languageInstruction(language: Language): string {
  return language === "id"
    ? "IMPORTANT: Write ALL output in Indonesian (Bahasa Indonesia) — natural, clear, professional. Keep technical/code terms in English where that's the norm."
    : "IMPORTANT: Write ALL output in English.";
}
