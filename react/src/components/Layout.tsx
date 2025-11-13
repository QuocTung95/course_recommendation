"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  MdAccountCircle,
  MdQuiz,
  MdSchool,
  MdCheckCircle,
  MdEmojiEvents,
} from "react-icons/md";
import { colors } from "@/theme/colors";
import Link from "next/link";

interface LayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
}

export default function Layout({
  children,
  currentStep,
  totalSteps,
}: LayoutProps) {
  // User-facing steps
  const steps = [
    { key: "profile", label: "Profile", Icon: MdAccountCircle },
    { key: "pre", label: "Pre-Quiz", Icon: MdQuiz },
    { key: "rec", label: "Recommendations", Icon: MdSchool },
    { key: "post", label: "Post-Quiz", Icon: MdCheckCircle },
    { key: "done", label: "Completion", Icon: MdEmojiEvents },
  ];

  const mapToIndex = (step: number) => {
    switch (step) {
      case 1:
        return 0;
      case 2:
        return 1;
      case 3:
        return 2;
      case 5:
        return 3;
      case 4:
        return 4;
      default:
        return 0;
    }
  };

  const activeIndex = mapToIndex(currentStep);

  const stepVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.98 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.06, duration: 0.36 },
    }),
  };

  return (
    <div
      style={{
        backgroundColor: colors.primary[50],
        fontFamily: "Inter, Roboto, sans-serif",
      }}
      className="min-h-screen py-6"
    >
      <div className="mx-auto px-4 max-w-5xl">
        {/* Header - centered, single title */}
        <header className="text-center mb-6 px-4">
          <div className="inline-flex items-center justify-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-md"
              style={{ backgroundColor: colors.primary[500] }}
            >
              {/* subtle professional icon */}
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2l3 6 6 .5-4.5 3.8L19 20l-7-4-7 4 1.5-7.7L3 8.5 9 8l3-6z"
                />
              </svg>
            </div>
            <div style={{ marginLeft: 12 }}>
              <h1
                className="text-2xl sm:text-3xl font-extrabold"
                style={{ color: colors.primary[700] }}
              >
                RAG Learning Assistant
              </h1>
              <p
                className="mt-2 text-sm sm:text-base"
                style={{ color: colors.primary[200] }}
              >
                Phân tích CV / Profile và đề xuất lộ trình học phù hợp — kèm
                quiz trước / sau để theo dõi tiến bộ.
              </p>
              {/* Add small link to /welcome */}
              {/* <div style={{ marginTop: 6 }}>
                <Link
                  href="/welcome"
                  className="text-sm font-medium"
                  style={{ color: colors.primary[500] }}
                >
                  Welcome page
                </Link>
              </div> */}
            </div>
          </div>
        </header>

        {/* Reworked Pipeline Stepper: centered, evenly spaced, consistent connectors */}
        <div className="flex justify-center mb-2" style={{ marginTop: 6 }}>
          <div className="w-full max-w-[820px] px-2">
            {/* Use space-between so steps are evenly distributed */}
            <div
              className="flex items-center"
              style={{
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {steps.map((s, idx) => {
                const isActive = idx === activeIndex;
                const isCompleted = idx < activeIndex;
                const IconComp = s.Icon;

                return (
                  <motion.div
                    key={s.key}
                    custom={idx}
                    initial="hidden"
                    animate="show"
                    variants={stepVariants}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {/* Node (centered in its column) */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <div
                        aria-current={isActive ? "step" : undefined}
                        title={s.label}
                        style={{
                          width: isActive ? 64 : 48,
                          height: isActive ? 64 : 48,
                          borderRadius: 999,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: isActive
                            ? colors.primary[500]
                            : isCompleted
                            ? colors.primary[300]
                            : colors.primary[200],
                          boxShadow: isActive
                            ? "0 12px 30px rgba(16,24,40,0.16)"
                            : "none",
                          transform: isActive
                            ? "translateY(-4px) scale(1.03)"
                            : "none",
                          transition: "all .18s ease",
                        }}
                      >
                        <IconComp
                          size={isActive ? 26 : 20}
                          color={isActive ? "#fff" : colors.primary[700]}
                        />
                      </div>

                      <div
                        style={{
                          marginTop: 8,
                          fontSize: 12,
                          color: colors.primary[700],
                          fontWeight: isActive ? 700 : 600,
                        }}
                      >
                        {s.label}
                      </div>
                    </div>

                    {/* Connector except after last */}
                    {idx < steps.length - 1 && (
                      <div
                        aria-hidden
                        style={{
                          height: 4,
                          flex: 1,
                          marginLeft: 12,
                          marginRight: 12,
                          background: isCompleted
                            ? colors.primary[300]
                            : colors.primary[200],
                          borderRadius: 999,
                          alignSelf: "center",
                          minWidth: 40,
                          maxWidth: 120,
                          transition: "background .18s ease",
                        }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main content wrapper */}
        <main
          className="rounded-2xl p-6 md:p-8"
          style={{ backgroundColor: colors.primary[50], marginTop: 30 }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
