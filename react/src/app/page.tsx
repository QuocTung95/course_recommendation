"use client";

import { useState } from "react";
import Layout from "../components/Layout";
import ProfileUpload from "../components/ProfileUpload";
import QuizComponent from "../components/QuizComponent";
import CourseRecommendations from "../components/CourseRecommendations";
import {
  MdRocketLaunch,
  MdFolder,
  MdSchool,
  MdEmojiEvents,
  MdRefresh,
} from "react-icons/md";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState<string>("");
  const [careerGoal, setCareerGoal] = useState<string>("Backend Developer");
  const [preQuizScore, setPreQuizScore] = useState<{
    score: number;
    total: number;
  } | null>(null);
  const [postQuizScore, setPostQuizScore] = useState<{
    score: number;
    total: number;
  } | null>(null);

  const handleProfileComplete = (profileText: string, career: string) => {
    setUserProfile(profileText);
    setCareerGoal(career);
    setCurrentStep(2); // Chuyển sang Pre-Quiz
  };

  const handlePreQuizComplete = (score: number, total: number) => {
    setPreQuizScore({ score, total });
    setCurrentStep(3); // Chuyển sang Recommendations
  };

  const handlePostQuizComplete = (score: number, total: number) => {
    setPostQuizScore({ score, total });
    setCurrentStep(4); // Chuyển sang Completion
  };

  const handleRetakePreQuiz = () => {
    setCurrentStep(2); // Quay lại Pre-Quiz
  };

  const handleContinueToPostQuiz = () => {
    setCurrentStep(5); // Chuyển sang Post-Quiz
  };

  const resetApp = () => {
    setCurrentStep(0);
    setUserProfile("");
    setCareerGoal("Backend Developer");
    setPreQuizScore(null);
    setPostQuizScore(null);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="flex justify-center px-4">
            <div
              className="relative w-full max-w-[700px] mt-10 mb-12 rounded-[20px] shadow-lg"
              style={{
                backgroundColor: "#F4EEFF",
                padding: 40,
                border: "1px solid rgba(166,177,225,0.25)",
                animation: "fadeInScale .36s ease",
                fontFamily: "Inter, Roboto, Montserrat, sans-serif",
              }}
            >
              {/* low-opacity illustration in corner, non-obtrusive */}
              <div
                style={{
                  position: "absolute",
                  right: 18,
                  top: 18,
                  opacity: 0.04,
                  pointerEvents: "none",
                }}
              >
                <MdSchool size={160} color="#424874" />
              </div>

              {/* Centered content */}
              <div className="flex flex-col items-center text-center gap-6">
                <h2
                  className="font-extrabold"
                  style={{ color: "#424874", fontSize: 26, lineHeight: 1.05 }}
                >
                  Bắt đầu lộ trình cá nhân hóa của bạn
                </h2>

                <p
                  style={{
                    color: "#A6B1E1",
                    fontSize: 15,
                    maxWidth: 560,
                  }}
                >
                  Nhấn Start Journey hoặc Upload CV để hệ thống phân tích
                  profile và sinh Pre-Quiz phù hợp với mục tiêu nghề nghiệp.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center gap-3 rounded-full shadow-md transition transform hover:-translate-y-1"
                    style={{
                      backgroundColor: "#424874",
                      color: "#fff",
                      padding: "14px 28px",
                      borderRadius: 999,
                    }}
                    aria-label="Start Journey"
                  >
                    <MdRocketLaunch size={18} color="#fff" />
                    <span style={{ fontWeight: 700 }}>Start Journey</span>
                  </button>

                  <button
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center gap-3 rounded-full transition transform hover:-translate-y-1"
                    style={{
                      backgroundColor: "#A6B1E1",
                      color: "#424874",
                      padding: "12px 18px",
                      borderRadius: 999,
                    }}
                    aria-label="Upload CV"
                  >
                    <MdFolder size={16} color="#424874" />
                    <span style={{ fontWeight: 600 }}>
                      Upload CV / Nhập Profile
                    </span>
                  </button>
                </div>
              </div>

              <style>{`
                @keyframes fadeInScale {
                  0% { opacity: 0; transform: translateY(8px) scale(.995); }
                  100% { opacity: 1; transform: translateY(0) scale(1); }
                }
              `}</style>
            </div>
          </div>
        );

      case 1:
        return <ProfileUpload onComplete={handleProfileComplete} />;

      case 2:
        return (
          <QuizComponent
            userProfile={userProfile}
            careerGoal={careerGoal}
            quizType="pre-quiz"
            onComplete={handlePreQuizComplete}
          />
        );

      case 3:
        return (
          <CourseRecommendations
            userProfile={userProfile}
            careerGoal={careerGoal}
            quizScore={preQuizScore!}
            onContinue={handleContinueToPostQuiz}
            onRetakeQuiz={handleRetakePreQuiz}
          />
        );

      case 4:
        const preScore = preQuizScore
          ? Math.round((preQuizScore.score / preQuizScore.total) * 100)
          : 0;
        const postScore = postQuizScore
          ? Math.round((postQuizScore.score / postQuizScore.total) * 100)
          : 0;
        const improvement =
          postQuizScore && preQuizScore
            ? postQuizScore.score - preQuizScore.score
            : null;

        return (
          <div className="max-w-4xl mx-auto p-6 sm:p-10 space-y-6">
            <div
              className="rounded-2xl p-6 shadow-inner transform transition duration-500"
              style={{
                backgroundColor: "#DCD6F7",
                border: "1px solid #A6B1E1",
              }}
            >
              <div className="flex items-center space-x-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-sm"
                  style={{ backgroundColor: "#424874", color: "#fff" }}
                >
                  {/* trophy icon */}
                  <MdEmojiEvents size={28} color="#fff" />
                </div>
                <div>
                  <h2
                    className="text-2xl sm:text-3xl font-extrabold"
                    style={{ color: "#424874" }}
                  >
                    Chúc mừng hoàn thành!
                  </h2>
                  <p
                    className="mt-1"
                    style={{ color: "#424874", opacity: 0.9 }}
                  >
                    Bạn đã hoàn thành lộ trình. Dưới đây là tổng quan kết quả và
                    tiến bộ của bạn.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className="rounded-xl p-5 shadow-md"
                style={{
                  backgroundColor: "#F4EEFF",
                  border: "1px solid #A6B1E1",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className="text-sm font-medium"
                      style={{ color: "#424874" }}
                    >
                      Pre-Quiz
                    </h3>
                    <div
                      className="mt-2 text-3xl font-bold"
                      style={{ color: "#424874" }}
                    >
                      {preQuizScore?.score ?? 0}/{preQuizScore?.total ?? 0}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs" style={{ color: "#424874" }}>
                      Tỉ lệ
                    </div>
                    <div
                      className="text-lg font-semibold"
                      style={{ color: "#424874" }}
                    >
                      {preScore}%
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div
                    className="w-full rounded-full h-3 overflow-hidden"
                    style={{ backgroundColor: "#DCD6F7" }}
                  >
                    <div
                      className="h-3 transition-all duration-700"
                      style={{
                        width: `${preScore}%`,
                        backgroundColor: "#A6B1E1",
                      }}
                    />
                  </div>
                  <p className="mt-2 text-xs" style={{ color: "#424874" }}>
                    Điểm thể hiện năng lực ban đầu
                  </p>
                </div>
              </div>

              <div
                className="rounded-xl p-5 shadow-md"
                style={{
                  backgroundColor: "#F4EEFF",
                  border: "1px solid #A6B1E1",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className="text-sm font-medium"
                      style={{ color: "#424874" }}
                    >
                      Post-Quiz
                    </h3>
                    <div
                      className="mt-2 text-3xl font-bold"
                      style={{ color: "#424874" }}
                    >
                      {postQuizScore?.score ?? 0}/{postQuizScore?.total ?? 0}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs" style={{ color: "#424874" }}>
                      Tỉ lệ
                    </div>
                    <div
                      className="text-lg font-semibold"
                      style={{ color: "#424874" }}
                    >
                      {postScore}%
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div
                    className="w-full rounded-full h-3 overflow-hidden"
                    style={{ backgroundColor: "#DCD6F7" }}
                  >
                    <div
                      className="h-3 transition-all duration-700"
                      style={{
                        width: `${postScore}%`,
                        backgroundColor: "#A6B1E1",
                      }}
                    />
                  </div>
                  <p className="mt-2 text-xs" style={{ color: "#424874" }}>
                    Điểm sau khi hoàn thành khóa & ôn tập
                  </p>
                </div>
              </div>
            </div>

            <div
              className="rounded-xl p-5 shadow-sm"
              style={{
                backgroundColor: "#F4EEFF",
                border: "1px solid #A6B1E1",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h4
                    className="text-lg font-semibold"
                    style={{ color: "#424874" }}
                  >
                    Tổng quan tiến bộ
                  </h4>
                  <p className="mt-2" style={{ color: "#424874" }}>
                    {improvement !== null ? (
                      improvement > 0 ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            color: "#424874",
                            fontWeight: 600,
                          }}
                        >
                          <MdEmojiEvents size={20} color="#424874" />
                          Tiến bộ: +{improvement} điểm
                        </span>
                      ) : (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            color: "#424874",
                            fontWeight: 600,
                          }}
                        >
                          <MdRefresh size={20} color="#424874" />
                          Hãy tiếp tục ôn tập để cải thiện
                        </span>
                      )
                    ) : (
                      <span style={{ color: "#424874" }}>
                        Không đủ dữ liệu để tính tiến bộ.
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={resetApp}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-semibold transition bg-[#424874] hover:bg-[#A6B1E1] text-white"
                  >
                    <MdRefresh size={18} color="#fff" />
                    Bắt Đầu Lại
                  </button>

                  <button
                    onClick={() => setCurrentStep(3)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border transition bg-[#F4EEFF] hover:bg-[#DCD6F7] text-[#424874] border-[#A6B1E1]"
                  >
                    Xem lại đề xuất khóa học
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <QuizComponent
            userProfile={userProfile}
            careerGoal={careerGoal}
            quizType="post-quiz"
            onComplete={handlePostQuizComplete}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Layout currentStep={currentStep} totalSteps={5}>
      <div className="py-6">
        <div className="px-4 sm:px-6">{renderStepContent()}</div>

        {/* Footer - professional, centered */}
        <footer className="max-w-5xl mx-auto mt-8 px-4">
          <div
            style={{
              borderTop: "1px solid #DCD6F7",
              backgroundColor: "#F4EEFF",
              paddingTop: 18,
              paddingBottom: 22,
              textAlign: "center",
            }}
          >
            <div style={{ color: "#A6B1E1", fontSize: 13 }}>
              Profile &nbsp;→&nbsp; Pre-Quiz &nbsp;→&nbsp; Recommendations
              &nbsp;→&nbsp; Post-Quiz &nbsp;→&nbsp; Completion
            </div>
            <div style={{ marginTop: 8, color: "#424874", fontSize: 13 }}>
              License by AIA_11_HN – Cháu Ngoan Bác Hồ
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
