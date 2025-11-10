from utils.vector_store import search_courses

async def recommend_courses(profile_text: str, career_goal: str):
    """Gợi ý khóa học dựa trên profile và career goal"""
    print(f"📚 Đang gợi ý khóa học cho: {career_goal}")

    try:
        query = f"Kỹ năng và khóa học cho {career_goal}. Profile: {profile_text}"
        recommended_courses = search_courses(query, top_k=3)
        print(f"✅ Đã gợi ý {len(recommended_courses)} khóa học")
        return {"courses": recommended_courses}

    except Exception as e:
        print(f"❌ Lỗi gợi ý khóa học: {e}")
        return {
            "courses": [
                {
                    "course_title": "Python for Beginners",
                    "text": "Learn Python programming from scratch.",
                    "similarity": 0.9
                }
            ]
        }
