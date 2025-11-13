// components/CompletionScreen.tsx
"use client";

import { motion } from "framer-motion";
import { MdEmojiEvents, MdTrendingUp, MdReplay, MdSchool, MdShare } from "react-icons/md";
import { FiAward, FiTarget, FiBarChart2 } from "react-icons/fi";
import Button from "./ui/Button";
import Card from "./ui/Card";
import { colors } from "@/theme/colors";

interface CompletionScreenProps {
  preQuizScore: { score: number; total: number } | null;
  postQuizScore: { score: number; total: number } | null;
  onRestart: () => void;
  onViewCourses: () => void;
}

export default function CompletionScreen({
  preQuizScore,
  postQuizScore,
  onRestart,
  onViewCourses,
}: CompletionScreenProps) {
  const preScore = preQuizScore ? Math.round((preQuizScore.score / preQuizScore.total) * 100) : 0;
  const postScore = postQuizScore ? Math.round((postQuizScore.score / postQuizScore.total) * 100) : 0;

  const improvement = postQuizScore && preQuizScore ? postQuizScore.score - preQuizScore.score : 0;
  const improvementPercentage = preQuizScore ? Math.round((improvement / preQuizScore.total) * 100) : 0;

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: "Xuất sắc", color: colors.success[500], emoji: "🎯" };
    if (score >= 80) return { level: "Rất tốt", color: colors.success[400], emoji: "🌟" };
    if (score >= 70) return { level: "Tốt", color: colors.accent.blue, emoji: "👍" };
    if (score >= 60) return { level: "Khá", color: colors.warning[500], emoji: "💪" };
    return { level: "Cần cải thiện", color: colors.error[500], emoji: "📚" };
  };

  const prePerformance = getPerformanceLevel(preScore);
  const postPerformance = getPerformanceLevel(postScore);

  const stats = [
    {
      icon: <FiTarget className="w-5 h-5" />,
      label: "Điểm Pre-Quiz",
      value: `${preQuizScore?.score ?? 0}/${preQuizScore?.total ?? 0}`,
      percentage: preScore,
      color: colors.primary[500],
    },
    {
      icon: <FiAward className="w-5 h-5" />,
      label: "Điểm Post-Quiz",
      value: `${postQuizScore?.score ?? 0}/${postQuizScore?.total ?? 0}`,
      percentage: postScore,
      color: colors.accent.purple,
    },
    {
      icon: <FiBarChart2 className="w-5 h-5" />,
      label: "Tiến bộ",
      value: `${improvement > 0 ? "+" : ""}${improvement} điểm`,
      percentage: Math.abs(improvementPercentage),
      color: improvement >= 0 ? colors.success[500] : colors.error[500],
    },
  ];

  const recommendations = [
    {
      title: "Tiếp tục học tập",
      description: "Duy trì thói quen học tập đều đặn để củng cố kiến thức",
      icon: "📚",
    },
    {
      title: "Thực hành dự án",
      description: "Áp dụng kiến thức vào các dự án thực tế",
      icon: "💻",
    },
    {
      title: "Tham gia cộng đồng",
      description: "Kết nối với các developer khác để học hỏi",
      icon: "👥",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[${colors.accent.purple}] to-[${colors.primary[500]}] flex items-center justify-center text-white shadow-xl">
          <MdEmojiEvents className="w-10 h-10" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-[${colors.primary[700]}] mb-4">Chúc mừng hoàn thành! 🎉</h1>

        <p className="text-lg text-[${colors.neutral[600]}] max-w-2xl mx-auto">
          Bạn đã hoàn thành xuất sắc lộ trình học tập. Dưới đây là tổng quan kết quả và những khuyến nghị để tiếp tục
          phát triển.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card hover padding="lg" className="text-center">
              <div
                className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: stat.color }}
              >
                {stat.icon}
              </div>

              <div className="text-2xl font-bold text-[${colors.primary[700]}] mb-2">{stat.value}</div>

              <div className="text-sm font-medium text-[${colors.neutral[600]}] mb-3">{stat.label}</div>

              {/* Progress Bar */}
              <div className="w-full bg-[${colors.neutral[200]}] rounded-full h-2 mb-2">
                <div
                  className="h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${stat.percentage}%`,
                    backgroundColor: stat.color,
                  }}
                />
              </div>

              <div className="text-xs text-[${colors.neutral[500]}]">{stat.percentage}%</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Performance Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-8"
      >
        <Card padding="lg">
          <h2 className="text-xl font-bold text-[${colors.primary[700]}] mb-6 text-center">Phân tích hiệu suất</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-sm font-medium text-[${colors.neutral[500]}] mb-2">Trước khi học</div>
              <div className="text-4xl font-bold mb-2" style={{ color: prePerformance.color }}>
                {preScore}%
              </div>
              <div className="flex items-center justify-center gap-2 text-sm">
                <span>{prePerformance.emoji}</span>
                <span style={{ color: prePerformance.color }}>{prePerformance.level}</span>
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm font-medium text-[${colors.neutral[500]}] mb-2">Sau khi học</div>
              <div className="text-4xl font-bold mb-2" style={{ color: postPerformance.color }}>
                {postScore}%
              </div>
              <div className="flex items-center justify-center gap-2 text-sm">
                <span>{postPerformance.emoji}</span>
                <span style={{ color: postPerformance.color }}>{postPerformance.level}</span>
              </div>
            </div>
          </div>

          {/* Improvement Indicator */}
          {improvement !== 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className={`mt-6 p-4 rounded-xl text-center ${
                improvement > 0 ? "bg-green-50 border border-green-200" : "bg-orange-50 border border-orange-200"
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                <MdTrendingUp className={`w-5 h-5 ${improvement > 0 ? "text-green-600" : "text-orange-600"}`} />
                <span className={`font-semibold ${improvement > 0 ? "text-green-700" : "text-orange-700"}`}>
                  {improvement > 0 ? `+${improvement} điểm tiến bộ` : "Cần ôn tập thêm"}
                </span>
              </div>
              {improvement > 0 && (
                <p className="text-sm text-green-600 mt-1">Bạn đã cải thiện đáng kể! Tiếp tục phát huy nhé! 🚀</p>
              )}
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-[${colors.primary[700]}] mb-6 text-center">Khuyến nghị tiếp theo</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            >
              <Card hover padding="md" className="text-center h-full">
                <div className="text-3xl mb-3">{rec.icon}</div>
                <h3 className="font-semibold text-[${colors.primary[600]}] mb-2">{rec.title}</h3>
                <p className="text-sm text-[${colors.neutral[600]}]">{rec.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
      >
        <Button size="lg" onClick={onViewCourses} className="group">
          <MdSchool className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
          Xem Lại Khóa Học
        </Button>

        <Button variant="outline" size="lg" onClick={onRestart} className="group">
          <MdReplay className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform" />
          Bắt Đầu Lại
        </Button>

        <Button variant="ghost" size="lg" onClick={() => window.print()}>
          <MdShare className="w-5 h-5 mr-2" />
          Chia Sẻ Kết Quả
        </Button>
      </motion.div>

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center mt-12"
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-4xl mb-4">✨</div>
          <blockquote className="text-lg italic text-[${colors.neutral[600]}]">
            "Học tập là hành trình không ngừng nghỉ. Mỗi bước tiến hôm nay là nền tảng cho thành công ngày mai."
          </blockquote>
        </div>
      </motion.div>
    </div>
  );
}
