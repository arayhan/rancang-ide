import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  /** Interactive cards lift on hover (neo-brutalist tactility). */
  interactive?: boolean;
  /** Blueprint corner ticks accent. */
  ticks?: boolean;
};

export function Card({
  className = "",
  interactive = false,
  ticks = false,
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-md border-2 border-border bg-surface p-6 ${
        interactive ? "lift cursor-pointer" : ""
      } ${ticks ? "ticks" : ""} ${className}`}
      {...props}
    />
  );
}
