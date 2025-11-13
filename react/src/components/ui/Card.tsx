// components/ui/Card.tsx
import { ReactNode, HTMLAttributes } from "react";
import { colors, shadows } from "@/theme/colors";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
  onClick,
  ...rest
}: CardProps) {
  const paddings = { sm: "p-4", md: "p-6", lg: "p-8" };

  const clickable = Boolean(onClick);

  return (
    <div
      className={`${paddings[padding]} ${
        hover
          ? "transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
          : ""
      } ${className}`}
      style={{
        borderRadius: 20, // larger radius
        border: `1px solid ${colors.primary[200]}`,
        boxShadow: shadows.base,
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.94) 0%, rgba(248,250,252,0.94) 100%)",
        backdropFilter: className.includes("glass")
          ? "blur(6px) saturate(120%)"
          : undefined,
      }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                (onClick as any)(e as any);
              }
            }
          : undefined
      }
      {...rest}
    >
      {children}
    </div>
  );
}
