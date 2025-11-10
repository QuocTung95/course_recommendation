import json
import os

def load_course_file(file_path="./data/courses.json"):
    if not os.path.exists(file_path):
        print(f"Không tìm thấy file: {file_path}")
        return []
    with open(file_path, "r", encoding="utf-8") as f:
        courses = json.load(f)
    print(f"✅ Đã load {len(courses)} khóa học từ {file_path}")
    return courses

if __name__ == "__main__":
    courses = load_course_file()
    for c in courses:
        print(c)
