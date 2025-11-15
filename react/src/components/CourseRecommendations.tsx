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
          const res = await fetch(
            "http://localhost:8000/api/recommend-courses",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );
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
        setError("Cannot load courses. Please try again.");
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
      strengths = [
        "Nền tảng kỹ thuật vững chắc",
        "Kinh nghiệm thực tế phong phú",
        "Khả năng giải quyết vấn đề tốt",
      ];
      weaknesses = [
        "Cần cập nhật công nghệ mới nhất",
        "Có thể thiếu kinh nghiệm với hệ thống quy mô lớn",
      ];
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
      strengths = [
        "Hiểu biết cơ bản vững vàng",
        "Có kinh nghiệm với các dự án nhỏ",
        "Khả năng học hỏi nhanh",
      ];
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
      overallFeedback =
        "Bạn đang ở giai đoạn phát triển tốt! Hãy xây dựng nền tảng vững chắc cho sự nghiệp.";
    } else {
      level = "Người mới bắt đầu";
      icon = <MdLightbulb />;
      color = colors.primary[400];
      strengths = [
        "Tinh thần học hỏi cao",
        "Không bị ảnh hưởng bởi thói quen cũ",
        "Có thể tiếp cận từ fundamentals",
      ];
      weaknesses = [
        "Thiếu kinh nghiệm thực tế",
        "Cần xây dựng nền tảng cơ bản",
        "Chưa thành thạo debugging",
      ];
      recommendations = [
        "Bắt đầu với khóa học cơ bản vững chắc",
        "Thực hành thường xuyên với bài tập nhỏ",
        "Xây dựng project cá nhân đầu tiên",
      ];
      overallFeedback =
        "Đây là thời điểm hoàn hảo để bắt đầu! Hãy xây dựng nền tảng thật vững chắc.";
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
      window.open(
        `https://www.udemy.com/courses/search/?q=${searchQuery}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <FullScreenLoader active={isLoading} message="Recommending" />

      <div className="text-center mb-8">
        <h2
          style={{ color: colors.primary[700], fontWeight: 800, fontSize: 24 }}
        >
          Personalized Learning Path
        </h2>
        <p style={{ color: colors.primary[600], opacity: 0.9 }}>
          Designed for you based on your profile analysis and goals
        </p>
      </div>

      {/* Assessment Section - redesigned styling (colors switched to primary palette for consistency) */}
      {assessment && (
        <div
          style={{
            backgroundColor: colors.primary[50],
            // use primary border to match app theme instead of green
            border: `2px solid ${colors.primary[200]}`,
            borderRadius: 12,
            padding: 24,
            marginBottom: 28,
            marginLeft: 20,
            marginRight: 20,
            boxShadow: "0 8px 24px rgba(16,24,40,0.04)",
          }}
        >
          <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // use primary gradient for icon wrapper
                background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.primary[300]})`,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {assessment.icon}
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 8,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 800,
                    color: colors.primary[700],
                  }}
                >
                  Đánh Giá Trình Độ — {assessment.level}
                </h3>
                <div
                  style={{
                    marginLeft: "auto",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {/* career tag styled with primary color */}
                  <div
                    style={{
                      background: colors.primary[500],
                      color: "#fff",
                      padding: "6px 10px",
                      borderRadius: 999,
                      fontWeight: 800,
                      fontSize: 12,
                    }}
                  >
                    {careerGoal}
                  </div>
                </div>
              </div>

              <p
                style={{
                  margin: 0,
                  color: colors.primary[700],
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                {assessment.overallFeedback}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 18,
                  marginTop: 6,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                      color: colors.primary[600],
                      fontWeight: 800,
                    }}
                  >
                    💪 Strengths
                  </div>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 18,
                      color: colors.primary[700],
                      lineHeight: 1.6,
                    }}
                  >
                    {assessment.strengths.map((s, i) => (
                      <li
                        key={i}
                        style={{ marginBottom: 8, display: "flex", gap: 8 }}
                      >
                        {/* use primary tone for check icon */}
                        <MdCheckCircle
                          style={{ color: colors.primary[300], marginTop: 4 }}
                        />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                      color: colors.primary[600],
                      fontWeight: 800,
                    }}
                  >
                    🎯 Areas to improve
                  </div>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 18,
                      color: colors.primary[700],
                      lineHeight: 1.6,
                    }}
                  >
                    {assessment.weaknesses.map((w, i) => (
                      <li
                        key={i}
                        style={{ marginBottom: 8, display: "flex", gap: 8 }}
                      >
                        <MdCheckCircle
                          style={{ color: colors.primary[300], marginTop: 4 }}
                        />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                      color: colors.primary[600],
                      fontWeight: 800,
                    }}
                  >
                    📝 Recommendations
                  </div>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 18,
                      color: colors.primary[700],
                      lineHeight: 1.6,
                    }}
                  >
                    {assessment.recommendations.map((r, i) => (
                      <li
                        key={i}
                        style={{ marginBottom: 8, display: "flex", gap: 8 }}
                      >
                        <MdCheckCircle
                          style={{ color: colors.primary[300], marginTop: 4 }}
                        />
                        <span>{r}</span>
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

          // ensure default outcome/requirement/audience text is in English
          const outcomes = (course as any).outcomes ?? [
            "Deep understanding of core concepts",
            "Build real-world projects",
            "Deploy applications to production",
          ];
          const requirements = (course as any).requirements ?? [
            "Basic programming knowledge",
            "Understanding of web fundamentals",
          ];
          const audience = (course as any).audience ?? [
            "Developers aiming to specialize in backend",
            "Junior devs looking to improve practical skills",
          ];

          return (
            <Card
              key={index}
              hover
              onClick={() =>
                setSelectedCourse(isSelected ? null : course.course_title)
              }
              className="p-5 cursor-pointer transition-all"
              style={{ marginBottom: 20, marginLeft: 20, marginRight: 20 }}
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
                  </div>
                  {/* <p
                    style={{
                      margin: "8px 0 0",
                      color: colors.neutral[500],
                      fontSize: 14,
                      lineHeight: 1.4,
                    }}
                  >
                    {course.text}
                  </p> */}
                </div>

                {/* Metadata row (Instructor / Rating / Duration / Level) */}
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
                    <span style={{ color: colors.primary[600] }}>
                      {course.instructor || "Expert Instructor"}
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
                    <strong style={{ color: colors.primary[700] }}>
                      {course.rating || 4.6}
                    </strong>
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
                      {course.duration || "12h"}
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
                      {course.level || "Intermediate"}
                    </strong>
                  </div>
                </div>

                {/* Course Details: horizontal 3-column layout */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 18,
                    marginTop: 8,
                  }}
                >
                  {/* What you'll learn */}
                  <div>
                    <div
                      style={{
                        fontWeight: 800,
                        color: colors.primary[700],
                        marginBottom: 8,
                      }}
                    >
                      What you'll learn
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

                  {/* Requirements */}
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
                  </div>

                  {/* Target Audience */}
                  <div>
                    <div
                      style={{
                        fontWeight: 800,
                        color: colors.primary[700],
                        marginBottom: 8,
                      }}
                    >
                      Who is this for
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

                {/* Expanded detail area */}
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
                        Addresses gaps found in your assessment
                      </li>
                      <li style={{ marginBottom: 6 }}>
                        Develops skills you need to improve
                      </li>
                    </ul>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {/* stopPropagation so clicking the button does not collapse the card */}
                      <Button
                        size="md"
                        variant="primary"
                        onClick={(e: any) => {
                          e.stopPropagation();
                          handleStartLearning(course);
                        }}
                      >
                        <MdOpenInNew /> <span>Start learning now</span>
                      </Button>
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
          <MdMenuBook /> <span>Analyze again</span>
        </Button>
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            variant="outline"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <MdSearch /> <span>View AI analysis</span>
          </Button>
          <Button variant="primary" onClick={onContinue}>
            Continue to Final Test{" "}
            <span style={{ fontSize: 12, marginLeft: 8 }}>(Final Test)</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
