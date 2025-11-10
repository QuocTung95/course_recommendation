"use client";

import { api } from "@/lib/api";
import { useState, useEffect } from "react";

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

  // Mock data - sau này sẽ gọi API thật
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
      question: "Trong Python, lệnh nào được sử dụng để tạo một danh sách (list)?",
      options: ["A. {}", "B. []", "C. ()", "D. <>"],
      answer: "B",
    },
    {
      question: "Câu lệnh nào sau đây là đúng để truy cập vào SQLite với Python?",
      options: ["A. import sqlite3", "B. import mysql", "C. import database", "D. import sql"],
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
      options: ["A. git branch", "B. git checkout", "C. git commit", "D. git init"],
      answer: "A",
    },
  ];

  useEffect(() => {
    // Giả lập tạo quiz từ AI (sau này sẽ gọi API thật)
    const generateQuiz = async () => {
      setIsLoading(true);

      try {
        console.log("🔄 Đang tạo quiz từ API...");
        const response = await api.generateQuiz({
          profile_text: userProfile,
          career_goal: careerGoal,
          quiz_type: quizType,
        });

        setQuizQuestions(response.quiz);
        console.log("✅ Đã nhận quiz từ API:", response.quiz.length, "câu hỏi");
      } catch (error) {
        console.error("❌ Lỗi khi tạo quiz từ API:", error);
        // Fallback to mock data
        setQuizQuestions(mockQuizQuestions);
      } finally {
        setIsLoading(false);
      }
    };

    generateQuiz();
  }, [userProfile, careerGoal]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    // Kiểm tra đáp án
    if (selectedAnswer === quizQuestions[currentQuestion].answer) {
      setScore(score + 1);
    }

    // Chuyển câu hỏi hoặc kết thúc quiz
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
    } else {
      setShowResult(true);
      const finalScore = selectedAnswer === quizQuestions[currentQuestion].answer ? score + 1 : score;
      onComplete(finalScore, quizQuestions.length);
    }
  };

  const getQuizTitle = () => {
    return quizType === "pre-quiz" ? "Pre-Quiz - Kiểm tra trình độ hiện tại" : "Post-Quiz - Kiểm tra sau khi học";
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-700">Đang tạo bài quiz...</h3>
        <p className="text-gray-500 mt-2">Hệ thống đang tạo bài kiểm tra phù hợp với profile của bạn</p>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="text-center py-8">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            score >= quizQuestions.length / 2 ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
          }`}
        >
          <span className="text-2xl font-bold">
            {score}/{quizQuestions.length}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">{getQuizTitle()} - Hoàn thành!</h2>

        <p className="text-gray-600 mb-6">
          {score >= quizQuestions.length / 2 ? "🎉 Bạn có nền tảng khá tốt!" : "💪 Hãy tiếp tục học tập và ôn luyện!"}
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Thống kê kết quả:</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{score}</div>
              <div className="text-gray-500">Câu đúng</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{quizQuestions.length - score}</div>
              <div className="text-gray-500">Câu sai</div>
            </div>
          </div>
        </div>

        <button
          onClick={() => onComplete(score, quizQuestions.length)}
          className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-semibold"
        >
          {quizType === "pre-quiz" ? "Xem Khóa Học Được Gợi Ý →" : "Xem Kết Quả Tổng Quan →"}
        </button>
      </div>
    );
  }

  const currentQ = quizQuestions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">{getQuizTitle()}</h2>
        <div className="text-sm text-gray-500">
          Câu {currentQuestion + 1}/{quizQuestions.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentQ.question}</h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option.charAt(0))}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedAnswer === option.charAt(0)
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span className="font-medium">{option}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
          disabled={currentQuestion === 0}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Câu trước
        </button>

        <button
          onClick={handleNextQuestion}
          disabled={!selectedAnswer}
          className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
        >
          {currentQuestion === quizQuestions.length - 1 ? "Kết thúc →" : "Câu tiếp theo →"}
        </button>
      </div>
    </div>
  );
}
