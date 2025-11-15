// components/ProfileUpload.tsx
"use client";

import { useState, useRef } from "react";
import Button from "./ui/Button";
import FullScreenLoader from "./ui/FullScreenLoader";
import Card from "./ui/Card";
import { colors, gradients } from "@/theme/colors";
import { MdCloudUpload } from "react-icons/md";

interface ProfileUploadProps {
  onComplete: (
    profileText: string,
    careerGoal: string,
    profileAnalysis?: any,
    preQuiz?: any
  ) => void;
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

      const response = await fetch(
        "http://localhost:8000/api/upload-and-analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.ok) {
        setUploadProgress({
          status: "complete",
          message:
            "✅ Đã parse CV thành công! Bạn có thể chỉnh sửa text bên dưới.",
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
        message: `❌ Lỗi: ${
          error instanceof Error ? error.message : "Upload thất bại"
        }`,
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
      const normalizeResponse = await fetch(
        "http://localhost:8000/api/normalize-profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profile_text: profileText,
          }),
        }
      );

      if (!normalizeResponse.ok) {
        throw new Error("Normalization failed");
      }

      const normalizeData = await normalizeResponse.json();

      // Generate pre-quiz
      const quizResponse = await fetch(
        "http://localhost:8000/api/generate-quiz",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profile_text: profileText,
            career_goal: careerGoal,
            quiz_type: "pre-quiz",
          }),
        }
      );

      const quizData = await quizResponse.json();

      setUploadProgress({
        status: "complete",
        message: "✅ Đã phân tích profile thành công!",
      });

      // Chuyển sang pre-quiz
      onComplete(
        profileText,
        careerGoal,
        normalizeData.normalized_profile,
        quizData
      );
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
      const normalizeResponse = await fetch(
        "http://localhost:8000/api/normalize-profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profile_text: profileText,
          }),
        }
      );

      if (!normalizeResponse.ok) {
        throw new Error("Normalization failed");
      }

      const normalizeData = await normalizeResponse.json();

      // Generate pre-quiz
      const quizResponse = await fetch(
        "http://localhost:8000/api/generate-quiz",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profile_text: profileText,
            career_goal: careerGoal,
            quiz_type: "pre-quiz",
          }),
        }
      );

      const quizData = await quizResponse.json();

      // Chuyển sang pre-quiz
      onComplete(
        profileText,
        careerGoal,
        normalizeData.normalized_profile,
        quizData
      );
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
    // LAYOUT: gradient background + dot matrix overlay
    <div
      style={{
        minHeight: "72vh",
        background:
          "linear-gradient(180deg, rgba(243,250,255,0.9), rgba(248,252,255,1))",
        padding: "48px 16px",
      }}
    >
      {/* decorative dot matrix overlay */}
      <svg
        aria-hidden
        style={{
          position: "absolute",
          left: 16,
          top: 16,
          opacity: 0.04,
          pointerEvents: "none",
        }}
        width="220"
        height="220"
        viewBox="0 0 220 220"
        fill="none"
      >
        <g fill="rgba(16,24,40,0.03)">
          {[...Array(11)].map((_, r) =>
            [...Array(11)].map((_, c) => (
              <circle key={`${r}-${c}`} cx={c * 20} cy={r * 20} r={1.2} />
            ))
          )}
        </g>
      </svg>

      <div className="max-w-4xl mx-auto relative" style={{ zIndex: 2 }}>
        {/* show full-screen loading overlay while analyzing (always mounted) */}
        <FullScreenLoader active={isAnalyzing} message="Đang phân tích" />

        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: colors.primary[700],
              marginBottom: 6,
            }}
          >
            Tải Lên CV & Phân Tích
          </h2>
          <p style={{ color: colors.neutral[600], marginBottom: 0 }}>
            Tải lên CV hoặc nhập thủ công — AI sẽ phân tích và đề xuất lộ trình
            học phù hợp.
          </p>
        </div>

        {/* GRID: Upload Card + Manual Input Card */}
        {/* gap-8 ~= 32px vertical/horizontal — gives airy spacing between cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Upload Card */}
          <Card
            hover
            padding="lg"
            className="mb-6 flex items-center justify-center"
            onClick={() => fileInputRef.current?.click()}
            style={{ boxShadow: "0 10px 30px rgba(16,24,40,0.06)" }}
          >
            <div style={{ textAlign: "center", width: "100%", padding: 8 }}>
              <div
                style={{
                  width: 120,
                  height: 120,
                  margin: "0 auto 20px",
                  borderRadius: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: gradients.secondary,
                  boxShadow: "0 10px 30px rgba(50,130,184,0.10)",
                }}
              >
                <MdCloudUpload size={52} color="#fff" />
              </div>

              <p
                style={{
                  color: colors.primary[700],
                  fontWeight: 800,
                  marginBottom: 8,
                }}
              >
                Kéo & Thả hoặc chọn tệp
              </p>
              <p
                style={{
                  color: colors.neutral[500],
                  marginBottom: 18,
                  maxWidth: 420,
                  margin: "0 auto",
                }}
              >
                Hỗ trợ: PDF, DOCX, TXT — chúng tôi sẽ tự động trích xuất và phân
                tích nội dung.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.docx,.txt"
                onChange={handleFileSelect}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 12,
                  marginTop: 16,
                }}
              >
                <Button
                  size="md"
                  variant="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Tải lên CV
                </Button>
              </div>

              {uploadedFile && (
                <div
                  style={{
                    marginTop: 18,
                    padding: 12,
                    borderRadius: 12,
                    background: "rgba(50,130,184,0.06)",
                    border: `1px solid ${colors.primary[100]}`,
                    display: "inline-block",
                  }}
                >
                  <div
                    style={{
                      color: colors.primary[700],
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    Đã chọn: {uploadedFile.name}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Manual Input Card */}
          <Card
            hover
            padding="lg"
            className="mb-6"
            style={{ boxShadow: "0 10px 30px rgba(16,24,40,0.06)" }}
          >
            <form onSubmit={handleManualSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 800,
                    color: colors.primary[700],
                    marginBottom: 10,
                  }}
                >
                  Mục tiêu nghề nghiệp *
                </label>
                <select
                  required
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "18px 20px",
                    borderRadius: 12,
                    border: `1px solid ${colors.primary[100]}`,
                    boxShadow: "inset 0 1px 3px rgba(16,24,40,0.03)",
                    fontSize: 15,
                    background: "#fff",
                  }}
                >
                  {careerOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 800,
                    color: colors.primary[700],
                    marginBottom: 10,
                  }}
                >
                  Thông tin Profile/CV *
                </label>
                <textarea
                  required
                  value={profileText}
                  onChange={(e) => setProfileText(e.target.value)}
                  rows={10}
                  style={{
                    width: "100%",
                    padding: "18px 20px",
                    borderRadius: 12,
                    border: `1px solid ${colors.primary[100]}`,
                    fontSize: 14,
                    lineHeight: 1.6,
                    background: "#fff",
                    boxShadow: "inset 0 1px 2px rgba(16,24,40,0.03)",
                    resize: "vertical",
                    minHeight: 180,
                  }}
                  placeholder="Nhập thông tin profile: kinh nghiệm, kỹ năng, học vấn, dự án..."
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "center",
                  marginTop: 16,
                }}
              >
                <Button size="md" variant="outline" onClick={loadSampleProfile}>
                  Dùng Profile Mẫu
                </Button>

                <Button
                  size="md"
                  variant="primary"
                  onClick={handleManualSubmit}
                  disabled={!profileText.trim() || isAnalyzing}
                  loading={isAnalyzing}
                >
                  {isAnalyzing ? "Đang phân tích..." : "Phân Tích & Tiếp Tục"}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Information Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <span className="text-blue-500 mr-2">🔍</span>
            <span className="font-semibold text-blue-800">Phân tích AI</span>
          </div>
          <p className="text-blue-700">
            AI sẽ phân tích kỹ năng, kinh nghiệm và đề xuất lộ trình học tập phù
            hợp
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <span className="text-green-500 mr-2">🎯</span>
            <span className="font-semibold text-green-800">
              Đánh giá kỹ năng
            </span>
          </div>
          <p className="text-green-700">
            Bài quiz được tạo riêng để đánh giá trình độ và thu thập thông tin
            học tập
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <span className="text-purple-500 mr-2">📚</span>
            <span className="font-semibold text-purple-800">
              Gợi ý cá nhân hóa
            </span>
          </div>
          <p className="text-purple-700">
            Khóa học được đề xuất dựa trên phân tích CV và kết quả đánh giá
          </p>
        </div>
      </div> */}
      </div>
    </div>
  );
}
