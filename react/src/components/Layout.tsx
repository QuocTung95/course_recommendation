"use client";

import { ReactNode } from "react";
import {
  MdAccountCircle,
  MdQuiz,
  MdSchool,
  MdCheckCircle,
  MdEmojiEvents,
} from "react-icons/md";

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

  return (
    // Set page background to primary color #F4EEFF
    <div style={{ backgroundColor: "#F4EEFF" }} className="min-h-screen py-8">
      <div className="mx-auto px-4 max-w-5xl">
        {/* Header - centered, single title */}
        <header className="text-center mb-6 px-4">
          <div className="inline-flex items-center justify-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-md"
              style={{ backgroundColor: "#424874" }}
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
            <div>
              <h1
                className="text-2xl sm:text-3xl font-extrabold"
                style={{ color: "#424874" }}
              >
                RAG Learning Assistant
              </h1>
              <p
                className="mt-2 text-sm sm:text-base"
                style={{ color: "#A6B1E1" }}
              >
                Phân tích CV / Profile và đề xuất lộ trình học phù hợp — kèm
                quiz trước / sau để theo dõi tiến bộ.
              </p>
            </div>
          </div>
        </header>

        {/* Pipeline stepper (horizontal, centered, responsive) */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-[900px] overflow-x-auto px-2">
            <div className="flex items-center gap-4 justify-center min-w-[680px] px-2">
              {steps.map((s, idx) => {
                const isActive = idx === activeIndex;
                const isCompleted = idx < activeIndex;
                const IconComp = s.Icon;

                return (
                  <div key={s.key} className="flex items-center">
                    {/* Node */}
                    <div className="flex flex-col items-center">
                      <div
                        className="flex items-center justify-center rounded-full transition-transform duration-200"
                        style={{
                          width: isActive ? 56 : 48,
                          height: isActive ? 56 : 48,
                          backgroundColor: isActive ? "#A6B1E1" : "#DCD6F7",
                          boxShadow: isActive
                            ? "0 8px 20px rgba(66,72,116,0.12)"
                            : "none",
                          borderRadius: 999,
                        }}
                      >
                        <IconComp
                          size={isActive ? 24 : 20}
                          color={isActive ? "#424874" : "#A6B1E1"}
                        />
                      </div>
                      <div
                        className="mt-2 text-xs text-center"
                        style={{
                          color: "#424874",
                          opacity: isActive ? 1 : 0.95,
                        }}
                      >
                        {s.label}
                      </div>
                    </div>

                    {/* Connector */}
                    {idx < steps.length - 1 && (
                      <div
                        aria-hidden
                        className="flex-1 mx-3"
                        style={{
                          height: 6,
                          minWidth: 48,
                          background: isCompleted ? "#A6B1E1" : "#DCD6F7",
                          borderRadius: 999,
                          transition: "background .25s ease",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main content wrapper */}
        <main
          className="rounded-2xl p-6 md:p-8"
          style={{
            backgroundColor: "#F4EEFF",
            border: "1px solid #A6B1E1",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
