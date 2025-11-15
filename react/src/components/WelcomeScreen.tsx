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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
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

            <p
              style={{
                maxWidth: 820,
                margin: "0 auto 28px",
                fontSize: 16,
                opacity: 0.95,
              }}
            >
              Analyze your CV with AI, generate a tailored pre-quiz, and get
              course recommendations — start your smarter learning journey
              today.
            </p>

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

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div
              style={{
                padding: "24px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)",
                border: `1px solid ${colors.neutral[200]}`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                transition: "transform 0.3s",
                margin: 20,
              }}
              className="hover:scale-[1.02] cursor-pointer"
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  margin: "0 auto 12px",
                  borderRadius: 12,
                  background: `linear-gradient(135deg, ${colors.primary[100]}, ${colors.primary[200]})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: colors.primary[600],
                }}
              >
                {feature.icon}
              </div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: colors.primary[700],
                  marginBottom: 8,
                }}
              >
                {feature.title}
              </h3>
              <p style={{ color: colors.neutral[600], fontSize: 14 }}>
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Section (no template strings) */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
          {[
            { number: "500+", label: "Khóa học" },
            { number: "10K+", label: "Người dùng" },
            { number: "95%", label: "Hài lòng" },
            { number: "2.5x", label: "Tiến bộ" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: colors.primary[600],
                  marginBottom: 6,
                }}
              >
                {stat.number}
              </div>
              <div style={{ color: colors.neutral[500] }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
