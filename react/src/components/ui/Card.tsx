import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = false }: CardProps) {
  const baseClasses = "bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-300";
  const hoverClasses = hover ? "hover:shadow-xl hover:-translate-y-1 hover:border-blue-200" : "";

  return <div className={`${baseClasses} ${hoverClasses} ${className}`}>{children}</div>;
}
