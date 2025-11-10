import os
import json
import sys
from openai import OpenAI
from dotenv import load_dotenv
import numpy as np

# Thêm đường dẫn root project vào sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ingestion.load_data import load_course_file
from ingestion.embed_documents import load_vectorstore, embed_text

# Load .env tự động
load_dotenv()

# Lấy key từ .env
OPENAI_API_KEY_GPT4O = os.getenv("OPENAI_API_KEY_GPT4O")
OPENAI_API_KEY_EMBED = os.getenv("OPENAI_API_KEY_EMBED")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL")

# Khởi tạo client GPT
client_gpt4o = OpenAI(api_key=OPENAI_API_KEY_GPT4O, base_url=OPENAI_BASE_URL)
client_embed = OpenAI(api_key=OPENAI_API_KEY_EMBED, base_url=OPENAI_BASE_URL)

def cosine_similarity(a, b):
    """Tính cosine similarity giữa 2 vector"""
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def search_courses(query, vectorstore, top_k=3):
    """Tìm khóa học phù hợp nhất dựa trên query"""
    query_embedding = embed_text(query)
    similarities = []

    for doc in vectorstore:
        sim = cosine_similarity(query_embedding, doc["embedding"])
        similarities.append((sim, doc))

    # Sắp xếp theo độ tương đồng giảm dần
    similarities.sort(key=lambda x: x[0], reverse=True)

    # Lấy các khóa học duy nhất
    unique_courses = {}
    for sim, doc in similarities:
        course_title = doc["course_title"]
        if course_title not in unique_courses:
            unique_courses[course_title] = doc
        if len(unique_courses) >= top_k:
            break

    return list(unique_courses.values())

def generate_quiz(profile_text, career_goal, num_questions=5):
    """Sinh quiz dựa trên profile và mục tiêu nghề nghiệp"""
    prompt = f"""
    Bạn là một chuyên gia giáo dục. Hãy tạo một bài quiz kiểm tra trình độ {num_questions} câu hỏi về lĩnh vực {career_goal}.

    THÔNG TIN PROFILE:
    {profile_text}

    YÊU CẦU:
    - Tạo quiz phù hợp với trình độ hiện tại của người dùng
    - Câu hỏi tập trung vào kiến thức thực tế, kỹ năng cần thiết cho {career_goal}
    - Mỗi câu hỏi có 4 lựa chọn A, B, C, D
    - Chỉ có 1 đáp án đúng duy nhất
    - Độ khó từ cơ bản đến trung cấp
    - Câu hỏi về programming, frameworks, tools, best practices

    ĐỊNH DẠNG OUTPUT JSON:
    {{
        "quiz": [
            {{
                "question": "Nội dung câu hỏi",
                "options": ["A. Lựa chọn A", "B. Lựa chọn B", "C. Lựa chọn C", "D. Lựa chọn D"],
                "answer": "A"
            }}
        ]
    }}

    Chỉ trả về JSON, không thêm bất kỳ text nào khác.
    """

    try:
        response = client_gpt4o.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )

        content = response.choices[0].message.content.strip()
        # Loại bỏ markdown code blocks nếu có
        if content.startswith("```json"):
            content = content[7:-3].strip()
        elif content.startswith("```"):
            content = content[3:-3].strip()

        quiz_data = json.loads(content)
        return quiz_data["quiz"]
    except Exception as e:
        print(f"Lỗi khi tạo quiz: {e}")
        # Quiz mặc định nếu có lỗi
        return [
            {
                "question": f"Bạn đã có kinh nghiệm với {career_goal} chưa?",
                "options": [
                    "A. Có, nhiều kinh nghiệm",
                    "B. Có một ít kinh nghiệm",
                    "C. Mới bắt đầu học",
                    "D. Chưa có kinh nghiệm"
                ],
                "answer": "A"
            }
        ]

def generate_post_quiz(learned_courses, num_questions=3):
    """Sinh quiz sau khi học dựa trên các khóa học đã học"""
    course_titles = [course["course_title"] for course in learned_courses]

    prompt = f"""
    Tạo bài quiz kiểm tra kiến thức sau khi học các khóa học: {', '.join(course_titles)}.

    Số câu hỏi: {num_questions}
    Mỗi câu hỏi tập trung vào kiến thức trọng tâm của các khóa học này.
    Câu hỏi thực tế, ứng dụng kiến thức đã học.
    Mỗi câu có 4 lựa chọn A, B, C, D, chỉ 1 đáp án đúng.

    Định dạng output JSON:
    {{
        "quiz": [
            {{
                "question": "Câu hỏi 1",
                "options": ["A. Đáp án A", "B. Đáp án B", "C. Đáp án C", "D. Đáp án D"],
                "answer": "A"
            }}
        ]
    }}

    Chỉ trả về JSON, không thêm text nào khác.
    """

    try:
        response = client_gpt4o.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )

        content = response.choices[0].message.content.strip()
        if content.startswith("```json"):
            content = content[7:-3].strip()
        elif content.startswith("```"):
            content = content[3:-3].strip()

        quiz_data = json.loads(content)
        return quiz_data["quiz"]
    except Exception as e:
        print(f"Lỗi khi tạo post-quiz: {e}")
        return []

def run_quiz(quiz_data, quiz_type="Pre-quiz"):
    """Chạy quiz và tính điểm"""
    print(f"\n=== {quiz_type} ===")
    score = 0

    for idx, q in enumerate(quiz_data, start=1):
        print(f"\nCâu hỏi {idx}: {q['question']}")
        for opt in q["options"]:
            print(opt)

        while True:
            user_answer = input("Đáp án của bạn (A/B/C/D): ").strip().upper()
            if user_answer in ["A", "B", "C", "D"]:
                break
            else:
                print("Vui lòng nhập A/B/C/D")

        if user_answer == q["answer"]:
            print("✅ Đúng!")
            score += 1
        else:
            print(f"❌ Sai! Đáp án đúng là: {q['answer']}")

    print(f"\n🎯 Kết quả {quiz_type}: {score}/{len(quiz_data)} câu đúng")
    return score

def suggest_courses(profile_text, career_goal, vectorstore):
    """Gợi ý khóa học dựa trên profile và mục tiêu nghề nghiệp"""
    # Tạo query cụ thể hơn dựa trên career goal
    if "backend" in career_goal.lower():
        query = f"""
        Backend development, server-side programming, APIs, databases, Python, Flask, Django,
        Node.js, RESTful APIs, database design, authentication, authorization, server management.
        Profile: {profile_text}
        Career goal: {career_goal}
        """
    elif "data" in career_goal.lower() or "scientist" in career_goal.lower():
        query = f"""
        Data science, data analysis, machine learning, Python, pandas, numpy, scikit-learn,
        data visualization, statistics, SQL, data processing.
        Profile: {profile_text}
        Career goal: {career_goal}
        """
    elif "frontend" in career_goal.lower() or "web" in career_goal.lower():
        query = f"""
        Frontend development, web development, HTML, CSS, JavaScript, React, Vue, Angular,
        responsive design, user interface, user experience.
        Profile: {profile_text}
        Career goal: {career_goal}
        """
    else:
        query = f"Profile: {profile_text}. Career goal: {career_goal}"

    recommended_courses = search_courses(query, vectorstore, top_k=3)
    return recommended_courses

def display_course_recommendations(courses):
    """Hiển thị khóa học được gợi ý"""
    print("\n=== Khóa học được gợi ý ===")
    if not courses:
        print("❌ Không tìm thấy khóa học phù hợp")
        return

    for i, course in enumerate(courses, 1):
        print(f"\n{i}. 🎓 {course['course_title']}")
        print(f"   📖 {course['text'][:150]}...")
        print(f"   🔍 Độ phù hợp: Cao")

def run_pipeline():
    """Luồng chính của chương trình"""
    print("🚀 Khởi động hệ thống RAG Learning Assistant...")

    # 1. Load dữ liệu khóa học
    print("📚 Đang tải dữ liệu khóa học...")
    courses = load_course_file()

    # 2. Load vectorstore (đã được embed sẵn)
    print("🔍 Đang tải vectorstore...")
    vectorstore = load_vectorstore()
    if not vectorstore:
        print("❌ Vectorstore trống. Hãy chạy embed_documents.py trước!")
        return

    # 3. Nhập input người dùng
    print("\n" + "="*50)
    try:
        with open("profile.txt", "r", encoding="utf-8") as f:
            profile_text = f.read().strip()
        print(f"📄 Profile đã load: {profile_text[:100]}...")
    except FileNotFoundError:
        print("❌ Không tìm thấy file profile.txt")
        return

    career_goal = input("🎯 Nhập mục tiêu nghề nghiệp của bạn (ví dụ: Backend Developer, Data Scientist): ").strip()
    if not career_goal:
        career_goal = "Software Developer"

    # 4. Kiểm tra trình độ hiện tại (Pre-quiz)
    print("\n" + "="*50)
    print("📝 Đang tạo bài kiểm tra trình độ hiện tại...")
    pre_quiz = generate_quiz(profile_text, career_goal)

    if not pre_quiz:
        print("❌ Không thể tạo bài quiz. Sử dụng quiz mặc định.")
        pre_quiz = [
            {
                "question": "Đánh giá trình độ hiện tại của bạn?",
                "options": ["A. Cao", "B. Trung bình", "C. Cơ bản", "D. Mới bắt đầu"],
                "answer": "B"
            }
        ]

    pre_score = run_quiz(pre_quiz, "Pre-quiz - Kiểm tra trình độ hiện tại")

    # 5. Gợi ý khóa học
    print("\n" + "="*50)
    print("💡 Đang gợi ý khóa học phù hợp...")
    recommended_courses = suggest_courses(profile_text, career_goal, vectorstore)
    display_course_recommendations(recommended_courses)

    # 6. Quiz sau khi học (Post-quiz)
    if recommended_courses:
        input("\n⏰ Nhấn Enter để tiếp tục với bài kiểm tra sau khi học...")

        print("\n" + "="*50)
        print("📝 Đang tạo bài kiểm tra sau khi học...")
        post_quiz = generate_post_quiz(recommended_courses)

        if post_quiz:
            post_score = run_quiz(post_quiz, "Post-quiz - Kiểm tra sau khi học")

            # So sánh kết quả
            print("\n" + "="*50)
            print("📊 SO SÁNH KẾT QUẢ:")
            print(f"• Điểm Pre-quiz: {pre_score}/{len(pre_quiz)}")
            print(f"• Điểm Post-quiz: {post_score}/{len(post_quiz)}")

            improvement = post_score - pre_score
            if improvement > 0:
                print(f"🎉 Chúc mừng! Bạn đã tiến bộ {improvement} điểm!")
            elif improvement == 0:
                print("📈 Kết quả ổn định. Hãy tiếp tục ôn tập!")
            else:
                print("💪 Hãy tiếp tục ôn tập và thực hành nhiều hơn!")
        else:
            print("❌ Không thể tạo bài kiểm tra sau khi học")
    else:
        print("❌ Không có khóa học để tạo bài kiểm tra sau khi học")

    print("\n" + "="*50)
    print("✨ Hoàn thành chương trình học! Chúc bạn thành công! ✨")

if __name__ == "__main__":
    run_pipeline()
