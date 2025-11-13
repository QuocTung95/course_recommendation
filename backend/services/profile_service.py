# services/profile_service.py
import os
import json
from pathlib import Path
from utils.openai_client import openai_client

PROFILE_PATH = Path("./profiles")

def normalize_profile(raw_text: str) -> dict:
    """
    Dùng AI để extract thông tin quan trọng từ CV
    Focus: Skills, Experience, Education, Career Interests
    """
    prompt = f"""
    Phân tích CV sau và extract các thông tin quan trọng để đề xuất khóa học:

    CV TEXT:
    {raw_text}

    Hãy trả về JSON với format:
    {{
        "extracted_skills": ["skill1", "skill2", ...],
        "experience_level": "beginner|intermediate|advanced",
        "education_background": "mô tả ngắn",
        "career_interests": ["lĩnh vực quan tâm"],
        "current_role": "vị trí hiện tại nếu có",
        "years_of_experience": số năm,
        "strengths": ["điểm mạnh nổi bật"],
        "learning_goals": ["mục tiêu học tập"]
    }}

    Chỉ trả về JSON, không thêm text nào khác.
    """

    try:
        response = openai_client.chat_completion([
            {"role": "user", "content": prompt}
        ])

        if response:
            content = response.choices[0].message.content.strip()
            if content.startswith("```json"):
                content = content[7:-3].strip()
            elif content.startswith("```"):
                content = content[3:-3].strip()

            return json.loads(content)
        else:
            return get_fallback_profile(raw_text)

    except Exception as e:
        print(f"❌ Lỗi normalize profile: {e}")
        return get_fallback_profile(raw_text)

# Các hàm còn lại giữ nguyên...
def get_fallback_profile(raw_text: str) -> dict:
    """Fallback khi AI fails"""
    return {
        "extracted_skills": extract_skills_simple(raw_text),
        "experience_level": "intermediate",
        "education_background": "Not specified",
        "career_interests": ["Software Development"],
        "current_role": "Not specified",
        "years_of_experience": 1,
        "strengths": ["Fast learner"],
        "learning_goals": ["Improve technical skills"]
    }

def extract_skills_simple(text: str) -> list:
    """Simple skill extraction từ text"""
    skills_keywords = [
        'python', 'javascript', 'java', 'react', 'angular', 'vue', 'node', 'django', 'flask',
        'sql', 'mongodb', 'docker', 'aws', 'azure', 'git', 'html', 'css', 'typescript',
        'machine learning', 'ai', 'data science', 'backend', 'frontend', 'fullstack'
    ]

    found_skills = []
    text_lower = text.lower()

    for skill in skills_keywords:
        if skill in text_lower:
            found_skills.append(skill)

    return found_skills[:10]

def save_normalized_profile(profile_data: dict) -> dict:
    """Lưu normalized profile"""
    if not PROFILE_PATH.exists():
        PROFILE_PATH.mkdir(parents=True)

    import time
    profile_data['processed_at'] = time.time()
    return profile_data
