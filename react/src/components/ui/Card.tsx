// components/ui/Card.tsx
import { ReactNode } from "react";
import { colors, shadows } from "@/theme/colors";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

export default function Card({ children, className = "", hover = false, padding = "md" }: CardProps) {
  const paddings = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`
        rounded-2xl border border-[${colors.primary[200]}]
        bg-white/80 backdrop-blur-sm
        ${paddings[padding]}
        ${hover ? "transition-all duration-300 hover:shadow-lg hover:scale-[1.02]" : ""}
        ${className}
      `}
      style={{
        boxShadow: shadows.base,
        background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)",
      }}
    >
      {children}
    </div>
  );
}
