import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-md border-2 border-border bg-[--surface] p-6 ${className}`}
      {...props}
    />
  );
}
