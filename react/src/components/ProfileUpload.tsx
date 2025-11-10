"use client";

import { useState } from "react";

interface ProfileUploadProps {
  onComplete: (profileText: string, careerGoal: string) => void;
}

export default function ProfileUpload({ onComplete }: ProfileUploadProps) {
  const [profileText, setProfileText] = useState("");
  const [careerGoal, setCareerGoal] = useState("Backend Developer");
  const [isLoading, setIsLoading] = useState(false);

  const careerOptions = [
    "Backend Developer",
    "Frontend Developer",
    "Fullstack Developer",
    "Data Scientist",
    "Machine Learning Engineer",
    "DevOps Engineer",
    "Mobile Developer",
  ];

  const loadSampleProfile = () => {
    const sampleProfile = `Tên: Nguyễn Văn A
Kinh nghiệm: 2 năm lập trình Python, từng làm dự án web Flask
Học vấn: Đại học Công nghệ Thông tin
Kỹ năng: Python, Flask, HTML, CSS, SQL, Git, REST API
Mục tiêu: Trở thành Backend Developer chuyên nghiệp
Dự án đã làm:
- Website bán hàng với Flask và MySQL
- REST API cho ứng dụng mobile
- Integration với payment gateway`;

    setProfileText(sampleProfile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileText.trim()) {
      alert("Vui lòng nhập nội dung profile");
      return;
    }

    setIsLoading(true);

    // Giả lập xử lý đọc profile
    setTimeout(() => {
      onComplete(profileText, careerGoal);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Thông Tin Hồ Sơ</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <div className="text-blue-500 mr-3">💡</div>
          <div>
            <h3 className="font-semibold text-blue-800 mb-1">Cách hoạt động</h3>
            <p className="text-blue-700 text-sm">
              Hệ thống sẽ đọc thông tin từ CV/profile của bạn để gợi ý khóa học phù hợp. Hiện tại bạn có thể:
            </p>
            <ul className="text-blue-700 text-sm mt-2 list-disc list-inside">
              <li>Dán nội dung profile vào ô bên dưới</li>
              <li>Dùng profile mẫu để thử nghiệm</li>
              <li>Chọn mục tiêu nghề nghiệp phù hợp</li>
              <li>Sau này sẽ tích hợp đọc từ file CV (PDF/DOCX)</li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Career Goal Dropdown */}
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
          <p className="text-sm text-gray-500 mt-1">Chọn lĩnh vực bạn muốn phát triển sự nghiệp</p>
        </div>

        {/* Profile Text Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung Profile/CV *</label>
          <textarea
            required
            value={profileText}
            onChange={(e) => setProfileText(e.target.value)}
            rows={10}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm bg-white"
            placeholder={`Nhập nội dung profile của bạn hoặc dùng profile mẫu...\n\nVí dụ:\nTên: Nguyễn Văn A\nKinh nghiệm: 2 năm Python\nHọc vấn: Đại học CNTT\nKỹ năng: Python, Flask, SQL\nMục tiêu: Backend Developer`}
          />
          <p className="text-sm text-gray-500 mt-1">
            Bao gồm: Tên, kinh nghiệm, học vấn, kỹ năng, mục tiêu nghề nghiệp
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={loadSampleProfile}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              📝 Dùng Profile Mẫu
            </button>
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium opacity-50 cursor-not-allowed"
              disabled
            >
              📎 Tải lên CV (Coming soon)
            </button>
          </div>

          <button
            type="submit"
            disabled={!profileText.trim() || isLoading}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
          >
            {isLoading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang xử lý...
              </span>
            ) : (
              "Tiếp tục → Pre-Quiz"
            )}
          </button>
        </div>
      </form>

      {/* Profile Preview */}
      {profileText && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Xem trước Profile:</h3>
          <div className="text-sm text-gray-600 whitespace-pre-line bg-white p-3 rounded border max-h-40 overflow-y-auto">
            {profileText}
          </div>
        </div>
      )}
    </div>
  );
}
