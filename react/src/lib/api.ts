const API_BASE = "http://localhost:8000";

export interface QuizRequest {
  profile_text: string;
  career_goal: string;
  quiz_type: string;
}

export interface ProfileRequest {
  profile_text: string;
  career_goal: string;
}

export interface Course {
  course_title: string;
  text: string;
  similarity?: number;
  url?: string;
  instructor?: string;
  level?: string;
  rating?: number;
  duration?: string;
}

export interface QuizResponse {
  quiz: Array<{
    question: string;
    options: string[];
    answer: string;
  }>;
}

export interface CoursesResponse {
  courses: Course[];
}

export const api = {
  generateQuiz: async (data: QuizRequest): Promise<QuizResponse> => {
    console.log("🚀 Gửi request tạo quiz:", data);
    const response = await fetch(`${API_BASE}/api/generate-quiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API error:", errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ Nhận response quiz:", result);
    return result;
  },

  recommendCourses: async (data: ProfileRequest): Promise<CoursesResponse> => {
    console.log("🚀 Gửi request gợi ý khóa học:", data);
    const response = await fetch(`${API_BASE}/api/recommend-courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API error:", errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ Nhận response courses:", result);
    return result;
  },

  generatePostQuiz: async (data: QuizRequest): Promise<QuizResponse> => {
    console.log("🚀 Gửi request tạo post-quiz:", data);
    const response = await fetch(`${API_BASE}/api/generate-post-quiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API error:", errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ Nhận response post-quiz:", result);
    return result;
  },
};
