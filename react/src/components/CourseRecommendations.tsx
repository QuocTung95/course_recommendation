"use client";

import { useState, useEffect } from "react";
import { api, Course } from "@/lib/api";

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
        console.log("🔄 Đang tải khóa học từ API...");
        const response = await api.recommendCourses({
          profile_text: userProfile,
          career_goal: careerGoal,
        });

        setCourses(response.courses);
        console.log("✅ Đã nhận courses từ API:", response.courses.length, "khóa học");
      } catch (error) {
        console.error("❌ Lỗi khi tải khóa học:", error);
        setError("Không thể tải khóa học. Vui lòng thử lại.");
        // Fallback to mock data
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
        text: "Learn Python programming from scratch. Covers variables, loops, functions, and simple projects. Perfect for building fundamental programming skills.",
        similarity: 0.95,
      },
      {
        course_title: "Web Development with Flask",
        text: "Build web applications with Flask framework. Covers routing, templates, databases, and deployment. Learn to create RESTful APIs and handle user authentication.",
        similarity: 0.88,
      },
      {
        course_title: "Advanced Python Programming",
        text: "Deep dive into Python advanced topics: decorators, generators, context managers, and performance optimization. Master object-oriented programming and design patterns.",
        similarity: 0.82,
      },
    ];
  };

  const getPerformanceFeedback = () => {
    const percentage = (quizScore.score / quizScore.total) * 100;

    if (percentage >= 80)
      return {
        text: "🎉 Xuất sắc! Bạn có nền tảng rất tốt cho lộ trình học tập.",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };

    if (percentage >= 60)
      return {
        text: "👍 Tốt! Bạn đã có kiến thức nền tảng vững chắc.",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      };

    return {
      text: "💪 Cần cải thiện! Các khóa học dưới đây sẽ giúp bạn xây dựng nền tảng vững chắc.",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    };
  };

  const feedback = getPerformanceFeedback();

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-700">Đang phân tích và gợi ý khóa học...</h3>
        <p className="text-gray-500 mt-2">Dựa trên profile và kết quả quiz của bạn</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Lỗi</h3>
          <p className="text-red-600">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-semibold"
        >
          Thử Lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Khóa Học Được Gợi Ý</h2>
        <p className="text-gray-600">Phân tích dựa trên profile và kết quả Pre-Quiz của bạn</p>
      </div>

      {/* Performance Summary */}
      <div className={`${feedback.bgColor} ${feedback.borderColor} border rounded-lg p-6 mb-8`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`font-semibold ${feedback.color} mb-2`}>
              Kết quả Pre-Quiz: {quizScore.score}/{quizScore.total} (
              {((quizScore.score / quizScore.total) * 100).toFixed(0)}%)
            </h3>
            <p className="text-gray-700">{feedback.text}</p>
          </div>
          <div className="text-3xl">{quizScore.score >= 4 ? "🎯" : quizScore.score >= 3 ? "👍" : "📚"}</div>
        </div>
      </div>

      {/* Course List */}
      <div className="space-y-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800">{courses.length} khóa học phù hợp với bạn:</h3>

        {courses.map((course, index) => (
          <div
            key={index}
            className={`border rounded-lg p-6 cursor-pointer transition-all ${
              selectedCourse === course.course_title
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
            }`}
            onClick={() => setSelectedCourse(selectedCourse === course.course_title ? null : course.course_title)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-start space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    index === 0
                      ? "bg-yellow-500"
                      : index === 1
                      ? "bg-gray-500"
                      : index === 2
                      ? "bg-orange-500"
                      : "bg-blue-500"
                  }`}
                >
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{course.course_title}</h3>
                  {course.similarity && (
                    <div className="flex items-center mt-1">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${course.similarity * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">{Math.round(course.similarity * 100)}% phù hợp</span>
                    </div>
                  )}
                </div>
              </div>

              <span className="text-sm text-gray-500">{index === 0 ? "🔥 Đề xuất hàng đầu" : ""}</span>
            </div>

            <p className="text-gray-600 mb-4 leading-relaxed">{course.text}</p>

            {selectedCourse === course.course_title && (
              <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-3">Tại sao phù hợp với bạn?</h4>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✅</span>
                    Phù hợp với mục tiêu trở thành <strong>{careerGoal}</strong>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✅</span>
                    Bổ sung kiến thức từ kết quả quiz của bạn
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✅</span>
                    Phù hợp với kinh nghiệm hiện tại trong profile
                  </li>
                </ul>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium">
                    📚 Bắt Đầu Học Ngay
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                    ℹ️ Xem Chi Tiết Syllabus
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between border-t pt-6">
        <button
          onClick={onRetakeQuiz}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          ↩️ Làm Lại Pre-Quiz
        </button>
        <button
          onClick={onContinue}
          className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold flex items-center"
        >
          Tiếp Tục Học Tập →<span className="ml-2 text-sm">(Post-Quiz)</span>
        </button>
      </div>
    </div>
  );
}
