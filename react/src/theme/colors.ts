// theme/colors.ts
export const colors = {
  // Primary palette (updated)
  primary: {
    50: "#F3FAFF",
    100: "#BBE1FA",
    200: "#99D4F4",
    300: "#63BEEB",
    400: "#4799D6",
    500: "#3282B8",
    600: "#2B6B9E",
    700: "#0F4C75",
    800: "#0C3B59",
    900: "#1B262C",
  },

  // Accent colors - removed purple, keep blues/teal only
  accent: {
    blue: "#63A7E8",
    teal: "#5EEAD4",
  },

  // Neutral colors (kept)
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

  // Semantic colors (kept)
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
  // hero gradient: blue -> lighter blue (no purple)
  hero: "linear-gradient(135deg, #3282B8 0%, #63A7E8 100%)",
  // primary (buttons / accents)
  primary: "linear-gradient(135deg, #3282B8 0%, #0F4C75 100%)",
  secondary: "linear-gradient(135deg, #63BEEB 0%, #3282B8 100%)",
  accent: "linear-gradient(135deg, #5EEAD4 0%, #63A7E8 50%)",
  card: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
};

export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  base: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  md: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  lg: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  xl: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  "2xl": "0 50px 100px -20px rgb(0 0 0 / 0.25)",
  glow: "0 8px 30px rgba(50,130,184,0.16)",
};
