import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "success" | "outline";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses =
    "font-semibold rounded-lg shadow transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2";

  // palette: primary/header #424874, accent #A6B1E1, card #DCD6F7, background #F4EEFF
  const variants: Record<string, string> = {
    primary: "text-white",
    secondary: "text-white",
    success: "text-white",
    outline: "bg-transparent",
  };

  const sizes: Record<string, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  // Inline styles to ensure exact palette colors and hover behavior for older setups
  const style: React.CSSProperties =
    variant === "primary"
      ? { backgroundColor: "#424874" }
      : variant === "secondary"
      ? { backgroundColor: "#A6B1E1", color: "#424874" }
      : variant === "success"
      ? { backgroundColor: "#A6B1E1", color: "#424874" }
      : { border: "1px solid #A6B1E1", color: "#424874" };

  return (
    <button
      {...props}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      style={style}
      onMouseEnter={(e) => {
        if (variant === "primary")
          e.currentTarget.style.backgroundColor = "#A6B1E1";
        else if (variant === "outline")
          e.currentTarget.style.backgroundColor = "#DCD6F7";
      }}
      onMouseLeave={(e) => {
        if (variant === "primary")
          e.currentTarget.style.backgroundColor = "#424874";
        else if (variant === "outline")
          e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      {children}
    </button>
  );
}
