// app/page.tsx (updated)
"use client";

import { useState } from "react";
import Layout from "../components/Layout";
import ProfileUpload from "../components/ProfileUpload";
import QuizComponent from "../components/QuizComponent";
import CourseRecommendations from "../components/CourseRecommendations";
import CompletionScreen from "../components/CompletionScreen";
import WelcomeScreen from "../components/WelcomeScreen";
import { MdRocketLaunch, MdFolder, MdSchool } from "react-icons/md";
import { colors, gradients } from "@/theme/colors";
import Button from "../components/ui/Button";

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
  const [profileAnalysis, setProfileAnalysis] = useState<any>(null);

  const handleProfileComplete = (
    profileText: string,
    career: string,
    analysis?: any
  ) => {
    setUserProfile(profileText);
    setCareerGoal(career);
    setProfileAnalysis(analysis);
    setCurrentStep(2); // Pre-Quiz
  };

  const handlePreQuizComplete = (score: number, total: number) => {
    setPreQuizScore({ score, total });
    setCurrentStep(3); // Recommendations
  };

  const handlePostQuizComplete = (score: number, total: number) => {
    setPostQuizScore({ score, total });
    setCurrentStep(4); // Completion
  };

  const handleRetakePreQuiz = () => {
    setCurrentStep(2);
  };

  const handleContinueToPostQuiz = () => {
    setCurrentStep(5); // Post-Quiz
  };

  const resetApp = () => {
    setCurrentStep(0);
    setUserProfile("");
    setCareerGoal("Backend Developer");
    setPreQuizScore(null);
    setPostQuizScore(null);
    setProfileAnalysis(null);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        // Show the full Welcome hero (imported component). WelcomeScreen will call onGetStarted
        return <WelcomeScreen onGetStarted={() => setCurrentStep(1)} />;

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
            profileAnalysis={profileAnalysis}
            quizScore={preQuizScore!}
            onContinue={handleContinueToPostQuiz}
            onRetakeQuiz={handleRetakePreQuiz}
          />
        );

      case 4:
        return (
          <CompletionScreen
            preQuizScore={preQuizScore}
            postQuizScore={postQuizScore}
            onRestart={resetApp}
            onViewCourses={() => setCurrentStep(3)}
          />
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
      <div className="">{renderStepContent()}</div>
    </Layout>
  );
}
