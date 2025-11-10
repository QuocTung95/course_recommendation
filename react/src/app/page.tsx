"use client";

import { useState } from "react";
import Layout from "../components/Layout";
import ProfileUpload from "../components/ProfileUpload";
import QuizComponent from "../components/QuizComponent";
import CourseRecommendations from "../components/CourseRecommendations";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState<string>("");
  const [careerGoal, setCareerGoal] = useState<string>("Backend Developer");
  const [preQuizScore, setPreQuizScore] = useState<{ score: number; total: number } | null>(null);
  const [postQuizScore, setPostQuizScore] = useState<{ score: number; total: number } | null>(null);

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
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Chào mừng đến với RAG Learning Assistant!</h2>
            <p className="text-gray-600 mb-8 text-lg">Hệ thống sẽ đọc profile/CV của bạn và gợi ý khóa học phù hợp</p>
            <button onClick={() => setCurrentStep(1)} className="btn-primary text-lg px-10 py-4">
              🚀 Bắt Đầu Hành Trình →
            </button>
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
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🎉 Chúc mừng hoàn thành!</h2>
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Kết quả tổng quan</h3>
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {preQuizScore?.score}/{preQuizScore?.total}
                    </div>
                    <div className="text-gray-600">Pre-Quiz</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {postQuizScore?.score}/{postQuizScore?.total}
                    </div>
                    <div className="text-gray-600">Post-Quiz</div>
                  </div>
                </div>
                {postQuizScore && preQuizScore && (
                  <div className="mt-6 text-center">
                    <p className="text-gray-700 font-semibold">
                      {postQuizScore.score > preQuizScore.score
                        ? `🎉 Tiến bộ: +${postQuizScore.score - preQuizScore.score} điểm!`
                        : "💪 Hãy tiếp tục ôn tập!"}
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={resetApp}
                className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-semibold"
              >
                🏠 Bắt Đầu Lại
              </button>
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
      {renderStepContent()}
    </Layout>
  );
}
