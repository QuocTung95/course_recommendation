"use client";

import { api } from "@/lib/api";
import { useState, useEffect } from "react";
import { MdEmojiEvents, MdReplay } from "react-icons/md";
import FullScreenLoader from "./ui/FullScreenLoader";
import Button from "./ui/Button";
import { colors } from "@/theme/colors";

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

interface QuizComponentProps {
  userProfile: string;
  careerGoal?: string;
  quizType: "pre-quiz" | "post-quiz";
  onComplete: (score: number, total: number) => void;
}

export default function QuizComponent({
  userProfile,
  careerGoal = "Backend Developer",
  quizType,
  onComplete,
}: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [showResult, setShowResult] = useState(false);

  // Transition / animation state
  const [transitioning, setTransitioning] = useState(false);
  const [loadingDots, setLoadingDots] = useState(0);
  const [hoveredOption, setHoveredOption] = useState<number | null>(null); // NEW

  // Mock data - will be used as fallback
  const mockQuizQuestions: QuizQuestion[] = [
    {
      question: "Flask là gì trong lập trình web?",
      options: [
        "A. Một ngôn ngữ lập trình",
        "B. Một framework web cho Python",
        "C. Một cơ sở dữ liệu",
        "D. Một công cụ kiểm thử",
      ],
      answer: "B",
    },
    {
      question:
        "Trong Python, lệnh nào được sử dụng để tạo một danh sách (list)?",
      options: ["A. {}", "B. []", "C. ()", "D. <>"],
      answer: "B",
    },
    {
      question:
        "Câu lệnh nào sau đây là đúng để truy cập vào SQLite với Python?",
      options: [
        "A. import sqlite3",
        "B. import mysql",
        "C. import database",
        "D. import sql",
      ],
      answer: "A",
    },
    {
      question: "REST API là gì?",
      options: [
        "A. Một ngôn ngữ lập trình",
        "B. Một kiến trúc cho web services",
        "C. Một cơ sở dữ liệu",
        "D. Một framework frontend",
      ],
      answer: "B",
    },
    {
      question: "Trong Git, lệnh nào dùng để tạo nhánh mới?",
      options: [
        "A. git branch",
        "B. git checkout",
        "C. git commit",
        "D. git init",
      ],
      answer: "A",
    },
  ];

  useEffect(() => {
    let dotsTimer: any;
    if (isLoading) {
      dotsTimer = setInterval(() => setLoadingDots((d) => (d + 1) % 4), 400);
    } else {
      setLoadingDots(0);
    }
    return () => clearInterval(dotsTimer);
  }, [isLoading]);

  useEffect(() => {
    // Generate quiz from backend; fallback to mock on error
    const generateQuiz = async () => {
      setIsLoading(true);

      try {
        const response = await api.generateQuiz({
          profile_text: userProfile,
          career_goal: careerGoal,
          quiz_type: quizType,
        });

        setQuizQuestions(response.quiz);
      } catch (error) {
        // fallback
        setQuizQuestions(mockQuizQuestions);
      } finally {
        // small delay so the loading animation is visible
        setTimeout(() => setIsLoading(false), 400);
      }
    };

    generateQuiz();
  }, [userProfile, careerGoal, quizType]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  // navigate with slide animation
  const goToNext = () => {
    if (!quizQuestions.length) return;
    // check current answer
    if (selectedAnswer === quizQuestions[currentQuestion].answer)
      setScore((s) => s + 1);

    if (currentQuestion < quizQuestions.length - 1) {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentQuestion((q) => q + 1);
        setSelectedAnswer("");
        setTransitioning(false);
      }, 220); // animation duration
    } else {
      const finalScore =
        selectedAnswer === quizQuestions[currentQuestion].answer
          ? score + 1
          : score;
      setScore(finalScore);
      setShowResult(true);
      onComplete(finalScore, quizQuestions.length);
    }
  };

  // Animated question container style helper
  const questionAnimStyle = (visible: boolean) => ({
    transition: "transform .22s ease, opacity .22s ease",
    transform: visible
      ? "translateX(0) translateY(0)"
      : "translateX(-10px) translateY(6px)",
    opacity: visible ? 1 : 0,
  });

  const getQuizTitle = () =>
    quizType === "pre-quiz"
      ? "Pre-Quiz — Assess your current level"
      : "Post-Quiz — Knowledge assessment after learning";

  const currentQ = quizQuestions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto">
      {/* show loader in English */}
      <FullScreenLoader active={isLoading} message="Generating quiz" />

      {/* If still loading you may render a minimal placeholder; overlay covers it */}
      {!isLoading && (
        <>
          {showResult ? (
            <div className="text-center py-8">
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 700,
                  color: "#424874",
                  marginBottom: 16,
                }}
              >
                {score} / {quizQuestions.length}
              </div>

              <h2
                style={{ color: "#424874", fontWeight: 800, marginBottom: 8 }}
              >
                {getQuizTitle()} — Completed!
              </h2>

              <div style={{ color: "#424874", marginBottom: 16 }}>
                {Math.round((score / quizQuestions.length) * 100) >= 70 ? (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      justifyContent: "center",
                    }}
                  >
                    <MdEmojiEvents size={20} color="#424874" />{" "}
                    <span>You have a strong foundation!</span>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      justifyContent: "center",
                    }}
                  >
                    <MdReplay size={20} color="#424874" />{" "}
                    <span>Keep practicing and revising!</span>
                  </div>
                )}
              </div>

              <div
                style={{
                  backgroundColor: "#F4EEFF",
                  border: "1px solid #A6B1E1",
                  borderRadius: 10,
                  padding: 16,
                  marginBottom: 16,
                }}
              >
                <h3
                  style={{
                    color: "#424874",
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  Result summary:
                </h3>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#424874",
                      }}
                    >
                      {score}
                    </div>
                    <div
                      style={{
                        color: "#424874",
                        opacity: 0.9,
                      }}
                    >
                      Correct
                    </div>
                  </div>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#424874",
                      }}
                    >
                      {quizQuestions.length - score}
                    </div>
                    <div
                      style={{
                        color: "#424874",
                        opacity: 0.9,
                      }}
                    >
                      Incorrect
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{ display: "flex", justifyContent: "center", gap: 12 }}
              >
                <Button
                  onClick={() => onComplete(score, quizQuestions.length)}
                  variant="primary"
                >
                  {" "}
                  {quizType === "pre-quiz"
                    ? "View Recommended Courses →"
                    : "View Overview →"}{" "}
                </Button>
                <Button
                  onClick={() => {
                    setShowResult(false);
                    setCurrentQuestion(0);
                    setSelectedAnswer("");
                    setScore(0);
                  }}
                  variant="outline"
                >
                  <MdReplay /> <span>Retake</span>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <h2 style={{ color: "#424874", fontWeight: 800 }}>
                  {getQuizTitle()}
                </h2>
                <div style={{ color: "#424874", opacity: 0.9 }}>
                  Question {currentQuestion + 1}/{quizQuestions.length}
                </div>
              </div>

              {/* Progress bar animated - use theme blue instead of purple */}
              <div
                style={{
                  width: "100%",
                  backgroundColor: colors.primary[100], // was purple
                  height: 8,
                  borderRadius: 999,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: `${
                      ((currentQuestion + 1) / quizQuestions.length) * 100
                    }%`,
                    height: "100%",
                    backgroundColor: colors.primary[400], // stronger blue fill
                    borderRadius: 999,
                    transition: "width .5s ease",
                  }}
                />
              </div>

              {/* Question with slide/fade */}
              <div
                style={{
                  backgroundColor: colors.primary[50],
                  border: `1px solid ${colors.primary[100]}`,
                  borderRadius: 10,
                  padding: 16,
                  marginBottom: 16,
                  overflow: "hidden",
                }}
              >
                <div style={questionAnimStyle(!transitioning)}>
                  <h3
                    style={{
                      color: colors.primary[700],
                      fontWeight: 700,
                      marginBottom: 12,
                    }}
                  >
                    {currentQ.question}
                  </h3>

                  <div style={{ display: "grid", gap: 10 }}>
                    {currentQ.options.map((option, index) => {
                      const optKey = option.charAt(0);
                      const isSelected = selectedAnswer === optKey;
                      const isHovered = hoveredOption === index; // NEW
                      // compute dynamic colors
                      const optionBg = isSelected
                        ? colors.primary[300]
                        : isHovered
                        ? colors.primary[100]
                        : colors.primary[50];
                      const optionBorder = isSelected
                        ? colors.primary[400]
                        : isHovered
                        ? colors.primary[300]
                        : colors.primary[100];
                      const badgeBg = isSelected
                        ? colors.primary[600]
                        : colors.primary[100];
                      const badgeColor = isSelected
                        ? "#fff"
                        : colors.primary[700];

                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(optKey)}
                          aria-pressed={isSelected}
                          onMouseEnter={() => setHoveredOption(index)} // NEW
                          onMouseLeave={() => setHoveredOption(null)} // NEW
                          style={{
                            display: "flex",
                            gap: 12,
                            alignItems: "center",
                            padding: 12,
                            borderRadius: 12,
                            border: `1px solid ${optionBorder}`,
                            backgroundColor: optionBg,
                            color: colors.primary[800],
                            textAlign: "left",
                            boxShadow: isSelected
                              ? "0 6px 18px rgba(50,82,145,0.12)"
                              : "none",
                            transition: "all .18s ease",
                            cursor: "pointer",
                          }}
                        >
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 20,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: badgeBg,
                              color: badgeColor,
                              fontWeight: 700,
                            }}
                          >
                            {optKey}
                          </div>
                          <div style={{ flex: 1 }}>{option}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Navigation (use Button for consistent styling) */}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() =>
                    currentQuestion > 0 &&
                    setCurrentQuestion(currentQuestion - 1)
                  }
                  disabled={currentQuestion === 0}
                >
                  {" "}
                  ← Previous{" "}
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  onClick={goToNext}
                  disabled={!selectedAnswer}
                >
                  {currentQuestion === quizQuestions.length - 1
                    ? "Finish →"
                    : "Next →"}
                </Button>
              </div>

              {/* no external hover CSS needed because hover handled inline via hoveredOption */}
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </>
          )}
        </>
      )}
    </div>
  );
}
