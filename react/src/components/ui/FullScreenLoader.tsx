import React from "react";

export default function FullScreenLoader({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(180deg, rgba(8,26,52,0.88), rgba(18,42,80,0.92))",
      }}
    >
      <div style={{ textAlign: "center", color: "#fff" }}>
        <div
          style={{
            width: 120,
            height: 120,
            margin: "0 auto 18px",
            borderRadius: 999,
            border: "8px solid rgba(255,255,255,0.12)",
            borderTopColor: "rgba(255,255,255,0.9)",
            animation: "spin 1s linear infinite",
          }}
        />
        <div style={{ fontSize: 18, fontWeight: 700 }}>{message}</div>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
