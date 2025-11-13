// components/WelcomeScreen.tsx
"use client";

import { motion } from "framer-motion";
import { MdRocketLaunch, MdSchool, MdTrendingUp, MdAutoAwesome } from "react-icons/md";
import Button from "./ui/Button";
import Card from "./ui/Card";
import { colors } from "@/theme/colors";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const features = [
    {
      icon: <MdAutoAwesome className="w-6 h-6" />,
      title: "AI-Powered Analysis",
      description: "Phân tích CV thông minh với AI để hiểu rõ kỹ năng và kinh nghiệm của bạn",
    },
    {
      icon: <MdSchool className="w-6 h-6" />,
      title: "Personalized Learning Path",
      description: "Lộ trình học tập được thiết kế riêng dựa trên mục tiêu nghề nghiệp",
    },
    {
      icon: <MdTrendingUp className="w-6 h-6" />,
      title: "Progress Tracking",
      description: "Theo dõi tiến bộ với Pre-Quiz và Post-Quiz để đo lường sự cải thiện",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-[${colors.primary[200]}] shadow-sm mb-6">
          <div className="w-2 h-2 bg-[${colors.accent.purple}] rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-[${colors.primary[600]}]">AI Learning Assistant</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[${colors.primary[600]}] to-[${colors.accent.purple}] bg-clip-text text-transparent">
          Khám phá lộ trình học tập
          <br />
          <span className="text-[${colors.primary[500]}]">cá nhân hóa</span>
        </h1>

        <p className="text-xl text-[${colors.neutral[600]}] max-w-2xl mx-auto mb-8 leading-relaxed">
          Từ CV đến thành thạo - Hệ thống AI của chúng tôi phân tích profile và đề xuất khóa học phù hợp nhất với mục
          tiêu nghề nghiệp của bạn.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" onClick={onGetStarted} className="group">
            <MdRocketLaunch className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Bắt Đầu Hành Trình
          </Button>

          <Button variant="outline" size="lg" onClick={onGetStarted}>
            Tải CV Lên Ngay
          </Button>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card hover padding="lg" className="h-full text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[${colors.primary[100]}] to-[${colors.primary[200]}] flex items-center justify-center text-[${colors.primary[600]}]">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-[${colors.primary[700]}] mb-2">{feature.title}</h3>
              <p className="text-[${colors.neutral[600]}] text-sm leading-relaxed">{feature.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
          {[
            { number: "500+", label: "Khóa học" },
            { number: "10K+", label: "Người dùng" },
            { number: "95%", label: "Hài lòng" },
            { number: "2.5x", label: "Tiến bộ" },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-[${colors.primary[600]}] mb-1">{stat.number}</div>
              <div className="text-sm text-[${colors.neutral[500]}]">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
