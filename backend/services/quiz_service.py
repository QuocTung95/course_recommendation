import json
from utils.openai_client import chat_completion

async def generate_quiz(profile_text: str, career_goal: str, quiz_type: str = "pre-quiz"):
    """Generate quiz dựa trên profile và career goal - phiên bản cũ"""
    print(f"🎯 Đang tạo {quiz_type} cho: {career_goal}")

    try:
        prompt = f"""
        Tạo quiz 3 câu hỏi đơn giản về {career_goal}.
        Profile: {profile_text}

        Trả về JSON format:
        {{"quiz": [{{"question": "...", "options": ["A...", "B...", "C...", "D..."], "answer": "A"}}]}}
        """

        response = chat_completion([
            {"role": "user", "content": prompt}
        ])

        if response and 'choices' in response and len(response['choices']) > 0:
            content = response['choices'][0]['message']['content'].strip()
            print(f"🤖 OpenAI response: {content[:100]}...")

            # Loại bỏ markdown code blocks nếu có
            if content.startswith("```json"):
                content = content[7:-3].strip()
            elif content.startswith("```"):
                content = content[3:-3].strip()

            quiz_data = json.loads(content)
            print(f"✅ Đã tạo {len(quiz_data.get('quiz', []))} câu hỏi")
            return quiz_data
        else:
            print("❌ Không nhận được response từ OpenAI")
            return get_fallback_quiz(career_goal)

    except Exception as e:
        print(f"❌ Lỗi tạo quiz: {e}")
        return get_fallback_quiz(career_goal)

def get_fallback_quiz(career_goal):
    """Fallback quiz data"""
    return {
        "quiz": [
            {
                "question": f"Bạn có kinh nghiệm với {career_goal} không?",
                "options": ["A. Có nhiều kinh nghiệm", "B. Có ít kinh nghiệm", "C. Mới bắt đầu", "D. Chưa có kinh nghiệm"],
                "answer": "A"
            },
            {
                "question": f"Bạn đã học về {career_goal} chưa?",
                "options": ["A. Đã học chuyên sâu", "B. Đã học cơ bản", "C. Đang tìm hiểu", "D. Chưa học"],
                "answer": "B"
            }
        ]
    }

async def generate_post_quiz(career_goal: str):
    """Generate post-quiz"""
    return await generate_quiz("", career_goal, "post-quiz")
