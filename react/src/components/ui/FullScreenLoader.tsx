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
  const [progress, setProgress] = useState<number>(0);
  const [transitionMs, setTransitionMs] = useState<number>(0);
  const [dots, setDots] = useState<number>(0);
  const finishingRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  // dots animation
  useEffect(() => {
    const t = setInterval(() => setDots((d) => (d + 1) % 4), 400);
    return () => clearInterval(t);
  }, []);

  // handle show/hide and progress animations
  useEffect(() => {
    if (active) {
      finishingRef.current = false;
      setVisible(true);
      // start from small value then animate to 80% over 10s
      setTransitionMs(0);
      setProgress(6);
      // allow next tick for transition
      window.setTimeout(() => {
        setTransitionMs(10000); // 10s to reach 80%
        setProgress(80);
      }, 30);
    } else {
      // active -> false: finish last 20% quickly and hide
      if (!visible) return;
      finishingRef.current = true;
      setTransitionMs(600); // 0.6s to finish
      setProgress(100);
      // hide after transition completes
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setVisible(false);
      }, 700);
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
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>
          {message}
          <span style={{ opacity: 0.95, marginLeft: 6 }}>{dotsText}</span>
        </div>

        <div
          style={{
            marginTop: 8,
            marginBottom: 6,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          Vui lòng chờ trong giây lát — hệ thống đang xử lý yêu cầu của bạn.
        </div>

        <div style={{ marginTop: 18 }}>
          <div
            aria-hidden
            style={{
              height: 12,
              width: "100%",
              borderRadius: 999,
              background: "rgba(255,255,255,0.08)",
              overflow: "hidden",
              boxShadow: "inset 0 2px 6px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, ${colors.primary[500]} 0%, ${colors.primary[400]} 100%)",
                borderRadius: 999,
                transition: `width ${transitionMs}ms linear`,
                boxShadow: "0 6px 20px rgba(50,130,184,0.16)",
              }}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            fontSize: 12,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          {/* {finishingRef.current ? "Hoàn tất..." : "Đang xử lý..."} */}
        </div>
      </div>
    </div>
  );
}
