import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

/** Locale is chosen by the NEXT_LOCALE cookie (no URL routing). */
export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = store.get("NEXT_LOCALE")?.value === "id" ? "id" : "en";
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
