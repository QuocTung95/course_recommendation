// theme/colors.ts
export const colors = {
  // Primary palette
  primary: {
    50: "#F0F4FF",
    100: "#E6EDFE",
    200: "#D6E2FD",
    300: "#A6B1E1",
    400: "#8B97D6",
    500: "#424874",
    600: "#363B6A",
    700: "#2A2F5A",
    800: "#1F2348",
    900: "#151836",
  },

  // Accent colors
  accent: {
    purple: "#9B87F5",
    blue: "#6C87F5",
    teal: "#5EEAD4",
    pink: "#F472B6",
  },

  // Neutral colors
  neutral: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },

  // Semantic colors
  success: {
    50: "#F0FDF4",
    500: "#22C55E",
    600: "#16A34A",
  },

  warning: {
    50: "#FFFBEB",
    500: "#F59E0B",
    600: "#D97706",
  },

  error: {
    50: "#FEF2F2",
    500: "#EF4444",
    600: "#DC2626",
  },
};

export const gradients = {
  primary: "linear-gradient(135deg, #424874 0%, #A6B1E1 100%)",
  secondary: "linear-gradient(135deg, #9B87F5 0%, #6C87F5 100%)",
  accent: "linear-gradient(135deg, #5EEAD4 0%, #6C87F5 50%)",
  card: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
};

export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  base: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  md: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  lg: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  xl: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  "2xl": "0 50px 100px -20px rgb(0 0 0 / 0.25)",
};
