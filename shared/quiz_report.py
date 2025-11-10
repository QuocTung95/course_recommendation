import os
from dotenv import load_dotenv
import openai

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY_GPT4O")
client = openai.OpenAI(api_key=OPENAI_API_KEY)

def generate_quiz(course_chunk, num_questions=5):
    prompt = f"""
Bạn là giảng viên. Hãy tạo {num_questions} câu hỏi trắc nghiệm kiểm tra kiến thức dựa trên syllabus/khóa học sau:
{course_chunk}

Format: câu hỏi + 4 lựa chọn + đáp án đúng
"""
    response = client.chat.completions.create(
        model="GPT-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

def generate_report(profile_text, quiz_result, recommendation):
    prompt = f"""
Hồ sơ user: {profile_text}
Đề xuất khóa học: {recommendation}
Quiz: {quiz_result}

Hãy tổng hợp báo cáo tiến độ học tập, điểm mạnh/yếu và lộ trình tiếp theo.
"""
    response = client.chat.completions.create(
        model="GPT-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content
