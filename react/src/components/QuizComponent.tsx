"use client";

import { api } from "@/lib/api";
import { useState, useEffect } from "react";
import { MdEmojiEvents, MdReplay } from "react-icons/md";

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
      ? "Pre-Quiz - Kiểm tra trình độ hiện tại"
      : "Post-Quiz - Kiểm tra sau khi học";

  if (isLoading) {
    // Loading with dots animation and dynamic text
    const dots = ".".repeat(loadingDots);
    return (
      <div className="text-center py-12">
        <div
          style={{
            margin: "0 auto 12px",
            width: 72,
            height: 72,
            borderRadius: 12,
            background: "#DCD6F7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 6,
                background: "#424874",
                animation: "jump .9s infinite",
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 6,
                background: "#424874",
                animation: "jump .9s .15s infinite",
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 6,
                background: "#424874",
                animation: "jump .9s .3s infinite",
              }}
            />
          </div>
        </div>

        <h3 style={{ color: "#424874", fontWeight: 700, marginTop: 12 }}>
          Hệ thống đang tạo đề kiểm tra phù hợp với hồ sơ của bạn{dots}
        </h3>
        <p style={{ color: "#424874", opacity: 0.9, marginTop: 8 }}>
          Quá trình được tối ưu bằng AI — vui lòng chờ trong giây lát
        </p>

        <style>{`
          @keyframes jump { 0% { transform: translateY(0);} 50% { transform: translateY(-8px);} 100% { transform: translateY(0);} }
        `}</style>
      </div>
    );
  }

  if (showResult) {
    const total = quizQuestions.length || 1;
    const pct = Math.round((score / total) * 100);
    return (
      <div className="text-center py-8">
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 48,
            margin: "0 auto 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: pct >= 70 ? "#A6B1E1" : "#DCD6F7",
            color: "#424874",
            transform: "scale(1.03)",
            transition: "all .3s",
          }}
        >
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {score}/{total}
            </div>
            <div style={{ fontSize: 12, color: "#424874", opacity: 0.9 }}>
              {pct}%
            </div>
          </div>
        </div>

        <h2 style={{ color: "#424874", fontWeight: 800, marginBottom: 8 }}>
          {getQuizTitle()} - Hoàn thành!
        </h2>

        <div style={{ color: "#424874", marginBottom: 16 }}>
          {pct >= 70 ? (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                justifyContent: "center",
              }}
            >
              <MdEmojiEvents size={20} color="#424874" />{" "}
              <span>Bạn có nền tảng khá tốt!</span>
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
              <span>Hãy tiếp tục học tập và ôn luyện!</span>
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
          <h3 style={{ color: "#424874", fontWeight: 700, marginBottom: 8 }}>
            Thống kê kết quả:
          </h3>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#424874" }}>
                {score}
              </div>
              <div style={{ color: "#424874", opacity: 0.9 }}>Câu đúng</div>
            </div>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#424874" }}>
                {total - score}
              </div>
              <div style={{ color: "#424874", opacity: 0.9 }}>Câu sai</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <button
            onClick={() => onComplete(score, total)}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              backgroundColor: "#424874",
              color: "#fff",
            }}
          >
            {quizType === "pre-quiz"
              ? "Xem Khóa Học Được Gợi Ý →"
              : "Xem Kết Quả Tổng Quan →"}
          </button>
          <button
            onClick={() => {
              setShowResult(false);
              setCurrentQuestion(0);
              setSelectedAnswer("");
              setScore(0);
            }}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              backgroundColor: "#F4EEFF",
              border: "1px solid #A6B1E1",
              color: "#424874",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <MdReplay /> <span>Làm lại</span>
          </button>
        </div>
      </div>
    );
  }

  const currentQ = quizQuestions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2 style={{ color: "#424874", fontWeight: 800 }}>{getQuizTitle()}</h2>
        <div style={{ color: "#424874", opacity: 0.9 }}>
          Câu {currentQuestion + 1}/{quizQuestions.length}
        </div>
      </div>

      {/* Progress bar animated */}
      <div
        style={{
          width: "100%",
          backgroundColor: "#DCD6F7",
          height: 8,
          borderRadius: 999,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%`,
            height: "100%",
            backgroundColor: "#A6B1E1",
            borderRadius: 999,
            transition: "width .5s ease",
          }}
        />
      </div>

      {/* Question with slide/fade */}
      <div
        style={{
          backgroundColor: "#F4EEFF",
          border: "1px solid #A6B1E1",
          borderRadius: 10,
          padding: 16,
          marginBottom: 16,
          overflow: "hidden",
        }}
      >
        <div style={questionAnimStyle(!transitioning)}>
          <h3 style={{ color: "#424874", fontWeight: 700, marginBottom: 12 }}>
            {currentQ.question}
          </h3>

          <div style={{ display: "grid", gap: 10 }}>
            {currentQ.options.map((option, index) => {
              const optKey = option.charAt(0);
              const isSelected = selectedAnswer === optKey;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(optKey)}
                  aria-pressed={isSelected}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    padding: 12,
                    borderRadius: 8,
                    border: `1px solid ${isSelected ? "#424874" : "#A6B1E1"}`,
                    backgroundColor: isSelected ? "#A6B1E1" : "#F4EEFF",
                    color: "#424874",
                    textAlign: "left",
                    boxShadow: isSelected
                      ? "0 6px 18px rgba(66,72,116,0.12)"
                      : "none",
                    transition: "all .18s ease",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: isSelected ? "#424874" : "#DCD6F7",
                      color: isSelected ? "#fff" : "#424874",
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

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={() =>
            currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)
          }
          disabled={currentQuestion === 0}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #A6B1E1",
            backgroundColor: "#F4EEFF",
            color: "#424874",
            opacity: currentQuestion === 0 ? 0.6 : 1,
          }}
        >
          ← Câu trước
        </button>

        <button
          onClick={goToNext}
          disabled={!selectedAnswer}
          style={{
            padding: "10px 18px",
            borderRadius: 12,
            backgroundColor: "#424874",
            color: "#fff",
            opacity: !selectedAnswer ? 0.6 : 1,
            boxShadow: "0 8px 24px rgba(66,72,116,0.12)",
          }}
        >
          {currentQuestion === quizQuestions.length - 1
            ? "Kết thúc →"
            : "Câu tiếp theo →"}
        </button>
      </div>
    </div>
  );
}
