# services/quiz_service.py
import json
from utils.openai_client import openai_client

async def generate_quiz(profile_text: str, career_goal: str, quiz_type: str = "pre-quiz", profile_analysis: dict = None):
    """Generate quiz dựa trên profile analysis"""

    try:
        if quiz_type == "pre-quiz":
            return await generate_pre_quiz(profile_analysis or {}, career_goal)
        else:
            return await generate_post_quiz(career_goal)
    except Exception as e:
        print(f"❌ Lỗi generate_quiz: {e}")
        return get_fallback_quiz(quiz_type, career_goal)

async def generate_pre_quiz(profile_analysis: dict, career_goal: str):
    """Pre-quiz tập trung vào thu thập thông tin thêm"""

    prompt = f"""
    Tạo một bài quiz 5 câu để thu thập thêm thông tin về người dùng, dựa trên:

    THÔNG TIN ĐÃ CÓ TỪ CV:
    - Kỹ năng hiện tại: {profile_analysis.get('extracted_skills', [])}
    - Kinh nghiệm: {profile_analysis.get('experience_level', 'Không xác định')}
    - Mục tiêu nghề nghiệp: {career_goal}

    HÃY TẠO CÂU HỎI TẬP TRUNG VÀO:
    1. Mức độ thành thạo với các kỹ năng quan trọng cho {career_goal}
    2. Mong muốn phát triển kỹ năng nào nhất
    3. Kinh nghiệm thực tế với dự án
    4. Mục tiêu học tập cụ thể
    5. Ưu tiên học tập (lý thuyết vs thực hành)

    Mỗi câu hỏi có 4 lựa chọn, chỉ 1 đáp án đúng.

    TRẢ VỀ ĐÚNG FORMAT JSON SAU:
    {{
        "quiz": [
            {{
                "question": "Câu hỏi 1...",
                "options": ["A. Lựa chọn A", "B. Lựa chọn B", "C. Lựa chọn C", "D. Lựa chọn D"],
                "answer": "A",
                "purpose": "thu_thap_ky_nang"
            }},
            {{
                "question": "Câu hỏi 2...",
                "options": ["A. Lựa chọn A", "B. Lựa chọn B", "C. Lựa chọn C", "D. Lựa chọn D"],
                "answer": "B",
                "purpose": "mong_muon_hoc_tap"
            }}
        ]
    }}

    Chỉ trả về JSON, không có text nào khác.
    """

    try:
        response = openai_client.chat_completion([
            {"role": "user", "content": prompt}
        ])

        if response:
            content = response.choices[0].message.content.strip()
            print(f"📝 Raw AI response: {content[:200]}...")

            # Loại bỏ markdown code blocks nếu có
            if content.startswith("```json"):
                content = content[7:]
            if content.endswith("```"):
                content = content[:-3]
            content = content.strip()

            quiz_data = json.loads(content)
            print(f"✅ Đã tạo pre-quiz với {len(quiz_data.get('quiz', []))} câu hỏi")
            return quiz_data
        else:
            print("❌ Không có response từ OpenAI")
            return get_fallback_pre_quiz(career_goal)

    except json.JSONDecodeError as e:
        print(f"❌ Lỗi parse JSON từ AI: {e}")
        return get_fallback_pre_quiz(career_goal)
    except Exception as e:
        print(f"❌ Lỗi tạo pre-quiz: {e}")
        return get_fallback_pre_quiz(career_goal)

async def generate_post_quiz(career_goal: str):
    """Post-quiz đánh giá kiến thức sau khi học"""

    prompt = f"""
    Tạo quiz 5 câu kiểm tra kiến thức về {career_goal} sau khi học.
    Câu hỏi thực tế, ứng dụng, tập trung vào kiến thức quan trọng.

    TRẢ VỀ ĐÚNG FORMAT JSON SAU:
    {{
        "quiz": [
            {{
                "question": "Câu hỏi 1...",
                "options": ["A. Lựa chọn A", "B. Lựa chọn B", "C. Lựa chọn C", "D. Lựa chọn D"],
                "answer": "A",
                "explanation": "Giải thích tại sao đáp án này đúng"
            }}
        ]
    }}

    Chỉ trả về JSON, không có text nào khác.
    """

    try:
        response = openai_client.chat_completion([
            {"role": "user", "content": prompt}
        ])

        if response:
            content = response.choices[0].message.content.strip()
            print(f"📝 Raw AI response: {content[:200]}...")

            if content.startswith("```json"):
                content = content[7:]
            if content.endswith("```"):
                content = content[:-3]
            content = content.strip()

            quiz_data = json.loads(content)
            print(f"✅ Đã tạo post-quiz với {len(quiz_data.get('quiz', []))} câu hỏi")
            return quiz_data
        else:
            return get_fallback_post_quiz(career_goal)

    except json.JSONDecodeError as e:
        print(f"❌ Lỗi parse JSON từ AI: {e}")
        return get_fallback_post_quiz(career_goal)
    except Exception as e:
        print(f"❌ Lỗi tạo post-quiz: {e}")
        return get_fallback_post_quiz(career_goal)

def get_fallback_pre_quiz(career_goal: str):
    """Fallback pre-quiz khi AI fails"""
    return {
        "quiz": [
            {
                "question": f"Bạn có kinh nghiệm với {career_goal} ở mức độ nào?",
                "options": [
                    "A. Mới bắt đầu - Dưới 1 năm kinh nghiệm",
                    "B. Có chút kinh nghiệm - 1-3 năm kinh nghiệm",
                    "C. Trung cấp - 3-5 năm kinh nghiệm",
                    "D. Nâng cao - Trên 5 năm kinh nghiệm"
                ],
                "answer": "A",
                "purpose": "kinh_nghiem"
            },
            {
                "question": "Bạn muốn tập trung phát triển kỹ năng nào nhất?",
                "options": [
                    "A. Kỹ năng lập trình cốt lõi",
                    "B. Kiến trúc hệ thống và design patterns",
                    "C. DevOps và deployment",
                    "D. Soft skills và teamwork"
                ],
                "answer": "A",
                "purpose": "mong_muon_hoc_tap"
            }
        ]
    }

def get_fallback_post_quiz(career_goal: str):
    """Fallback post-quiz khi AI fails"""
    return {
        "quiz": [
            {
                "question": f"Kiến thức nào quan trọng nhất trong {career_goal}?",
                "options": [
                    "A. Fundamental concepts và syntax",
                    "B. Advanced techniques và frameworks",
                    "C. Practical projects và real-world applications",
                    "D. Tất cả đều quan trọng như nhau"
                ],
                "answer": "D",
                "explanation": "Tất cả các khía cạnh đều quan trọng cho sự phát triển toàn diện"
            },
            {
                "question": "Khi nào nên sử dụng microservices architecture?",
                "options": [
                    "A. Cho mọi dự án",
                    "B. Khi team có ít hơn 5 developer",
                    "C. Khi hệ thống cần scale và độc lập deployment",
                    "D. Chỉ cho các dự án lớn của enterprise"
                ],
                "answer": "C",
                "explanation": "Microservices phù hợp khi cần scale và deployment độc lập các service"
            }
        ]
    }

def get_fallback_quiz(quiz_type: str, career_goal: str):
    """Fallback chung cho mọi loại quiz"""
    if quiz_type == "pre-quiz":
        return get_fallback_pre_quiz(career_goal)
    else:
        return get_fallback_post_quiz(career_goal)
