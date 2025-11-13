import json
import os
import math
from .openai_client import create_embedding

def load_vectorstore():
    """Load vectorstore từ shared folder"""
    try:
        vectorstore_path = "../vectorstore/embedded_docs.json"
        print(f"📁 Đang tải vectorstore từ: {vectorstore_path}")

        if not os.path.exists(vectorstore_path):
            print(f"❌ Không tìm thấy file: {vectorstore_path}")
            return []

        with open(vectorstore_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            print(f"✅ Đã tải {len(data)} documents từ vectorstore")
            return data
    except Exception as e:
        print(f"❌ Lỗi tải vectorstore: {e}")
        return []

def embed_text(text: str):
    """Embed text using OpenAI - sử dụng GPT-4o-mini thay vì embedding model"""
    try:
        print(f"🔤 Đang embed text: {text[:50]}...")

        # Sử dụng GPT-4o-mini để tạo embedding đơn giản
        # Trong thực tế, bạn nên dùng embedding model, nhưng tạm thời dùng cách này
        prompt = f"""
        Tạo một vector embedding đơn giản cho văn bản sau bằng cách trả về một mảng số:
        "{text}"

        Chỉ trả về mảng JSON, không có text nào khác.
        """

        from .openai_client import chat_completion
        response = chat_completion([
            {"role": "user", "content": prompt}
        ])

        if response and 'choices' in response and len(response['choices']) > 0:
            content = response['choices'][0]['message']['content'].strip()

            # Loại bỏ markdown code blocks nếu có
            if content.startswith("```json"):
                content = content[7:-3].strip()
            elif content.startswith("```"):
                content = content[3:-3].strip()

            embedding = json.loads(content)
            print("✅ Embed text thành công!")
            return embedding
        else:
            print("❌ Không nhận được embedding từ GPT")
            return get_simple_embedding(text)

    except Exception as e:
        print(f"❌ Lỗi embed text với GPT: {e}")
        return get_simple_embedding(text)

def get_simple_embedding(text: str):
    """Tạo embedding đơn giản dựa trên từ khóa (fallback)"""
    print("🔄 Sử dụng simple embedding fallback...")

    # Từ khóa quan trọng cho backend development
    backend_keywords = ["python", "flask", "django", "api", "rest", "database", "sql", "server", "backend", "web"]

    # Tạo embedding đơn giản dựa trên sự xuất hiện của từ khóa
    embedding = []
    text_lower = text.lower()

    for keyword in backend_keywords:
        if keyword in text_lower:
            embedding.append(1.0)
        else:
            embedding.append(0.0)

    # Thêm padding nếu cần
    while len(embedding) < 10:
        embedding.append(0.0)

    print(f"✅ Tạo simple embedding với {len(embedding)} dimensions")
    return embedding

def dot_product(a, b):
    """Tính dot product thủ công"""
    if len(a) != len(b):
        # Padding để cùng chiều dài
        max_len = max(len(a), len(b))
        a = a + [0] * (max_len - len(a))
        b = b + [0] * (max_len - len(b))
    return sum(x * y for x, y in zip(a, b))

def magnitude(vector):
    """Tính magnitude thủ công"""
    return math.sqrt(sum(x * x for x in vector))

def cosine_similarity(a, b):
    """Cosine similarity không dùng numpy"""
    if not a or not b:
        return 0
    dot_prod = dot_product(a, b)
    mag_a = magnitude(a)
    mag_b = magnitude(b)
    return dot_prod / (mag_a * mag_b) if mag_a != 0 and mag_b != 0 else 0

def search_courses(query: str, top_k: int = 5):
    """Tìm khóa học phù hợp dựa trên query"""
    print(f"🔍 Đang tìm kiếm khóa học với query: {query[:100]}...")

    vectorstore = load_vectorstore()
    if not vectorstore:
        print("❌ Vectorstore trống!")
        return []

    query_embedding = embed_text(query)
    if not query_embedding:
        print("❌ Không thể tạo query embedding!")
        return []

    similarities = []

    for doc in vectorstore:
        # Sử dụng similarity đơn giản dựa trên từ khóa
        doc_text = doc.get("text", "").lower()
        query_lower = query.lower()

        # Tính similarity đơn giản
        sim = simple_text_similarity(query_lower, doc_text)
        similarities.append((sim, doc))

    # Sắp xếp theo độ tương đồng giảm dần
    similarities.sort(key=lambda x: x[0], reverse=True)

    # Lấy các khóa học duy nhất
    unique_courses = {}
    for sim, doc in similarities:
        course_title = doc["course_title"]
        if course_title not in unique_courses:
            unique_courses[course_title] = {
                "course_title": course_title,
                "text": doc["text"],
                "similarity": float(sim)
            }
        if len(unique_courses) >= top_k:
            break

    print(f"✅ Tìm thấy {len(unique_courses)} khóa học phù hợp")
    return list(unique_courses.values())

def simple_text_similarity(text1: str, text2: str):
    """Tính similarity đơn giản dựa trên từ khóa chung"""
    backend_keywords = ["python", "flask", "django", "api", "rest", "database", "sql", "server", "backend", "web", "development"]

    score = 0
    text1_lower = text1.lower()
    text2_lower = text2.lower()

    for keyword in backend_keywords:
        if keyword in text1_lower and keyword in text2_lower:
            score += 1

    # Chuẩn hóa score về 0-1
    max_score = len(backend_keywords)
    return score / max_score if max_score > 0 else 0
