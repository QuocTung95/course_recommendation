// components/ProfileUpload.tsx
"use client";

import { useState, useRef } from "react";

interface ProfileUploadProps {
  onComplete: (profileText: string, careerGoal: string, profileAnalysis?: any, preQuiz?: any) => void;
}

interface UploadProgress {
  status: "idle" | "uploading" | "analyzing" | "complete" | "error";
  message: string;
}

export default function ProfileUpload({ onComplete }: ProfileUploadProps) {
  const [profileText, setProfileText] = useState("");
  const [careerGoal, setCareerGoal] = useState("Backend Developer");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    status: "idle",
    message: "",
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedText, setParsedText] = useState(""); // Text đã parse từ CV
  const [showPreview, setShowPreview] = useState(false); // Hiển thị preview mode
  const fileInputRef = useRef<HTMLInputElement>(null);

  const careerOptions = [
    "Backend Developer",
    "Frontend Developer",
    "Fullstack Developer",
    "Data Scientist",
    "Machine Learning Engineer",
    "DevOps Engineer",
    "Mobile Developer",
    "Software Engineer",
    "Data Engineer",
    "Cloud Engineer",
  ];

  const loadSampleProfile = () => {
    const sampleProfile = `NGUYỄN VĂN A
Senior Backend Developer

📞 0912 345 678 | 📧 nguyenvana@email.com | 🌐 github.com/nguyenvana

KINH NGHIỆM LÀM VIỆC:
• Senior Backend Developer - Công ty TechVision (2020 - Hiện tại)
  - Phát triển microservices với Python Flask và FastAPI
  - Thiết kế và triển khai RESTful APIs
  - Làm việc với PostgreSQL, MongoDB, Redis
  - Triển khai ứng dụng trên AWS (EC2, S3, RDS)

• Backend Developer - Công ty SoftTech (2018 - 2020)
  - Phát triển ứng dụng web với Django
  - Tích hợp payment gateway (Stripe, PayPal)
  - Tối ưu hóa hiệu năng database

KỸ NĂNG KỸ THUẬT:
• Ngôn ngữ: Python, JavaScript, SQL, Java
• Frameworks: Flask, Django, FastAPI, Express.js
• Databases: PostgreSQL, MongoDB, MySQL, Redis
• Tools: Docker, Git, AWS, Jenkins, Kubernetes
• Platforms: Linux, Windows, macOS

HỌC VẤN:
• Đại học Bách Khoa Hà Nội (2014 - 2018)
  Kỹ sư Công nghệ Thông tin

DỰ ÁN NỔI BẬT:
• Hệ thống E-commerce - TechVision
  - Lead developer cho platform xử lý 10k+ orders/ngày
  - Tích hợp multiple payment methods
  - Triển khai caching với Redis

• API Gateway - SoftTech
  - Xây dựng gateway xử lý 1M+ requests/ngày
  - Implement authentication với JWT
  - Rate limiting và monitoring

MỤC TIÊU NGHỀ NGHIỆP:
• Trở thành Principal Backend Engineer
• Master distributed systems và microservices architecture
• Phát triển kỹ năng leadership và mentoring`;

    setProfileText(sampleProfile);
    setShowPreview(true);
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setUploadedFile(file);
    setIsAnalyzing(true);
    setUploadProgress({
      status: "uploading",
      message: "Đang upload CV...",
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("career_goal", careerGoal);

    try {
      setUploadProgress({
        status: "analyzing",
        message: "AI đang phân tích CV và parse text...",
      });

      const response = await fetch("http://localhost:8000/api/upload-and-analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.ok) {
        setUploadProgress({
          status: "complete",
          message: "✅ Đã parse CV thành công! Bạn có thể chỉnh sửa text bên dưới.",
        });

        // Hiển thị text đã parse trong textarea, cho phép chỉnh sửa
        setParsedText(data.raw_text_preview);
        setProfileText(data.raw_text_preview);
        setShowPreview(true); // Chuyển sang preview mode
      } else {
        throw new Error(data.detail || "Analysis failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadProgress({
        status: "error",
        message: `❌ Lỗi: ${error instanceof Error ? error.message : "Upload thất bại"}`,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileText.trim()) {
      alert("Vui lòng nhập nội dung profile");
      return;
    }

    setIsAnalyzing(true);
    setUploadProgress({
      status: "analyzing",
      message: "AI đang phân tích profile và tạo bài đánh giá...",
    });

    try {
      // Gọi API normalize profile
      const normalizeResponse = await fetch("http://localhost:8000/api/normalize-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile_text: profileText,
        }),
      });

      if (!normalizeResponse.ok) {
        throw new Error("Normalization failed");
      }

      const normalizeData = await normalizeResponse.json();

      // Generate pre-quiz
      const quizResponse = await fetch("http://localhost:8000/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile_text: profileText,
          career_goal: careerGoal,
          quiz_type: "pre-quiz",
        }),
      });

      const quizData = await quizResponse.json();

      setUploadProgress({
        status: "complete",
        message: "✅ Đã phân tích profile thành công!",
      });

      // Chuyển sang pre-quiz
      onComplete(profileText, careerGoal, normalizeData.normalized_profile, quizData);
    } catch (error) {
      console.error("Manual submit error:", error);
      setUploadProgress({
        status: "error",
        message: "❌ Lỗi phân tích profile",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleContinueWithParsedText = async () => {
    if (!profileText.trim()) {
      alert("Vui lòng kiểm tra lại nội dung profile");
      return;
    }

    setIsAnalyzing(true);
    setUploadProgress({
      status: "analyzing",
      message: "AI đang phân tích profile và tạo bài đánh giá...",
    });

    try {
      // Gọi API normalize profile
      const normalizeResponse = await fetch("http://localhost:8000/api/normalize-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile_text: profileText,
        }),
      });

      if (!normalizeResponse.ok) {
        throw new Error("Normalization failed");
      }

      const normalizeData = await normalizeResponse.json();

      // Generate pre-quiz
      const quizResponse = await fetch("http://localhost:8000/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile_text: profileText,
          career_goal: careerGoal,
          quiz_type: "pre-quiz",
        }),
      });

      const quizData = await quizResponse.json();

      // Chuyển sang pre-quiz
      onComplete(profileText, careerGoal, normalizeData.normalized_profile, quizData);
    } catch (error) {
      console.error("Continue error:", error);
      setUploadProgress({
        status: "error",
        message: "❌ Lỗi phân tích profile",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const getStatusColor = () => {
    switch (uploadProgress.status) {
      case "uploading":
        return "text-blue-600";
      case "analyzing":
        return "text-yellow-600";
      case "complete":
        return "text-green-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const resetUpload = () => {
    setUploadProgress({ status: "idle", message: "" });
    setUploadedFile(null);
    setParsedText("");
    setShowPreview(false);
    setProfileText("");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Tải Lên CV & Phân Tích</h2>
        <p className="text-gray-600">
          Tải lên CV của bạn hoặc nhập thông tin thủ công để nhận đánh giá và khóa học phù hợp
        </p>
      </div>

      {/* Upload Section */}
      {!showPreview ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* File Upload Card */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center h-48">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Tải lên CV của bạn</h3>
              <p className="text-gray-500 text-sm mb-4">Kéo thả file hoặc click để chọn</p>
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Chọn File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.docx,.txt"
                onChange={handleFileSelect}
              />
              <p className="text-xs text-gray-400 mt-3">Hỗ trợ: PDF, DOCX, TXT (tối đa 10MB)</p>
            </div>

            {uploadedFile && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm font-medium">✅ Đã chọn: {uploadedFile.name}</p>
              </div>
            )}
          </div>

          {/* Manual Input Card */}
          <div className="border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Hoặc nhập thông tin thủ công</h3>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              {/* Career Goal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mục tiêu nghề nghiệp *</label>
                <select
                  required
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  {careerOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Profile Text Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thông tin Profile/CV *</label>
                <textarea
                  required
                  value={profileText}
                  onChange={(e) => setProfileText(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm bg-white resize-none"
                  placeholder="Nhập thông tin profile của bạn bao gồm:
• Kinh nghiệm làm việc
• Kỹ năng chuyên môn
• Học vấn
• Dự án đã làm
• Mục tiêu nghề nghiệp"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={loadSampleProfile}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  📝 Dùng Profile Mẫu
                </button>
                <button
                  type="submit"
                  disabled={!profileText.trim() || isAnalyzing}
                  className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang phân tích...
                    </span>
                  ) : (
                    "Phân Tích & Tiếp Tục"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* Preview Mode - Sau khi upload CV thành công */
        <div className="border-2 border-gray-200 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Preview & Chỉnh Sửa Profile</h3>
            <button
              onClick={resetUpload}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
            >
              ↶ Tải Lại CV Khác
            </button>
          </div>

          <div className="space-y-4">
            {/* Career Goal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mục tiêu nghề nghiệp *</label>
              <select
                required
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {careerOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Parsed Text Preview & Edit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thông tin Profile/CV (đã parse từ CV) *
                <span className="text-green-600 text-xs ml-2">✓ Bạn có thể chỉnh sửa text này</span>
              </label>
              <textarea
                value={profileText}
                onChange={(e) => setProfileText(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm bg-white resize-none"
                placeholder="Nội dung đã được parse từ CV của bạn..."
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Kiểm tra và chỉnh sửa thông tin nếu cần thiết trước khi tiếp tục
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={resetUpload}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                ← Quay Lại
              </button>
              <button
                onClick={handleContinueWithParsedText}
                disabled={!profileText.trim() || isAnalyzing}
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
              >
                {isAnalyzing ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang phân tích...
                  </span>
                ) : (
                  "Tiếp Tục →"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress/Status Display */}
      {uploadProgress.status !== "idle" && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Trạng thái xử lý</h3>
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {uploadProgress.status === "uploading" && "📤 Đang upload..."}
              {uploadProgress.status === "analyzing" && "🤖 AI đang phân tích..."}
              {uploadProgress.status === "complete" && "✅ Hoàn thành"}
              {uploadProgress.status === "error" && "❌ Lỗi"}
            </span>
          </div>

          <p className={`text-sm ${getStatusColor()} mb-3`}>{uploadProgress.message}</p>

          {/* Progress Bar */}
          {(uploadProgress.status === "uploading" || uploadProgress.status === "analyzing") && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300 animate-pulse"
                style={{
                  width: uploadProgress.status === "uploading" ? "50%" : "90%",
                }}
              ></div>
            </div>
          )}

          {uploadProgress.status === "error" && (
            <button
              onClick={resetUpload}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
            >
              Thử Lại
            </button>
          )}
        </div>
      )}

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <span className="text-blue-500 mr-2">🔍</span>
            <span className="font-semibold text-blue-800">Phân tích AI</span>
          </div>
          <p className="text-blue-700">AI sẽ phân tích kỹ năng, kinh nghiệm và đề xuất lộ trình học tập phù hợp</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <span className="text-green-500 mr-2">🎯</span>
            <span className="font-semibold text-green-800">Đánh giá kỹ năng</span>
          </div>
          <p className="text-green-700">Bài quiz được tạo riêng để đánh giá trình độ và thu thập thông tin học tập</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <span className="text-purple-500 mr-2">📚</span>
            <span className="font-semibold text-purple-800">Gợi ý cá nhân hóa</span>
          </div>
          <p className="text-purple-700">Khóa học được đề xuất dựa trên phân tích CV và kết quả đánh giá</p>
        </div>
      </div>
    </div>
  );
}
