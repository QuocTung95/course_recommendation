// components/WelcomeScreen.tsx
"use client";

import { motion } from "framer-motion";
import {
  MdRocketLaunch,
  MdFolder,
  MdSchool,
  MdTrendingUp,
  MdAutoAwesome,
} from "react-icons/md";
import Button from "./ui/Button";
import { colors, gradients, shadows } from "@/theme/colors";
import { useEffect, useState } from "react";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const features = [
    {
      icon: <MdAutoAwesome className="w-6 h-6" />,
      title: "AI-Powered Analysis",
      description:
        "Automatically analyze your CV to understand your skills and experience",
    },
    {
      icon: <MdSchool className="w-6 h-6" />,
      title: "Personalized Learning Path",
      description: "A tailored learning roadmap aligned with your career goals",
    },
    {
      icon: <MdTrendingUp className="w-6 h-6" />,
      title: "Progress Tracking",
      description:
        "Track progress with pre- and post-quizzes to measure improvement",
    },
  ];

  // --- new CountUp helper (simple and smooth)
  const CountUp: React.FC<{
    end: number;
    duration?: number;
    format?: (n: number) => string;
  }> = ({ end, duration = 1200, format }) => {
    const [value, setValue] = useState(0);
    useEffect(() => {
      let start: number | null = null;
      let rafId: number;
      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.round(progress * end);
        setValue(current);
        if (progress < 1) rafId = requestAnimationFrame(step);
      };
      rafId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(rafId);
    }, [end, duration]);
    return (
      <span style={{ fontWeight: 900 }}>{format ? format(value) : value}</span>
    );
  };

  // condensed features (icons + title only) used directly under hero
  const condensed = features.map((f) => ({ icon: f.icon, title: f.title }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8" style={{ height: "100%" }}>
      {/* Hero — keep title/CTA, remove hero description text */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          show: { transition: { staggerChildren: 0.08 } },
        }}
        className="mb-8"
      >
        <motion.section
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6 },
            },
          }}
          className="mx-auto relative rounded-2xl overflow-hidden"
          style={{
            maxWidth: 1120,
            padding: "46px 32px",
            background: gradients.hero,
            boxShadow: shadows.glow,
            borderRadius: 20,
          }}
          aria-labelledby="welcome-title"
        >
          {/* decorative overlays: dot matrix + soft wave */}
          <svg
            aria-hidden
            style={{ position: "absolute", left: -40, top: -30, opacity: 0.06 }}
            width="420"
            height="260"
            viewBox="0 0 420 260"
            fill="none"
          >
            <defs>
              <linearGradient id="lg-w" x1="0" x2="1">
                <stop offset="0" stopColor="#ffffff" stopOpacity="0.08" />
                <stop offset="1" stopColor="#ffffff" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <rect width="420" height="260" fill="url(#lg-w)" />
            <g fill="rgba(255,255,255,0.03)">
              {/* dot grid */}
              {[...Array(10)].map((_, r) => (
                <g key={r} transform={`translate(${r * 42},0)`}>
                  {[...Array(6)].map((_, c) => (
                    <circle key={c} cx={c * 42} cy={r * 26} r={1.6} />
                  ))}
                </g>
              ))}
            </g>
          </svg>

          {/* subtle chip shape at top-right */}
          <svg
            aria-hidden
            style={{
              position: "absolute",
              right: -24,
              top: -12,
              opacity: 0.07,
            }}
            width="260"
            height="160"
            viewBox="0 0 260 160"
            fill="none"
          >
            <path
              d="M0 80 C60 0, 200 0, 260 80 L260 160 L0 160 Z"
              fill="white"
            />
          </svg>

          {/* NEW: large illustrative AI robot/chip on left for vibe */}
          <svg
            aria-hidden
            style={{
              position: "absolute",
              left: 24,
              top: 24,
              opacity: 0.07,
              pointerEvents: "none",
            }}
            width="220"
            height="220"
            viewBox="0 0 220 220"
            fill="none"
          >
            {/* stylized robot / chip */}
            <rect x="12" y="12" width="196" height="196" rx="28" fill="white" />
            <g
              transform="translate(34,34)"
              stroke="rgba(0,0,0,0.06)"
              strokeWidth="4"
            >
              <rect x="0" y="0" width="132" height="132" rx="18" fill="none" />
              <circle cx="22" cy="22" r="10" fill="rgba(0,0,0,0.06)" />
              <path d="M10 70h112M10 90h112M30 30v80" strokeLinecap="round" />
            </g>
          </svg>

          <div
            style={{
              maxWidth: 960,
              margin: "0 auto",
              textAlign: "center",
              color: "#fff",
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* small badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "6px 14px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.08)",
                marginBottom: 12,
              }}
            >
              <strong style={{ fontSize: 13 }}>AI Learning Assistant</strong>
            </div>

            <h1
              id="welcome-title"
              style={{
                fontSize: 44,
                lineHeight: 1.02,
                margin: "10px 0 22px",
                fontWeight: 900,
              }}
            >
              Explore a world of learning — AI-powered personalized learning
              paths
            </h1>

            {/* SINGLE MAIN CTA - centered and prominent */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <Button
                size="lg"
                variant="primary"
                onClick={onGetStarted}
                className="cta-hero"
              >
                <MdRocketLaunch size={22} />{" "}
                <span style={{ marginLeft: 12 }}>Analyze & Continue</span>
              </Button>
            </div>
          </div>

          {/* hero CTA styles */}
          <style>{`
            .cta-hero { border-radius: 32px; }
            .cta-hero:hover { cursor: pointer; }
            @media (max-width: 640px) { h1 { font-size: 28px !important; } .cta-hero { padding-left: 28px !important; padding-right: 28px !important; } }
          `}</style>
        </motion.section>
      </motion.div>

      {/* Condensed features row (icons + titles only) */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 24,
          marginTop: 20,
          marginBottom: 28,
        }}
      >
        {condensed.map((f, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              minWidth: 160,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(135deg, ${colors.primary[100]}, ${colors.primary[200]})`,
                color: colors.primary[600],
                boxShadow: "0 8px 30px rgba(16,24,40,0.06)",
              }}
            >
              {f.icon}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: colors.primary[700],
              }}
            >
              {f.title}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom stats — three cards with icon + animated number + short label */}
      <div
        style={{
          display: "flex",
          gap: 18,
          justifyContent: "center",
          marginTop: 12,
        }}
      >
        {/* Courses card */}
        <div
          style={{
            width: 260,
            borderRadius: 14,
            padding: 20,
            background: `linear-gradient(135deg, ${colors.primary[300]}, ${colors.primary[400]})`,
            color: "#fff",
            boxShadow: "0 12px 40px rgba(16,24,40,0.12)",
            transition: "transform .18s ease",
          }}
          className="hover:scale-[1.02]"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 34, lineHeight: 1 }}>
              {/* icon */}
              <MdFolder style={{ color: "#fff" }} />
            </div>
            <div style={{ textAlign: "right", flex: 1 }}>
              <div style={{ fontSize: 28 }}>
                <CountUp end={500} duration={1300} format={(n) => `${n}+`} />
              </div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>Courses</div>
            </div>
          </div>
        </div>

        {/* Users card */}
        <div
          style={{
            width: 260,
            borderRadius: 14,
            padding: 20,
            background: `linear-gradient(135deg, ${colors.primary[200]}, ${colors.primary[300]})`,
            color: "#fff",
            boxShadow: "0 12px 40px rgba(16,24,40,0.12)",
          }}
          className="hover:scale-[1.02]"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 34 }}>
              {/* icon */}
              <MdRocketLaunch style={{ color: "#fff" }} />
            </div>
            <div style={{ textAlign: "right", flex: 1 }}>
              <div style={{ fontSize: 28 }}>
                <CountUp
                  end={10000}
                  duration={1500}
                  format={(n) => `${n.toLocaleString()}`}
                />
              </div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>Users</div>
            </div>
          </div>
        </div>

        {/* Progress card */}
        <div
          style={{
            width: 260,
            borderRadius: 14,
            padding: 20,
            background: `linear-gradient(135deg, ${colors.primary[100]}, ${colors.primary[200]})`,
            color: "#fff",
            boxShadow: "0 12px 40px rgba(16,24,40,0.12)",
          }}
          className="hover:scale-[1.02]"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 34 }}>
              {/* icon */}
              <MdTrendingUp style={{ color: "#fff" }} />
            </div>
            <div style={{ textAlign: "right", flex: 1 }}>
              <div style={{ fontSize: 28 }}>
                <CountUp
                  end={250}
                  duration={1300}
                  format={(n) => `${(n / 100).toFixed(2)}x`}
                />
              </div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>Average Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* preserve any remaining layout spacing if needed */}
      <div style={{ height: 24 }} />
    </div>
  );
}
