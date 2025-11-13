# utils/openai_client.py
import os
from openai import OpenAI
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OpenAIClient:
    def __init__(self):
        self._init_client()

    def _init_client(self):
        """Initialize OpenAI client với các API key có sẵn"""
        try:
            # Ưu tiên các API key từ .env của bạn
            api_key = (
                os.getenv("OPENAI_API_KEY_GPT4O") or
                os.getenv("OPENAI_API_KEY_EMBED") or
                os.getenv("OPENAI_API_KEY")  # Fallback
            )

            base_url = os.getenv("OPENAI_BASE_URL")

            if not api_key:
                logger.error("❌ Không tìm thấy OpenAI API key trong environment variables")
                logger.info("🔍 Kiểm tra các biến môi trường:")
                logger.info(f"   OPENAI_API_KEY_GPT4O: {'✅' if os.getenv('OPENAI_API_KEY_GPT4O') else '❌'}")
                logger.info(f"   OPENAI_API_KEY_EMBED: {'✅' if os.getenv('OPENAI_API_KEY_EMBED') else '❌'}")
                logger.info(f"   OPENAI_API_KEY: {'✅' if os.getenv('OPENAI_API_KEY') else '❌'}")
                raise ValueError("OpenAI API key is required")

            self.client = OpenAI(
                api_key=api_key,
                base_url=base_url
            )

            logger.info("✅ OpenAI client initialized successfully")

        except Exception as e:
            logger.error(f"❌ Failed to initialize OpenAI client: {e}")
            self.client = None

    def test_connection(self):
        """Test connection to OpenAI"""
        if not self.client:
            logger.error("❌ OpenAI client not initialized")
            return False

        try:
            logger.info("🔄 Testing OpenAI connection...")
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": "Say 'Hello' in Vietnamese"}],
                max_tokens=10
            )
            logger.info(f"✅ OpenAI connection test passed: {response.choices[0].message.content}")
            return True
        except Exception as e:
            logger.error(f"❌ OpenAI connection test failed: {e}")
            return False

    def chat_completion(self, messages, model="gpt-4o-mini", temperature=0.7):
        """Generate chat completion với error handling"""
        if not self.client:
            logger.error("❌ OpenAI client not available")
            return None

        try:
            response = self.client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=temperature
            )
            return response
        except Exception as e:
            logger.error(f"❌ Chat completion error: {e}")
            return None

    def create_embedding(self, text, model="text-embedding-3-small"):
        """Create embeddings với error handling"""
        if not self.client:
            logger.error("❌ OpenAI client not available")
            return None

        try:
            # Truncate very long texts
            if len(text) > 8000:
                text = text[:8000]
                logger.warning("Text truncated for embedding")

            response = self.client.embeddings.create(
                model=model,
                input=text
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"❌ Embedding error: {e}")
            return None

# Global instance - KHÔNG khởi tạo ngay để tránh lỗi khi import
openai_client = None

def get_openai_client():
    """Lazy initialization của OpenAI client"""
    global openai_client
    if openai_client is None:
        openai_client = OpenAIClient()
    return openai_client

def test_openai_connection():
    """Test connection (legacy function)"""
    client = get_openai_client()
    return client.test_connection()

def chat_completion(messages, model="gpt-4o-mini", temperature=0.7):
    """Legacy chat completion function"""
    client = get_openai_client()
    return client.chat_completion(messages, model, temperature)

def create_embedding(text, model="text-embedding-3-small"):
    """Legacy embedding function"""
    client = get_openai_client()
    return client.create_embedding(text, model)
