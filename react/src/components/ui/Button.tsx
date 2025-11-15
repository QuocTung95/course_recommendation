// components/ui/Button.tsx
import { ReactNode, useState } from "react";
import { colors, gradients } from "@/theme/colors";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: (e?: any) => void; // allow event param
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
  const [hover, setHover] = useState(false);

  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none";

  // Standardized sizes and exact paddings
  const sizesMap: Record<
    string,
    { cls: string; radius: number; padding: string }
  > = {
    sm: { cls: "text-sm", radius: 20, padding: "12px 32px" }, // compact
    md: { cls: "text-base", radius: 28, padding: "24px 56px" }, // requested default
    lg: { cls: "text-lg", radius: 36, padding: "28px 72px" }, // large CTA
  };

  const s = sizesMap[size];

  const commonStyle: React.CSSProperties = {
    borderRadius: s.radius,
    padding: s.padding, // exact padding per spec
    display: "inline-flex",
    alignItems: "center",
    gap: 14,
    fontWeight: 800,
    transform: hover ? "translateY(-3px) scale(1.02)" : undefined,
    boxShadow: hover
      ? "0 28px 80px rgba(50,130,184,0.18)"
      : "0 8px 24px rgba(16,24,40,0.06)",
    transition: "all 180ms ease",
    cursor: disabled ? "not-allowed" : "pointer",
    outline: "none",
    color:
      variant === "primary" || variant === "secondary"
        ? "#fff"
        : colors.primary[600],
  };

  const variantStyle: React.CSSProperties =
    variant === "primary"
      ? { background: gradients.primary, border: "none" }
      : variant === "secondary"
      ? {
          background:
            "linear-gradient(90deg, rgba(166,177,225,1) 0%, rgba(146,168,223,1) 100%)",
          border: "none",
        }
      : variant === "outline"
      ? {
          background: "transparent",
          color: colors.primary[600],
          border: `2px solid ${colors.primary[300]}`,
        }
      : {
          background: "transparent",
          color: colors.primary[600],
          border: "none",
        };

  return (
    <button
      type={type}
      onClick={(e) => onClick && onClick(e)}
      disabled={disabled || loading}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`${baseStyles} ${s.cls} ${className}`}
      style={{
        ...commonStyle,
        ...(variantStyle as React.CSSProperties),
        opacity: disabled ? 0.6 : 1,
      }}
      aria-disabled={disabled || loading}
    >
      {loading && (
        <div
          style={{
            marginRight: 12,
            width: 20,
            height: 20,
            borderRadius: 999,
            border: "3px solid rgba(255,255,255,0.9)",
            borderTopColor: "transparent",
            animation: "spin 0.9s linear infinite",
          }}
        />
      )}
      {children}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </button>
  );
}
