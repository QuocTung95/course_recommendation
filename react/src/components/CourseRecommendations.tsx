"use client";

import { useState, useEffect } from "react";
import { api, Course } from "@/lib/api";
import Card from "./ui/Card";
import {
  MdEmojiEvents,
  MdThumbUp,
  MdLightbulb,
  MdWhatshot,
  MdMenuBook,
  MdInfo,
  MdSearch,
} from "react-icons/md";

interface CourseRecommendationsProps {
  userProfile: string;
  careerGoal: string;
  quizScore: { score: number; total: number };
  onContinue: () => void;
  onRetakeQuiz: () => void;
}

export default function CourseRecommendations({
  userProfile,
  careerGoal,
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
        const response = await api.recommendCourses({
          profile_text: userProfile,
          career_goal: careerGoal,
        });

        setCourses(response.courses);
      } catch (err) {
        setError("Không thể tải khóa học. Vui lòng thử lại.");
        setCourses(getFallbackCourses());
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [userProfile, careerGoal]);

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
      return "🎉 Xuất sắc! Bạn có nền tảng rất tốt cho lộ trình học tập.";
    if (percentage >= 60)
      return "👍 Tốt! Bạn đã có kiến thức nền tảng vững chắc.";
    return "💪 Cần cải thiện! Các khóa học dưới đây sẽ giúp bạn xây dựng nền tảng vững chắc.";
  };

  const feedbackText = getPerformanceFeedbackText();

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div
          className="mx-auto mb-4"
          style={{
            width: 48,
            height: 48,
            borderTop: "3px solid #424874",
            borderLeft: "3px solid transparent",
            borderRight: "3px solid transparent",
            borderBottom: "3px solid transparent",
            borderRadius: "50%",
          }}
        />
        <h3 style={{ color: "#424874", fontWeight: 600 }}>
          Đang phân tích và gợi ý khóa học...
        </h3>
        <p
          style={{
            color: "#424874",
            opacity: 0.9,
            marginTop: 8,
          }}
        >
          Dựa trên profile và kết quả quiz của bạn
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div
          style={{
            backgroundColor: "#DCD6F7",
            border: "1px solid #A6B1E1",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <h3
            style={{
              color: "#424874",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            Lỗi
          </h3>
          <p style={{ color: "#424874" }}>{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: "#424874",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 8,
          }}
        >
          Thử Lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-6">
        <h2
          style={{
            color: "#424874",
            fontWeight: 800,
            fontSize: 20,
          }}
        >
          Khóa Học Được Gợi Ý
        </h2>
        <p
          style={{
            color: "#424874",
            opacity: 0.9,
          }}
        >
          Phân tích dựa trên profile và kết quả Pre-Quiz của bạn
        </p>
      </div>

      {/* Performance Summary */}
      <div
        style={{
          backgroundColor: "#DCD6F7",
          border: "1px solid #A6B1E1",
          borderRadius: 12,
          padding: 14,
          marginBottom: 18,
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
            <h3
              style={{
                color: "#424874",
                fontWeight: 700,
              }}
            >
              Kết quả Pre-Quiz: {quizScore.score}/{quizScore.total} (
              {Math.round((quizScore.score / quizScore.total) * 100)}%)
            </h3>
            <p
              style={{
                color: "#424874",
                marginTop: 6,
              }}
            >
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

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {courses.map((course, index) => {
          const isSelected = selectedCourse === course.course_title;
          return (
            <Card
              key={index}
              hover
              onClick={() =>
                setSelectedCourse(isSelected ? null : course.course_title)
              }
              className={`p-5 cursor-pointer transition-all ${
                isSelected ? "" : ""
              }`}
            >
              <div
                style={{
                  backgroundColor: isSelected ? "#DCD6F7" : "#F4EEFF",
                  border: "1px solid #A6B1E1",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
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
                        backgroundColor: "#A6B1E1",
                        color: "#424874",
                        fontWeight: 700,
                      }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h3
                        style={{
                          color: "#424874",
                          fontWeight: 700,
                        }}
                      >
                        {course.course_title}
                      </h3>
                      {course.similarity && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: 8,
                          }}
                        >
                          <div
                            style={{
                              width: 112,
                              height: 8,
                              backgroundColor: "#DCD6F7",
                              borderRadius: 999,
                              marginRight: 8,
                            }}
                          >
                            <div
                              style={{
                                width: `${(course.similarity ?? 0) * 100}%`,
                                height: "100%",
                                backgroundColor: "#A6B1E1",
                                borderRadius: 999,
                                transition: "width 0.5s",
                              }}
                            />
                          </div>
                          <span
                            style={{
                              color: "#424874",
                              opacity: 0.9,
                              fontSize: 13,
                            }}
                          >
                            {Math.round((course.similarity ?? 0) * 100)}% phù
                            hợp
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      color: "#424874",
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    {index === 0 && (
                      <>
                        <MdWhatshot color="#424874" />
                        <span style={{ fontSize: 12 }}>Đề xuất hàng đầu</span>
                      </>
                    )}
                  </div>
                </div>

                <p
                  style={{
                    color: "#424874",
                    marginTop: 12,
                    lineHeight: 1.45,
                  }}
                >
                  {course.text}
                </p>

                {isSelected && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: 12,
                      backgroundColor: "#F4EEFF",
                      border: "1px solid #A6B1E1",
                      borderRadius: 10,
                    }}
                  >
                    <h4
                      style={{
                        color: "#424874",
                        fontWeight: 700,
                        marginBottom: 8,
                      }}
                    >
                      Tại sao phù hợp với bạn?
                    </h4>
                    <ul
                      style={{
                        color: "#424874",
                        opacity: 0.95,
                        marginBottom: 12,
                      }}
                    >
                      <li
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <MdThumbUp />
                        <span>
                          Phù hợp với mục tiêu trở thành{" "}
                          <strong>{careerGoal}</strong>
                        </span>
                      </li>
                      <li
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <MdLightbulb />
                        <span>Bổ sung kiến thức từ kết quả quiz của bạn</span>
                      </li>
                      <li
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <MdInfo />
                        <span>
                          Phù hợp với kinh nghiệm hiện tại trong profile
                        </span>
                      </li>
                    </ul>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        style={{
                          backgroundColor: "#424874",
                          color: "#fff",
                          padding: "8px 12px",
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <MdMenuBook /> <span>Bắt Đầu Học Ngay</span>
                      </button>
                      <button
                        style={{
                          backgroundColor: "#F4EEFF",
                          border: "1px solid #A6B1E1",
                          color: "#424874",
                          padding: "8px 12px",
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <MdInfo /> <span>Xem Chi Tiết Syllabus</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          borderTop: `1px solid #A6B1E1`,
          paddingTop: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={onRetakeQuiz}
            style={{
              flex: "1 0 auto",
              padding: "10px 16px",
              borderRadius: 8,
              backgroundColor: "#F4EEFF",
              border: "1px solid #A6B1E1",
              color: "#424874",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <MdMenuBook /> <span>Làm Lại Pre-Quiz</span>
          </button>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                backgroundColor: "#F4EEFF",
                border: "1px solid #A6B1E1",
                color: "#424874",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <MdSearch /> <span>Xem lại profile</span>
            </button>
            <button
              onClick={onContinue}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                backgroundColor: "#424874",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>Tiếp Tục Học Tập</span>{" "}
              <span style={{ fontSize: 12, marginLeft: 8 }}>(Post-Quiz)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
