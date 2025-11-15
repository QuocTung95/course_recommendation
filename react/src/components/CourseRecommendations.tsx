"use client";

import { useState, useEffect, JSX } from "react";
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
  MdOpenInNew,
} from "react-icons/md";
import { FiTarget, FiAward } from "react-icons/fi";

interface CourseRecommendationsProps {
  userProfile: string;
  careerGoal: string;
  profileAnalysis?: any;
  quizScore: { score: number; total: number };
  onContinue: () => void;
  onRetakeQuiz: () => void;
}

interface Assessment {
  level: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  overallFeedback: string;
  icon: JSX.Element;
  color: string;
}

export default function CourseRecommendations({
  userProfile,
  careerGoal,
  profileAnalysis,
  quizScore,
  onContinue,
  onRetakeQuiz,
}: CourseRecommendationsProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);

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

        let response: any;
        if (typeof (api as any)?.recommendCourses === "function") {
          response = await (api as any).recommendCourses(payload);
        } else {
          const res = await fetch("http://localhost:8000/api/recommend-courses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          response = res.ok ? await res.json() : { courses: [] };
        }

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

        // Tạo assessment dựa trên profile analysis và quiz score
        generateAssessment(profileAnalysis, quizScore, careerGoal);
      } catch (err) {
        setError("Không thể tải khóa học. Vui lòng thử lại.");
        setCourses(getFallbackCourses());
        generateAssessment(profileAnalysis, quizScore, careerGoal);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [userProfile, careerGoal, profileAnalysis, quizScore]);

  const generateAssessment = (profile: any, quiz: any, goal: string) => {
    const experience = profile?.experience_level || "intermediate";
    const skills = profile?.extracted_skills || [];
    const quizPercentage = (quiz.score / quiz.total) * 100;

    let level = "Người mới bắt đầu";
    let strengths: string[] = [];
    let weaknesses: string[] = [];
    let recommendations: string[] = [];
    let overallFeedback = "";
    let icon = <MdLightbulb />;
    let color = colors.primary[400];

    // Xác định level và đánh giá dựa trên profile và quiz
    if (experience === "advanced" || quizPercentage >= 80) {
      level = "Trình độ Nâng cao";
      icon = <MdEmojiEvents />;
      color = colors.success[500];
      strengths = ["Nền tảng kỹ thuật vững chắc", "Kinh nghiệm thực tế phong phú", "Khả năng giải quyết vấn đề tốt"];
      weaknesses = ["Cần cập nhật công nghệ mới nhất", "Có thể thiếu kinh nghiệm với hệ thống quy mô lớn"];
      recommendations = [
        "Học các công nghệ hiện đại và best practices",
        "Phát triển kỹ năng kiến trúc hệ thống",
        "Tham gia các dự án phức tạp hơn",
      ];
      overallFeedback =
        "Bạn đã có nền tảng xuất sắc! Hãy tập trung vào các kỹ năng chuyên sâu để trở thành chuyên gia.";
    } else if (experience === "intermediate" || quizPercentage >= 60) {
      level = "Trình độ Trung cấp";
      icon = <MdThumbUp />;
      color = colors.primary[500];
      strengths = ["Hiểu biết cơ bản vững vàng", "Có kinh nghiệm với các dự án nhỏ", "Khả năng học hỏi nhanh"];
      weaknesses = [
        "Cần củng cố kiến thức nâng cao",
        "Thiếu kinh nghiệm với hệ thống phân tán",
        "Cần cải thiện kỹ năng debugging",
      ];
      recommendations = [
        "Học sâu về design patterns và architecture",
        "Thực hành với các dự án thực tế",
        "Phát triển kỹ năng optimization",
      ];
      overallFeedback = "Bạn đang ở giai đoạn phát triển tốt! Hãy xây dựng nền tảng vững chắc cho sự nghiệp.";
    } else {
      level = "Người mới bắt đầu";
      icon = <MdLightbulb />;
      color = colors.primary[400];
      strengths = ["Tinh thần học hỏi cao", "Không bị ảnh hưởng bởi thói quen cũ", "Có thể tiếp cận từ fundamentals"];
      weaknesses = ["Thiếu kinh nghiệm thực tế", "Cần xây dựng nền tảng cơ bản", "Chưa thành thạo debugging"];
      recommendations = [
        "Bắt đầu với khóa học cơ bản vững chắc",
        "Thực hành thường xuyên với bài tập nhỏ",
        "Xây dựng project cá nhân đầu tiên",
      ];
      overallFeedback = "Đây là thời điểm hoàn hảo để bắt đầu! Hãy xây dựng nền tảng thật vững chắc.";
    }

    // Thêm strengths từ skills nếu có
    if (skills.length > 0) {
      strengths.push(`Đã có kinh nghiệm với: ${skills.slice(0, 3).join(", ")}`);
    }

    setAssessment({
      level,
      strengths,
      weaknesses,
      recommendations,
      overallFeedback,
      icon,
      color,
    });
  };

  const getFallbackCourses = (): Course[] => {
    return [
      {
        course_title: "Python for Beginners",
        text: "Learn Python programming from scratch. Covers variables, loops, functions, and simple projects.",
        similarity: 0.95,
        url: "https://www.udemy.com/course/python-for-beginners/",
        instructor: "Expert Instructor",
        level: "Beginner",
        rating: 4.6,
        duration: "15 hours",
      },
      {
        course_title: "Web Development with Flask",
        text: "Build web applications with Flask framework. Covers routing, templates, databases, and deployment.",
        similarity: 0.88,
        url: "https://www.udemy.com/course/flask-web-development/",
        instructor: "Senior Developer",
        level: "Intermediate",
        rating: 4.5,
        duration: "12 hours",
      },
      {
        course_title: "Advanced Python Programming",
        text: "Deep dive into Python advanced topics: decorators, generators, context managers, and optimization.",
        similarity: 0.82,
        url: "https://www.udemy.com/course/advanced-python-programming/",
        instructor: "Python Expert",
        level: "Advanced",
        rating: 4.7,
        duration: "18 hours",
      },
    ];
  };

  const handleStartLearning = (course: Course) => {
    if (course.url && course.url !== "#") {
      window.open(course.url, "_blank", "noopener,noreferrer");
    } else {
      // Fallback: tìm kiếm trên Udemy với course title
      const searchQuery = encodeURIComponent(course.course_title);
      window.open(`https://www.udemy.com/courses/search/?q=${searchQuery}`, "_blank", "noopener,noreferrer");
    }
  };

  if (isLoading) {
    return <FullScreenLoader message="Đang phân tích và gợi ý khóa học phù hợp..." />;
  }

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
            Lỗi
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
          Thử Lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2
          style={{
            color: colors.primary[700],
            fontWeight: 800,
            fontSize: 24,
          }}
        >
          Lộ Trình Học Tập Cá Nhân Hóa
        </h2>
        <p
          style={{
            color: colors.primary[600],
            opacity: 0.9,
          }}
        >
          Được thiết kế riêng dựa trên phân tích profile và mục tiêu của bạn
        </p>
      </div>

      {/* Assessment Section - Thay thế Pre-Quiz Score */}
      {assessment && (
        <div
          style={{
            backgroundColor: colors.primary[50],
            border: `2px solid ${assessment.color}`,
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            marginLeft: 20,
            marginRight: 20,
          }}
        >
          <div className="flex items-start gap-4">
            <div
              style={{
                backgroundColor: assessment.color,
                color: "white",
                borderRadius: 12,
                padding: 12,
                fontSize: 24,
              }}
            >
              {assessment.icon}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3
                  style={{
                    color: colors.primary[700],
                    fontWeight: 800,
                    fontSize: 18,
                    margin: 0,
                  }}
                >
                  Đánh Giá Trình Độ: {assessment.level}
                </h3>
                <span
                  style={{
                    backgroundColor: assessment.color,
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {careerGoal}
                </span>
              </div>

              <p
                style={{
                  color: colors.primary[700],
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                {assessment.overallFeedback}
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Điểm mạnh */}
                <div>
                  <h4
                    style={{
                      color: colors.success[600],
                      fontWeight: 700,
                      marginBottom: 8,
                    }}
                  >
                    💪 Điểm mạnh
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: 16, color: colors.primary[700] }}>
                    {assessment.strengths.map((strength, index) => (
                      <li key={index} style={{ marginBottom: 4 }}>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Điểm cần cải thiện */}
                <div>
                  <h4
                    style={{
                      color: colors.warning[600],
                      fontWeight: 700,
                      marginBottom: 8,
                    }}
                  >
                    🎯 Điểm cần cải thiện
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: 16, color: colors.primary[700] }}>
                    {assessment.weaknesses.map((weakness, index) => (
                      <li key={index} style={{ marginBottom: 4 }}>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Khuyến nghị */}
                <div>
                  <h4
                    style={{
                      color: colors.primary[600],
                      fontWeight: 700,
                      marginBottom: 8,
                    }}
                  >
                    📝 Khuyến nghị học tập
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: 16, color: colors.primary[700] }}>
                    {assessment.recommendations.map((rec, index) => (
                      <li key={index} style={{ marginBottom: 4 }}>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {courses.map((course, index) => {
          const isSelected = selectedCourse === course.course_title;

          const outcomes = (course as any).outcomes ?? [
            "Hiểu sâu các khái niệm cốt lõi",
            "Xây dựng dự án thực tế",
            "Triển khai ứng dụng production",
          ];
          const requirements = (course as any).requirements ?? [
            "Kiến thức lập trình cơ bản",
            "Hiểu biết về web fundamentals",
          ];
          const audience = (course as any).audience ?? [
            "Developer muốn chuyên sâu Backend",
            "Junior dev muốn nâng cao kỹ năng thực tế",
          ];

          return (
            <Card
              key={index}
              hover
              onClick={() => setSelectedCourse(isSelected ? null : course.course_title)}
              className="p-5 cursor-pointer transition-all"
              style={{
                marginBottom: 20,
                marginLeft: 20,
                marginRight: 20,
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
                {/* Title với Link */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 18,
                        fontWeight: 900,
                        color: colors.primary[700],
                        flex: 1,
                      }}
                    >
                      {course.course_title}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartLearning(course);
                      }}
                      style={{ padding: "4px 8px", minWidth: "auto" }}
                    >
                      <MdOpenInNew size={16} />
                    </Button>
                  </div>
                  <p
                    style={{
                      margin: "8px 0 0",
                      color: colors.neutral[500],
                      fontSize: 14,
                      lineHeight: 1.4,
                    }}
                  >
                    {course.text}
                  </p>
                </div>

                {/* Metadata row */}
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
                    <MdPerson style={{ color: colors.primary[600] }} />{" "}
                    <span style={{ color: colors.primary[600] }}>{course.instructor || "Expert Instructor"}</span>
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
                    <strong style={{ color: colors.primary[700] }}>{course.rating || 4.6}</strong>
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
                    <span style={{ color: colors.primary[700], fontWeight: 700 }}>{course.duration || "12h"}</span>
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
                    <span style={{ color: colors.primary[600], fontWeight: 700 }}>Level</span>{" "}
                    <strong style={{ color: colors.primary[700] }}>{course.level || "Intermediate"}</strong>
                  </div>
                </div>

                {/* Course Details */}
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
                      Bạn sẽ học được gì
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
                      Yêu cầu
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
                      Dành cho ai
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
              </div>

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
                    Tại sao phù hợp với bạn?
                  </h4>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 16,
                      color: colors.primary[700],
                    }}
                  >
                    <li style={{ marginBottom: 6 }}>
                      Phù hợp với mục tiêu trở thành <strong>{careerGoal}</strong>
                    </li>
                    <li style={{ marginBottom: 6 }}>Bổ sung kiến thức theo đánh giá trình độ</li>
                    <li style={{ marginBottom: 6 }}>Phát triển các kỹ năng bạn cần cải thiện</li>
                  </ul>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <Button size="md" variant="primary" onClick={() => handleStartLearning(course)}>
                      <MdOpenInNew /> <span>Bắt Đầu Học Ngay</span>
                    </Button>

                    <Button
                      size="md"
                      variant="outline"
                      onClick={() => {
                        /* view syllabus */
                      }}
                    >
                      <MdInfo /> <span>Xem Chi Tiết Syllabus</span>
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div
        style={{
          marginTop: 18,
          display: "flex",
          gap: 12,
          justifyContent: "space-between",
          flexWrap: "wrap",
          marginLeft: 20,
          marginRight: 20,
        }}
      >
        <Button variant="outline" onClick={onRetakeQuiz}>
          <MdMenuBook /> <span>Làm Lại Đánh Giá</span>
        </Button>

        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <MdSearch /> <span>Xem lại đánh giá</span>
          </Button>

          <Button variant="primary" onClick={onContinue}>
            Tiếp Tục Học Tập <span style={{ fontSize: 12, marginLeft: 8 }}>(Bài kiểm tra cuối)</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
