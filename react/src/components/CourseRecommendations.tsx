"use client";

import { useState, useEffect } from "react";
import { api, Course } from "@/lib/api";
import Card from "./ui/Card";
import FullScreenLoader from "./ui/FullScreenLoader";
import Button from "./ui/Button";
import { colors } from "@/theme/colors";
import {
  MdEmojiEvents,
  MdThumbUp,
  MdLightbulb,
  MdWhatshot,
  MdMenuBook,
  MdInfo,
  MdSearch,
  MdPerson,
  MdStar,
  MdAccessTime,
  MdCheckCircle,
} from "react-icons/md";
import { FiTarget, FiAward } from "react-icons/fi";

interface CourseRecommendationsProps {
  userProfile: string;
  careerGoal: string;
  profileAnalysis?: any; // optional analysis object (added)
  quizScore: { score: number; total: number };
  onContinue: () => void;
  onRetakeQuiz: () => void;
}

export default function CourseRecommendations({
  userProfile,
  careerGoal,
  profileAnalysis, // added to destructure prop
  quizScore,
  onContinue,
  onRetakeQuiz,
}: CourseRecommendationsProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const payload: Record<string, any> = {
          profile_text: userProfile,
          career_goal: careerGoal,
        };
        if (profileAnalysis) payload.profile_analysis = profileAnalysis;

        // Safe call: prefer api.recommendCourses if available, otherwise POST to /api/recommend-courses
        let response: any;
        if (typeof (api as any)?.recommendCourses === "function") {
          response = await (api as any).recommendCourses(payload);
        } else {
          const res = await fetch("/api/recommend-courses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          response = res.ok ? await res.json() : { data: [] };
        }

        // Normalize possible response shapes into coursesList array
        const resAny = response as any;
        let coursesList: Course[] = [];
        if (Array.isArray(resAny)) {
          coursesList = resAny;
        } else if (Array.isArray(resAny?.courses)) {
          coursesList = resAny.courses;
        } else if (Array.isArray(resAny?.data?.courses)) {
          coursesList = resAny.data.courses;
        } else if (Array.isArray(resAny?.data)) {
          coursesList = resAny.data;
        } else {
          coursesList = [];
        }

        setCourses(coursesList);
      } catch (err) {
        setError("Cannot load courses. Please try again.");
        setCourses(getFallbackCourses());
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [userProfile, careerGoal, profileAnalysis]);

  const getFallbackCourses = (): Course[] => {
    return [
      {
        course_title: "Python for Beginners",
        text: "Learn Python programming from scratch. Covers variables, loops, functions, and simple projects.",
        similarity: 0.95,
      },
      {
        course_title: "Web Development with Flask",
        text: "Build web applications with Flask framework. Covers routing, templates, databases, and deployment.",
        similarity: 0.88,
      },
      {
        course_title: "Advanced Python Programming",
        text: "Deep dive into Python advanced topics: decorators, generators, context managers, and optimization.",
        similarity: 0.82,
      },
    ];
  };

  const getPerformanceFeedbackText = () => {
    const percentage = (quizScore.score / quizScore.total) * 100;
    if (percentage >= 80)
      return "🎉 Excellent! You have a strong foundation for this learning path.";
    if (percentage >= 60)
      return "👍 Good! You have a solid foundational knowledge.";
    return "💪 Needs improvement. The following courses will help you build a solid foundation.";
  };

  const feedbackText = getPerformanceFeedbackText();

  if (error) {
    return (
      <div className="text-center py-12">
        <div
          style={{
            backgroundColor: colors.primary[200],
            border: `1px solid ${colors.primary[100]}`,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <h3
            style={{
              color: colors.primary[700],
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            Error
          </h3>
          <p style={{ color: colors.primary[700] }}>{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: colors.primary[500],
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 8,
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  // update stat color for Post-Quiz fallback to primary[300]

  const stats = [
    {
      icon: <FiTarget className="w-5 h-5" />,
      label: "Pre-Quiz Score",
      value: `${quizScore.score}/${quizScore.total}`,
      percentage: (quizScore.score / quizScore.total) * 100,
      color: colors.primary[500],
    },
    {
      icon: <FiAward className="w-5 h-5" />,
      label: "Post-Quiz Score",
      value: `${quizScore.score}/${quizScore.total}`,
      percentage: (quizScore.score / quizScore.total) * 100,
      // replaced accent.purple -> primary[300]
      color: colors.primary[300],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <FullScreenLoader
        active={isLoading}
        message="Generating course recommendations"
      />

      <div className="text-center mb-6">
        <h2
          style={{ color: colors.primary[700], fontWeight: 800, fontSize: 20 }}
        >
          Recommended Courses
        </h2>
        <p style={{ color: colors.primary[600], opacity: 0.9 }}>
          Personalized suggestions based on your profile and pre-quiz results
        </p>
      </div>

      {/* Performance Summary */}
      <div
        style={{
          backgroundColor: colors.primary[200],
          border: `1px solid ${colors.primary[100]}`,
          borderRadius: 12,
          padding: 14,
          marginBottom: 18,
          marginLeft: 50,
          marginRight: 50,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div>
            <h3 style={{ color: colors.primary[700], fontWeight: 700 }}>
              Pre-Quiz Result: {quizScore.score}/{quizScore.total} (
              {Math.round((quizScore.score / quizScore.total) * 100)}%)
            </h3>
            <p style={{ color: colors.primary[700], marginTop: 6 }}>
              {feedbackText}
            </p>
          </div>
          <div style={{ fontSize: 28, color: "#424874" }}>
            {/* icon based on performance */}
            {quizScore.score >= Math.ceil(quizScore.total * 0.8) ? (
              <MdEmojiEvents />
            ) : quizScore.score >= Math.ceil(quizScore.total * 0.6) ? (
              <MdThumbUp />
            ) : (
              <MdLightbulb />
            )}
          </div>
        </div>
      </div>

      {/* Course Grid - updated styles: blue palette, larger gap, better card content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {courses.map((course, index) => {
          const isSelected = selectedCourse === course.course_title;

          // fallback arrays when course doesn't provide structured fields
          const outcomes = (course as any).outcomes ?? [
            "Understand core concepts",
            "Build a small real-world project",
            "Deploy to production",
          ];
          const requirements = (course as any).requirements ?? [
            "Basic programming knowledge",
            "Familiarity with web fundamentals",
          ];
          const audience = (course as any).audience ?? [
            "Beginners aiming for Backend roles",
            "Junior devs seeking practical experience",
          ];

          return (
            <Card
              key={index}
              hover
              onClick={() =>
                setSelectedCourse(isSelected ? null : course.course_title)
              }
              className="p-5 cursor-pointer transition-all"
              style={{
                marginBottom: 20,
                marginLeft: 50,
                marginRight: 50,
                // border: `1px solid ${colors.neutral[200]}`,
              }}
            >
              <div
                style={{
                  backgroundColor: "rgba(255,255,255,0.98)",
                  border: `1px solid ${colors.primary[100]}`,
                  borderRadius: 14,
                  padding: 18,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {/* Title */}
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: 900,
                      color: colors.primary[700],
                    }}
                  >
                    {course.course_title}
                  </h3>
                  <p
                    style={{
                      margin: "8px 0 0",
                      color: colors.neutral[500],
                      fontSize: 14,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {course.text}
                  </p>
                </div>

                {/* Metadata row translated */}
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    flexWrap: "wrap",
                    marginTop: 8,
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: colors.primary[50],
                      border: `1px solid ${colors.primary[100]}`,
                    }}
                  >
                    <MdPerson style={{ color: colors.primary[600] }} />
                    <span
                      style={{ fontWeight: 700, color: colors.primary[700] }}
                    >
                      Instructor
                    </span>
                    <span style={{ color: colors.primary[600], marginLeft: 6 }}>
                      Expert Instructor
                    </span>
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: colors.primary[50],
                      border: `1px solid ${colors.primary[100]}`,
                    }}
                  >
                    <MdStar style={{ color: colors.primary[600] }} />{" "}
                    <strong style={{ color: colors.primary[700] }}>4.6</strong>
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: colors.primary[50],
                      border: `1px solid ${colors.primary[100]}`,
                    }}
                  >
                    <MdAccessTime style={{ color: colors.primary[600] }} />{" "}
                    <span
                      style={{ color: colors.primary[700], fontWeight: 700 }}
                    >
                      12h
                    </span>
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: colors.primary[50],
                      border: `1px solid ${colors.primary[100]}`,
                    }}
                  >
                    <span
                      style={{ color: colors.primary[600], fontWeight: 700 }}
                    >
                      Level
                    </span>{" "}
                    <strong style={{ color: colors.primary[700] }}>
                      Intermediate
                    </strong>
                  </div>
                </div>

                {/* Two-column details: Outcomes / Requirements / Audience — translate headings */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 18,
                    marginTop: 8,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 800,
                        color: colors.primary[700],
                        marginBottom: 8,
                      }}
                    >
                      Learning Outcomes
                    </div>
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: 18,
                        color: colors.primary[600],
                        display: "grid",
                        gap: 8,
                      }}
                    >
                      {outcomes.map((o, i) => (
                        <li
                          key={i}
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "flex-start",
                          }}
                        >
                          <MdCheckCircle
                            style={{
                              color: colors.primary[300],
                              marginTop: 4,
                            }}
                          />
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div
                      style={{
                        fontWeight: 800,
                        color: colors.primary[700],
                        marginBottom: 8,
                      }}
                    >
                      Requirements
                    </div>
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: 18,
                        color: colors.primary[600],
                        display: "grid",
                        gap: 8,
                        marginBottom: 12,
                      }}
                    >
                      {requirements.map((r, i) => (
                        <li
                          key={i}
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "flex-start",
                          }}
                        >
                          <MdCheckCircle
                            style={{
                              color: colors.primary[300],
                              marginTop: 4,
                            }}
                          />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>

                    <div
                      style={{
                        fontWeight: 800,
                        color: colors.primary[700],
                        marginBottom: 8,
                      }}
                    >
                      Target Audience
                    </div>
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: 18,
                        color: colors.primary[600],
                        display: "grid",
                        gap: 8,
                      }}
                    >
                      {audience.map((a, i) => (
                        <li
                          key={i}
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "flex-start",
                          }}
                        >
                          <MdCheckCircle
                            style={{
                              color: colors.primary[300],
                              marginTop: 4,
                            }}
                          />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* KEEP "Why this fits you" block but in English */}
                {isSelected && (
                  <div
                    style={{
                      marginTop: 6,
                      padding: 14,
                      backgroundColor: colors.primary[50],
                      border: `1px solid ${colors.primary[100]}`,
                      borderRadius: 10,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    <h4
                      style={{
                        color: colors.primary[700],
                        fontWeight: 800,
                        margin: 0,
                      }}
                    >
                      Why this is a good fit
                    </h4>
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: 16,
                        color: colors.primary[700],
                      }}
                    >
                      <li style={{ marginBottom: 6 }}>
                        Matches your goal to become{" "}
                        <strong>{careerGoal}</strong>
                      </li>
                      <li style={{ marginBottom: 6 }}>
                        Addresses gaps found in your quiz
                      </li>
                      <li style={{ marginBottom: 6 }}>
                        Aligns with your current experience
                      </li>
                    </ul>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <Button
                        size="md"
                        variant="primary"
                        onClick={() => {
                          /* start learning */
                        }}
                      >
                        <MdMenuBook /> <span>Start Learning Now</span>
                      </Button>

                      <Button
                        size="md"
                        variant="outline"
                        onClick={() => {
                          /* view syllabus */
                        }}
                      >
                        <MdInfo /> <span>View Detailed Syllabus</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons translated */}
      <div
        style={{
          marginTop: 18,
          display: "flex",
          gap: 12,
          justifyContent: "space-between",
          flexWrap: "wrap",
          marginLeft: 50,
          marginRight: 50,
        }}
      >
        <Button variant="outline" onClick={onRetakeQuiz}>
          <MdMenuBook /> <span>Retake Pre-Quiz</span>
        </Button>
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            variant="outline"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <MdSearch /> <span>Review profile</span>
          </Button>
          <Button variant="primary" onClick={onContinue}>
            Continue to Post-Quiz{" "}
            <span style={{ fontSize: 12, marginLeft: 8 }}>(Post-Quiz)</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
