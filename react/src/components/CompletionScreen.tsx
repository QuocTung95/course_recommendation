// components/CompletionScreen.tsx
"use client";

import { motion } from "framer-motion";
import {
  MdEmojiEvents,
  MdTrendingUp,
  MdReplay,
  MdSchool,
  MdShare,
} from "react-icons/md";
import { FiAward, FiTarget, FiBarChart2 } from "react-icons/fi";
import Button from "./ui/Button";
import Card from "./ui/Card";
import { colors, gradients } from "@/theme/colors";
import type { ReactNode } from "react";

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
  // compute percentages safely
  const preScore = preQuizScore
    ? Math.round((preQuizScore.score / preQuizScore.total) * 100)
    : 0;
  const postScore = postQuizScore
    ? Math.round((postQuizScore.score / postQuizScore.total) * 100)
    : 0;

  const improvement =
    postQuizScore && preQuizScore
      ? postQuizScore.score - preQuizScore.score
      : 0;
  const improvementPercentage = preQuizScore
    ? Math.round((improvement / preQuizScore.total) * 100)
    : 0;

  // return level, color value and an Icon component for UI (no emoji strings)
  const getPerformanceLevel = (
    score: number
  ): { level: string; color: string; Icon?: ReactNode } => {
    if (score >= 90)
      return {
        level: "Excellent",
        color: colors.success[500],
        Icon: <FiAward />,
      };
    if (score >= 80)
      return {
        level: "Very good",
        color: colors.success[500],
        Icon: <MdEmojiEvents />,
      };
    if (score >= 70)
      return { level: "Good", color: colors.primary[500], Icon: <FiTarget /> };
    if (score >= 60)
      return {
        level: "Fair",
        color: colors.primary[600],
        Icon: <FiBarChart2 />,
      };
    return {
      level: "Needs improvement",
      color: colors.error[500],
      Icon: <MdSchool />,
    };
  };

  const prePerformance = getPerformanceLevel(preScore);
  const postPerformance = getPerformanceLevel(postScore);

  const stats = [
    // {
    //   icon: <FiTarget className="w-5 h-5" />,
    //   label: "Pre-Quiz Score",
    //   value: `${preQuizScore?.score ?? 0}/${preQuizScore?.total ?? 0}`,
    //   percentage: preScore,
    //   color: colors.primary[500],
    // },
    {
      icon: <FiAward className="w-5 h-5" />,
      label: "Post-Quiz Score",
      value: `${postQuizScore?.score ?? 0}/${postQuizScore?.total ?? 0}`,
      percentage: postScore,
      color: colors.primary[300],
    },
    {
      icon: <FiBarChart2 className="w-5 h-5" />,
      label: "Improvement",
      value: `${improvement > 0 ? "+" : ""}${improvement} điểm`,
      percentage: Math.abs(improvementPercentage),
      color: improvement >= 0 ? colors.success[500] : colors.error[500],
    },
  ];

  const recommendations = [
    {
      title: "Keep learning",
      description: "Duy trì thói quen học tập đều đặn để củng cố kiến thức",
      icon: <MdSchool />,
    },
    {
      title: "Project practice",
      description: "Áp dụng kiến thức vào các dự án thực tế",
      icon: <MdTrendingUp />,
    },
    {
      title: "Join the community",
      description: "Kết nối với các developer khác để học hỏi",
      icon: <MdShare />,
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
        <div
          style={{
            width: 96,
            height: 96,
            margin: "0 auto 16px",
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            boxShadow: "0 8px 30px rgba(16,24,40,0.08)",
            background: gradients.primary,
          }}
        >
          <MdEmojiEvents size={36} />
        </div>

        <h1
          style={{
            color: colors.primary[700],
            fontSize: 28,
            marginBottom: 12,
            fontWeight: 700,
          }}
        >
          Congratulations on completing the path!
        </h1>

        <p
          style={{
            color: colors.neutral[600],
            maxWidth: 720,
            margin: "0 auto",
          }}
        >
          You've completed the pathway. Below is a summary of your results and
          recommendations to continue improving.
        </p>
      </motion.div>

      {/* Compact Stats Row: Post-Quiz & Improvement (larger cards) */}
      <div
        style={{
          display: "flex",
          gap: 18,
          justifyContent: "center",
          alignItems: "stretch",
          marginBottom: 28,
          flexWrap: "wrap",
        }}
      >
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: idx * 0.06 }}
            style={{ minWidth: 280, maxWidth: 380 }}
          >
            <Card
              hover
              padding="md"
              className="text-left"
              style={{
                margin: 10,
                border: `1px solid ${colors.neutral[200]}`,
                borderRadius: 14,
                display: "flex",
                gap: 16,
                alignItems: "center",
                padding: "16px 18px",
                background: colors.primary[50],
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: stat.color,
                  color: "#fff",
                  flexShrink: 0,
                  fontSize: 22,
                }}
              >
                {stat.icon}
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 900,
                      color: colors.primary[700],
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: colors.neutral[500],
                      fontWeight: 700,
                    }}
                  >
                    {`${stat.percentage}%`}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: colors.neutral[600],
                    marginTop: 8,
                  }}
                >
                  {stat.label}
                </div>
              </div>
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
        style={{ margin: 20 }}
      >
        <Card padding="lg">
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: colors.primary[700],
              marginBottom: 18,
              textAlign: "center",
            }}
          >
            Performance Analysis
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: colors.neutral[500],
                  marginBottom: 8,
                }}
              >
                Before learning
              </div>
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  color: prePerformance.color,
                  marginBottom: 8,
                }}
              >
                {preScore}%
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontSize: 14,
                }}
              >
                <span>{prePerformance.Icon}</span>
                <span style={{ color: prePerformance.color, fontWeight: 600 }}>
                  {prePerformance.level}
                </span>
              </div>
            </div>

            <div className="text-center">
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: colors.neutral[500],
                  marginBottom: 8,
                }}
              >
                After learning
              </div>
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  color: postPerformance.color,
                  marginBottom: 8,
                }}
              >
                {postScore}%
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontSize: 14,
                }}
              >
                <span>{postPerformance.Icon}</span>
                <span style={{ color: postPerformance.color, fontWeight: 600 }}>
                  {postPerformance.level}
                </span>
              </div>
            </div>
          </div>

          {/* Improvement Indicator */}
          {improvement !== 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              style={{
                marginTop: 20,
                // border: `1px solid ${colors.neutral[200]}`,
              }}
            >
              <div
                style={{
                  padding: 12,
                  borderRadius: 12,
                  textAlign: "center",
                  backgroundColor: improvement > 0 ? "#ECFDF5" : "#FFF7ED",
                  border: `1px solid ${
                    improvement > 0 ? "#DCFCE7" : "#FFEDD5"
                  }`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <MdTrendingUp
                    style={{
                      width: 20,
                      height: 20,
                      color:
                        improvement > 0
                          ? colors.success[600]
                          : colors.warning[500],
                    }}
                  />
                  <span
                    style={{
                      fontWeight: 700,
                      color:
                        improvement > 0
                          ? colors.success[600]
                          : colors.warning[500],
                    }}
                  >
                    {improvement > 0
                      ? `+${improvement} điểm tiến bộ`
                      : "Cần ôn tập thêm"}
                  </span>
                </div>
                {improvement > 0 && (
                  <p style={{ color: colors.success[600], marginTop: 8 }}>
                    Bạn đã cải thiện đáng kể! Tiếp tục phát huy nhé!
                  </p>
                )}
              </div>
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
        style={{
          border: `1px solid ${colors.neutral[200]}`,
          borderRadius: 20,
          margin: 20,
          marginBottom: 80,
          paddingBottom: 50,
        }}
      >
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: colors.primary[700],
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          Next Recommendations
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.15 + index * 0.08 }}
            >
              <Card
                hover
                padding="md"
                className="text-center h-full"
                style={{
                  margin: 20,
                  border: `1px solid ${colors.neutral[200]}`,
                  borderRadius: 20,
                  paddingTop: 30,
                }}
              >
                <div
                  style={{
                    fontSize: 28,
                    marginBottom: 10,
                    color: colors.primary[500],
                  }}
                >
                  {rec.icon}
                </div>
                <h3
                  style={{
                    fontWeight: 700,
                    color: colors.primary[600],
                    marginBottom: 6,
                  }}
                >
                  {rec.title}
                </h3>
                <p style={{ color: colors.neutral[600], fontSize: 14 }}>
                  {rec.description}
                </p>
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
        style={{
          display: "flex",
          gap: 16,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 18,
          flexWrap: "wrap",
        }}
      >
        <Button
          size="md"
          onClick={onViewCourses}
          style={{
            minWidth: 160,
            display: "inline-flex",
            justifyContent: "center",
          }}
        >
          <MdSchool style={{ width: 18, height: 18, marginRight: 8 }} />
          View Recommended Courses
        </Button>

        <Button
          variant="outline"
          size="md"
          onClick={onRestart}
          style={{
            minWidth: 120,
            display: "inline-flex",
            justifyContent: "center",
          }}
        >
          <MdReplay style={{ width: 18, height: 18, marginRight: 8 }} />
          Restart
        </Button>

        <Button
          variant="ghost"
          size="md"
          onClick={() => window.print()}
          style={{
            minWidth: 120,
            display: "inline-flex",
            justifyContent: "center",
          }}
        >
          <MdShare style={{ width: 18, height: 18, marginRight: 8 }} />
          Share Results
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
          <blockquote
            style={{
              fontSize: 16,
              fontStyle: "italic",
              color: colors.neutral[600],
            }}
          >
            "Học tập là hành trình không ngừng nghỉ. Mỗi bước tiến hôm nay là
            nền tảng cho thành công ngày mai."
          </blockquote>
        </div>
      </motion.div>
    </div>
  );
}
