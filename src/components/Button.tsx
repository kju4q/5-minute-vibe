"use client";

import { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-medium rounded-full transition-all duration-300 transform active:scale-95 font-soft";
  const variantStyles = {
    primary: "bg-primary hover:bg-accent text-text py-1 px-3",
    secondary: "bg-secondary hover:bg-white text-text py-1 px-3",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
