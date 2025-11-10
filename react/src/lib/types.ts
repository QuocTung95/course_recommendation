export interface Course {
  course_title: string;
  text: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface UserProfile {
  name: string;
  experience: string;
  education: string;
  skills: string;
  goal: string;
}
