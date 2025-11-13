// components/ui/Button.tsx
import { ReactNode } from "react";
import { colors } from "@/theme/colors";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  loading = false,
  className = "",
  type = "button",
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: `bg-gradient-to-r from-[${colors.primary[500]}] to-[${colors.primary[400]}] text-white hover:shadow-lg transform hover:-translate-y-0.5 focus:ring-[${colors.primary[300]}]`,
    secondary: `bg-[${colors.accent.purple}] text-white hover:bg-[${colors.accent.blue}] transform hover:-translate-y-0.5 focus:ring-[${colors.accent.purple}]`,
    outline: `border-2 border-[${colors.primary[300]}] text-[${colors.primary[600]}] hover:bg-[${colors.primary[50]}] focus:ring-[${colors.primary[300]}]`,
    ghost: `text-[${colors.primary[600]}] hover:bg-[${colors.primary[50]}] focus:ring-[${colors.primary[300]}]`,
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      style={{
        boxShadow: variant === "primary" ? "0 4px 14px 0 rgba(66, 72, 116, 0.2)" : "none",
      }}
    >
      {loading && <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
      {children}
    </button>
  );
}
