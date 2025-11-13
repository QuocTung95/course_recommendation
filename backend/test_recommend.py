# test_recommend.py
import requests
import json

def test_recommend_courses():
    url = "http://localhost:8000/api/recommend-courses"

    # Test payload với profile analysis đầy đủ
    payload = {
        "profile_text": "Python developer with experience in Flask and Django",
        "career_goal": "Backend Developer",
        "profile_analysis": {
            "extracted_skills": ["python", "flask", "django", "sql"],
            "experience_level": "intermediate",
            "career_interests": ["Backend Development", "API Design"],
            "learning_goals": ["Advanced Python", "System Design"]
        }
    }

    try:
        print("🚀 Testing recommend-courses API...")
        response = requests.post(url, json=payload)

        print(f"📊 Status Code: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            courses = data.get('courses', [])
            print(f"✅ Found {len(courses)} courses")

            for i, course in enumerate(courses, 1):
                print(f"\n--- Course {i} ---")
                print(f"Title: {course.get('course_title')}")
                print(f"Similarity: {course.get('similarity')}")
                print(f"Level: {course.get('level')}")
                print(f"Instructor: {course.get('instructor')}")
                print(f"Rating: {course.get('rating')}")
        else:
            print(f"❌ Error: {response.text}")

    except Exception as e:
        print(f"❌ Request failed: {e}")

if __name__ == "__main__":
    test_recommend_courses()
