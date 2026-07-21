import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "@/styles/globals.css";

import { AnalyticsProvider } from "@/shared/ui/analytics-provider";

// Display: Space Grotesk — a technical geometric face (the engineered-futurism
// voice, in place of self-hosted Clash Display). Body: Inter. Mono: JetBrains Mono.
const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Rancang Ide — Validate first, then build",
  description:
    "Turn a raw idea into a validated product blueprint — honest verdict, feature tree, PRD, and task list ready for an AI coding agent.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider messages={messages}>
          <AnalyticsProvider />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
