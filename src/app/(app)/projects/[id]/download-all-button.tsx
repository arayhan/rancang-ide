"use client";

import { useTranslations } from "next-intl";

import { downloadText } from "@/shared/lib/download";
import { toFileSlug } from "@/shared/lib/markdown";

type DownloadAllButtonProps = {
  fileSlug: string;
  content: string;
};

export function DownloadAllButton({ fileSlug, content }: DownloadAllButtonProps) {
  const t = useTranslations("stages");
  return (
    <button
      onClick={() => downloadText(`${toFileSlug(fileSlug)}-blueprint.md`, content)}
      disabled={!content}
      className="glow-ring lift inline-flex h-11 items-center gap-2 rounded-sm bg-primary px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
    >
      ↓ {t("downloadAll")}
    </button>
  );
}
