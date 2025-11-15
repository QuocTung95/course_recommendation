import React, { useEffect, useRef, useState } from "react";
import { colors } from "@/theme/colors";

export default function FullScreenLoader({
  active,
  message = "Loading",
}: {
  active: boolean;
  message?: string;
}) {
  const [visible, setVisible] = useState<boolean>(active);
  const [dots, setDots] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const t = setInterval(() => setDots((d) => (d + 1) % 4), 400);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (active) {
      setVisible(true);
    } else {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setVisible(false), 420);
    }
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [active]);

  if (!visible) return null;

  const dotsText = ".".repeat(dots);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(180deg, rgba(8,26,52,0.82), rgba(8,26,52,0.88))",
      }}
    >
      <div
        style={{
          width: "min(720px, 92%)",
          textAlign: "center",
          color: "#fff",
          padding: 28,
          borderRadius: 16,
          opacity: visible ? 1 : 0,
          transition: "opacity 240ms ease",
        }}
      >
        {/* Message: CSS blink animation + JS-driven dots (synchronized visually) */}
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>
          <span
            className="fsloader-message"
            style={{ display: "inline-block" }}
          >
            {message}
          </span>
          <span
            className="fsloader-dots"
            style={{ opacity: 0.95, marginLeft: 8 }}
          >
            {dotsText}
          </span>
        </div>

        <div
          style={{
            marginTop: 8,
            marginBottom: 6,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          Please wait a moment — we are processing your request.
        </div>

        {/* Minimal subtle status area (no progress bar) */}
        <div
          style={{
            marginTop: 14,
            fontSize: 12,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          {/* intentionally compact */}
        </div>

        <style>{`
          /* blink: subtle opacity + color shift using primary color */
          .fsloader-message, .fsloader-dots {
            animation-name: fs-blink;
            animation-duration: 1.2s;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
            animation-direction: alternate;
          }

          @keyframes fs-blink {
            0% {
              opacity: 0.86;
              filter: none;
              color: rgba(255,255,255,0.98);
              transform: translateY(0);
            }
            50% {
              opacity: 1;
              color: ${colors.primary[300]};
              transform: translateY(-2px);
            }
            100% {
              opacity: 0.86;
              color: rgba(255,255,255,0.98);
              transform: translateY(0);
            }
          }

          /* keep dots visually compact when changing */
          .fsloader-dots { font-weight: 800; letter-spacing: -1px; }
        `}</style>
      </div>
    </div>
  );
}
