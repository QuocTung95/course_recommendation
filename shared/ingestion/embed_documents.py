import json
import os
import sys
from dotenv import load_dotenv
from openai import OpenAI

# Thêm đường dẫn root project vào sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ingestion.load_data import load_course_file
from ingestion.chunking import chunk_text

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY_EMBED")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL")

client_embed = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)

VECTORSTORE_FILE = "./vectorstore/embedded_docs.json"

def embed_text(text):
    resp = client_embed.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return resp.data[0].embedding

def embed_courses_and_save():
    courses = load_course_file()
    all_vectors = []
    for course in courses:
        text = course.get("title", "") + " " + course.get("description", "")
        chunks = chunk_text(text)
        for chunk in chunks:
            vector = embed_text(chunk)
            all_vectors.append({
                "course_title": course.get("title", ""),
                "text": chunk,
                "embedding": vector
            })
    os.makedirs(os.path.dirname(VECTORSTORE_FILE), exist_ok=True)
    with open(VECTORSTORE_FILE, "w", encoding="utf-8") as f:
        json.dump(all_vectors, f, ensure_ascii=False, indent=2)
    print(f"✅ Đã lưu {len(all_vectors)} vectors vào {VECTORSTORE_FILE}")

def load_vectorstore():
    if not os.path.exists(VECTORSTORE_FILE):
        return []
    with open(VECTORSTORE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

if __name__ == "__main__":
    embed_courses_and_save()
