import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  as?: "div" | "button" | "article";
  onClick?: () => void;
}

export default function Card({
  children,
  className = "",
  hover = false,
  as = "div",
  onClick,
}: CardProps) {
  // Make Card neutral: pages decide background color from palette
  const baseClasses =
    "rounded-2xl shadow-lg transition-all duration-300 focus:outline-none";
  const hoverClasses = hover ? "hover:shadow-xl hover:-translate-y-1" : "";
  const focusClasses = "focus:ring-2 focus:ring-offset-1";

  const classes =
    `${baseClasses} ${hoverClasses} ${focusClasses} ${className}`.trim();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (!onClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  if (as === "button") {
    return (
      <button type="button" className={classes} onClick={onClick}>
        {children}
      </button>
    );
  }

  if (as === "article") {
    return (
      <article
        className={classes}
        onClick={onClick}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? handleKeyPress : undefined}
      >
        {children}
      </article>
    );
  }

  return (
    <div
      className={classes}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? handleKeyPress : undefined}
    >
      {children}
    </div>
  );
}
