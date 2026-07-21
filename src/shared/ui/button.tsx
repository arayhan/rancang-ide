import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

const base =
  "glow-ring inline-flex h-11 items-center justify-center rounded-sm px-6 text-sm font-semibold tracking-tight transition-colors disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "lift bg-primary text-white hover:bg-primary-hover disabled:bg-surface-raised",
  secondary: "lift border-2 border-border bg-surface text-foreground",
  ghost:
    "border-2 border-transparent text-muted hover:border-border hover:text-foreground",
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
