"use client";

import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
}

export default function Layout({ children, currentStep, totalSteps }: LayoutProps) {
  const steps = ["Profile", "Pre-Quiz", "Recommendations", "Post-Quiz", "Completion"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🎓 RAG Learning Assistant</h1>
          <p className="text-gray-600">Hệ thống gợi ý khóa học thông minh</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8 relative">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-col items-center z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  index <= currentStep ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600"
                }`}
              >
                {index + 1}
              </div>
              <span className={`text-sm mt-2 ${index <= currentStep ? "text-blue-500 font-medium" : "text-gray-500"}`}>
                {step}
              </span>
            </div>
          ))}
          {/* Progress line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-300 -z-10">
            <div
              className="h-1 bg-blue-500 transition-all duration-300"
              style={{
                width: `${(currentStep / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
}
