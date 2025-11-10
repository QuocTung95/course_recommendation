import os
import openai
from dotenv import load_dotenv

# Load .env từ thư mục backend
load_dotenv()

def get_api_key(key_name):
    """Lấy API key và in ra để debug"""
    key = os.getenv(key_name)
    print(f"🔑 {key_name}: {'✅' if key else '❌'} {'Có' if key else 'Không có'}")
    return key

# Debug: In tất cả biến môi trường
print("=" * 50)
print("🔍 KIỂM TRA BIẾN MÔI TRƯỜNG:")
api_key_gpt4o = get_api_key("OPENAI_API_KEY_GPT4O")
api_key_embed = get_api_key("OPENAI_API_KEY_EMBED")
base_url = get_api_key("OPENAI_BASE_URL")
print("=" * 50)

# Cấu hình OpenAI cho phiên bản cũ
try:
    # Phiên bản 0.28.1 dùng openai.api_key thay vì Client
    openai.api_key = api_key_gpt4o or api_key_embed

    if base_url:
        openai.api_base = base_url

    print("✅ Cấu hình OpenAI thành công!")

except Exception as e:
    print(f"❌ Lỗi cấu hình OpenAI: {e}")
    exit(1)

def test_openai_connection():
    """Kiểm tra kết nối OpenAI - phiên bản cũ"""
    try:
        print("🔄 Đang kiểm tra kết nối OpenAI...")
        # Phiên bản cũ dùng openai.Model.list()
        response = openai.Model.list()
        print(f"✅ Kết nối thành công! Có {len(response['data'])} models")

        # In ra 3 models đầu tiên để debug
        for model in response['data'][:3]:
            print(f"   - {model['id']}")
        return True
    except Exception as e:
        print(f"❌ Lỗi kết nối OpenAI: {e}")
        return False

# Các hàm helper cho phiên bản cũ
def chat_completion(messages, model="gpt-4o-mini", temperature=0.7):
    """Wrapper cho chat completion phiên bản cũ"""
    try:
        response = openai.ChatCompletion.create(
            model=model,
            messages=messages,
            temperature=temperature
        )
        return response
    except Exception as e:
        print(f"❌ Lỗi chat completion: {e}")
        return None

def create_embedding(text, model="text-embedding-3-small"):
    """Wrapper cho embedding phiên bản cũ"""
    try:
        response = openai.Embedding.create(
            model=model,
            input=text
        )
        return response
    except Exception as e:
        print(f"❌ Lỗi tạo embedding: {e}")
        return None
