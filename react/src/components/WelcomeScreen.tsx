// components/WelcomeScreen.tsx
"use client";

import { motion } from "framer-motion";
import {
  MdRocketLaunch,
  MdFolder,
  MdTrendingUp,
  MdAutoAwesome,
  MdSchool,
  MdPsychology,
  MdLibraryBooks,
} from "react-icons/md";
import Button from "./ui/Button";
import { colors, gradients, shadows } from "@/theme/colors";
import { useEffect, useState } from "react";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAIAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      onGetStarted();
    }, 1800);
  };

  const features = [
    {
      icon: <MdPsychology className="w-6 h-6" />,
      title: "AI-Powered Analysis",
      description: "Advanced AI analyzes your CV to understand your skills and experience",
    },
    {
      icon: <MdSchool className="w-6 h-6" />,
      title: "Personalized Learning Path",
      description: "Tailored roadmap that adapts to your career goals and skill gaps",
    },
    {
      icon: <MdTrendingUp className="w-6 h-6" />,
      title: "Smart Progress Tracking",
      description: "AI-driven quizzes and analytics to measure your improvement",
    },
  ];

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
    return <span style={{ fontWeight: 900 }}>{format ? format(value) : value}</span>;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Main Hero Section */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          show: { transition: { staggerChildren: 0.08 } },
        }}
        className="mb-8"
        style={{ width: "100%" }}
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
            padding: "52px 32px 42px",
            background: gradients.hero,
            boxShadow: shadows.glow,
            borderRadius: 24,
            position: "relative",
            margin: "auto",
            marginTop: 40,
          }}
          aria-labelledby="welcome-title"
        >
          {/* Background đơn giản */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, ${colors.primary[400]}, ${colors.primary[600]})`,
              borderRadius: 20,
              pointerEvents: "none",
            }}
          />

          {/* AI Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.15)",
              padding: "8px 16px",
              borderRadius: 20,
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              zIndex: 10,
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#00FF88",
              }}
            />
            AI Assistant Active
          </motion.div>

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
            <motion.h1
              id="welcome-title"
              style={{
                fontSize: 48,
                lineHeight: 1.1,
                margin: "0 0 16px",
                fontWeight: 900,
                background: `linear-gradient(135deg, #ffffff 0%, ${colors.primary[100]} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Supercharge Your Career
              <br />
              <span
                style={{
                  background: `linear-gradient(135deg, ${colors.primary[300]}, ${colors.primary[500]})`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  display: "inline-block",
                  marginTop: 8,
                }}
              >
                with AI-Powered Learning
              </span>
            </motion.h1>

            <motion.p
              style={{
                fontSize: 20,
                opacity: 0.9,
                margin: "0 0 40px",
                fontWeight: 500,
                maxWidth: 600,
                marginLeft: "auto",
                marginRight: "auto",
                lineHeight: 1.4,
              }}
            >
              Get a personalized learning path analyzed from your CV in 60 seconds
            </motion.p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 24,
                marginBottom: 48,
              }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(10px)",
                    padding: "24px 20px",
                    borderRadius: 16,
                    border: "1px solid rgba(255,255,255,0.1)",
                    textAlign: "center",
                  }}
                  whileHover={{
                    scale: 1.01,
                    background: "rgba(255,255,255,0.10)",
                    transition: { duration: 0.3 },
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: `linear-gradient(135deg, ${colors.primary[200]}, ${colors.primary[300]})`,
                      color: colors.primary[700],
                      margin: "0 auto 16px",
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      margin: "0 0 8px",
                      color: "#fff",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      opacity: 0.8,
                      lineHeight: 1.4,
                      margin: 0,
                      color: "#fff",
                    }}
                  >
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                variant="primary"
                onClick={handleAIAnalysis}
                disabled={isAnalyzing}
                style={{
                  borderRadius: 32,
                  background: isAnalyzing
                    ? `linear-gradient(135deg, ${colors.primary[400]}, ${colors.primary[500]})`
                    : `linear-gradient(135deg, ${colors.primary[300]}, ${colors.primary[400]})`,
                  border: "none",
                  fontSize: 18,
                  fontWeight: 700,
                  padding: "20px 40px",
                  boxShadow: isAnalyzing ? "0 8px 32px rgba(79, 70, 229, 0.4)" : "0 8px 32px rgba(79, 70, 229, 0.6)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {isAnalyzing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      style={{ marginRight: 12 }}
                    >
                      <MdAutoAwesome size={22} />
                    </motion.div>
                    AI is Analyzing...
                  </>
                ) : (
                  <>
                    <MdRocketLaunch size={22} />
                    <span style={{ marginLeft: 12 }}>Start AI Analysis</span>
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </motion.section>
      </motion.div>

      {/* Enhanced Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        style={{
          display: "flex",
          gap: 20,
          justifyContent: "center",
          marginTop: 32,
          marginBottom: 60,
          width: "100%",
        }}
      >
        {/* AI Accuracy Card */}
        <div
          style={{
            flex: 1,
            maxWidth: 280,
            borderRadius: 20,
            padding: "24px 20px",
            background: `linear-gradient(135deg, ${colors.primary[400]}, ${colors.primary[500]})`,
            color: "#fff",
            boxShadow: "0 12px 40px rgba(16,24,40,0.15)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
          }}
          className="hover-scale"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                fontSize: 36,
                background: "rgba(255,255,255,0.15)",
                borderRadius: 12,
                width: 60,
                height: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ⚡
            </div>
            <div style={{ textAlign: "right", flex: 1 }}>
              <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1 }}>
                <CountUp end={98} duration={1600} format={(n) => `${n}%`} />
              </div>
              <div style={{ fontSize: 14, opacity: 0.9, marginTop: 4 }}>AI Accuracy Rate</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Analysis precision</div>
            </div>
          </div>
        </div>

        {/* Course Library Card - THAY THẾ Analysis Time */}
        <div
          style={{
            flex: 1,
            maxWidth: 280,
            borderRadius: 20,
            padding: "24px 20px",
            background: `linear-gradient(135deg, ${colors.primary[300]}, ${colors.primary[400]})`,
            color: "#fff",
            boxShadow: "0 12px 40px rgba(16,24,40,0.15)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
          }}
          className="hover-scale"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                fontSize: 36,
                background: "rgba(255,255,255,0.15)",
                borderRadius: 12,
                width: 60,
                height: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MdLibraryBooks style={{ fontSize: 24 }} />
            </div>
            <div style={{ textAlign: "right", flex: 1 }}>
              <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1 }}>
                <CountUp end={24000} duration={1800} format={(n) => `${n.toLocaleString()}+`} />
              </div>
              <div style={{ fontSize: 14, opacity: 0.9, marginTop: 4 }}>Courses Available</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Massive learning library</div>
            </div>
          </div>
        </div>

        {/* Efficiency Card */}
        <div
          style={{
            flex: 1,
            maxWidth: 280,
            borderRadius: 20,
            padding: "24px 20px",
            background: `linear-gradient(135deg, ${colors.primary[200]}, ${colors.primary[300]})`,
            color: "#fff",
            boxShadow: "0 12px 40px rgba(16,24,40,0.15)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
          }}
          className="hover-scale"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                fontSize: 36,
                background: "rgba(255,255,255,0.15)",
                borderRadius: 12,
                width: 60,
                height: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              📈
            </div>
            <div style={{ textAlign: "right", flex: 1 }}>
              <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1 }}>
                <CountUp end={250} duration={1300} format={(n) => `${(n / 100).toFixed(1)}x`} />
              </div>
              <div style={{ fontSize: 14, opacity: 0.9, marginTop: 4 }}>Learning Efficiency</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>AI-optimized paths</div>
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        .hover-scale {
          transition: transform 0.3s ease;
        }

        .hover-scale:hover {
          transform: scale(1.02);
        }

        /* Cho phép scroll tự nhiên */
        body {
          overflow: auto;
        }

        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .max-w-6xl {
            padding-left: 20px;
            padding-right: 20px;
          }

          h1 {
            font-size: 36px !important;
          }
        }

        @media (max-width: 768px) {
          .mx-auto {
            padding: 32px 20px !important;
          }

          h1 {
            font-size: 28px !important;
          }

          .stats-grid {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
