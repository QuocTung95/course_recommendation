# courses_analyzer/data_analyzer.py
#!/usr/bin/env python3
"""
Script phân tích dữ liệu Udemy courses và lưu vào ChromaDB
KHÔNG sử dụng OpenAI embedding - dùng ChromaDB default
"""

import pandas as pd
import chromadb
from chromadb.config import Settings
import os
from dotenv import load_dotenv
import json
import time
from typing import List, Dict, Any, Tuple
import logging
import re
from pathlib import Path

# Cấu hình logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class UdemyCourseAnalyzer:
    def __init__(self):
        """Khởi tạo analyzer - KHÔNG dùng OpenAI embedding"""

        # Khởi tạo ChromaDB
        self.chroma_path = os.getenv('CHROMA_DB_PATH', './chroma_db')
        self.collection_name = os.getenv('COLLECTION_NAME', 'udemy_courses')

        # Tạo ChromaDB client
        self.chroma_client = chromadb.PersistentClient(
            path=self.chroma_path
        )

        # Xóa collection cũ nếu tồn tại và tạo mới
        try:
            self.chroma_client.delete_collection(self.collection_name)
            logger.info(f"🗑️ Đã xóa collection cũ: {self.collection_name}")
        except:
            logger.info(f"ℹ️ Không có collection cũ để xóa: {self.collection_name}")

        # Tạo collection mới - ChromaDB sẽ dùng default embedding
        self.collection = self.chroma_client.create_collection(
            name=self.collection_name,
            metadata={"description": "Udemy courses data for AI chatbot"}
        )
        logger.info(f"✅ Đã tạo collection mới: {self.collection_name}")

    def clean_text(self, text: str) -> str:
        """Làm sạch text, xử lý encoding issues"""
        if pd.isna(text) or text is None:
            return ""

        text = str(text)
        text = text.encode('utf-8', errors='ignore').decode('utf-8')
        text = re.sub(r'[^\w\s\.,!?\-\(\)\[\]:]', ' ', text)
        text = ' '.join(text.split())
        return text.strip()

    def parse_list_field(self, field_value: str) -> List[str]:
        """Parse các trường dạng list từ CSV"""
        if pd.isna(field_value) or field_value is None:
            return []

        field_value = str(field_value).strip()

        if field_value.startswith('[') and field_value.endswith(']'):
            try:
                field_value = field_value.replace("'", '"')
                parsed_list = json.loads(field_value)
                return [self.clean_text(item) for item in parsed_list if item]
            except json.JSONDecodeError:
                pass

        items = re.split(r'[,;]', field_value.strip('[]'))
        return [self.clean_text(item) for item in items if item.strip()]

    def create_course_document(self, course_row: pd.Series) -> Tuple[str, Dict[str, Any]]:
        """Tạo document đơn giản cho mỗi course"""
        # Tạo text document tập trung vào keywords để search tốt
        doc_parts = [
            f"COURSE TITLE: {course_row['Title']}",
            f"DESCRIPTION: {course_row['Detailed Description']}",
            f"INSTRUCTOR: {course_row['Instructor']}",
            f"LEVEL: {course_row['Level']}",
            f"RATING: {course_row['Rating']}",
            f"DURATION: {course_row['Duration']}",
        ]

        # Thêm learning outcomes - quan trọng cho search
        if course_row['What You\'ll Learn']:
            doc_parts.append("LEARNING OUTCOMES:")
            doc_parts.extend([f"- {item}" for item in course_row['What You\'ll Learn'][:10]])  # Giới hạn 10 items

        # Thêm requirements
        if course_row['Requirements']:
            doc_parts.append("REQUIREMENTS:")
            doc_parts.extend([f"- {item}" for item in course_row['Requirements'][:5]])

        # Thêm target audience
        if course_row['Target Audience']:
            doc_parts.append("TARGET AUDIENCE:")
            doc_parts.extend([f"- {item}" for item in course_row['Target Audience'][:5]])

        document_text = "\n".join(doc_parts)

        # Tạo metadata phong phú để filter
        metadata = {
            'title': course_row['Title'],
            'instructor': course_row['Instructor'],
            'level': course_row['Level'].lower() if course_row['Level'] else 'all levels',
            'rating': float(course_row['Rating']) if pd.notna(course_row['Rating']) else 0.0,
            'duration': course_row['Duration'],
            'link': course_row['Link'],
            'price': getattr(course_row, 'Current Price', 'Free'),
            'skills': ', '.join(self.extract_keywords_from_title(course_row['Title']))
        }

        return document_text, metadata

    def extract_keywords_from_title(self, title: str) -> List[str]:
        """Extract key technology/topic keywords from course title"""
        if not title:
            return []

        tech_keywords = {
            'python', 'javascript', 'java', 'react', 'angular', 'vue', 'node', 'nodejs',
            'django', 'flask', 'laravel', 'spring', 'express', 'mongodb', 'mysql',
            'postgresql', 'html', 'css', 'typescript', 'php', 'ruby', 'go', 'rust',
            'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'machine learning', 'ml',
            'artificial intelligence', 'ai', 'data science', 'blockchain', 'flutter',
            'swift', 'kotlin', 'android', 'ios', 'unity', 'tensorflow', 'pytorch',
            'backend', 'frontend', 'fullstack', 'web development', 'mobile development',
            'cloud', 'devops', 'database', 'sql', 'nosql'
        }

        title_lower = title.lower()
        found_keywords = [keyword for keyword in tech_keywords if keyword in title_lower]

        return found_keywords[:8]  # Limit to 8 keywords

    def load_and_process_data(self, csv_file_path: str) -> pd.DataFrame:
        """Load và xử lý dữ liệu từ file CSV"""
        logger.info(f"Đang load dữ liệu từ: {csv_file_path}")

        try:
            df = pd.read_csv(csv_file_path, encoding='utf-8')
        except UnicodeDecodeError:
            try:
                df = pd.read_csv(csv_file_path, encoding='latin-1')
            except UnicodeDecodeError:
                df = pd.read_csv(csv_file_path, encoding='cp1252')

        logger.info(f"✅ Đã load {len(df)} courses từ CSV")

        # Làm sạch dữ liệu cơ bản
        df['Title'] = df['Title'].apply(self.clean_text)
        df['Detailed Description'] = df['Detailed Description'].apply(self.clean_text)
        df['Instructor'] = df['Instructor'].apply(self.clean_text)
        df['Level'] = df['Level'].apply(self.clean_text)
        df['Duration'] = df['Duration'].apply(self.clean_text)

        # Parse các trường list
        df['What You\'ll Learn'] = df['What You\'ll Learn'].apply(self.parse_list_field)
        df['Requirements'] = df['Requirements'].apply(self.parse_list_field)
        df['Target Audience'] = df['Target Audience'].apply(self.parse_list_field)

        # Xử lý rating
        df['Rating'] = pd.to_numeric(df['Rating'], errors='coerce').fillna(0.0)

        return df

    def process_and_store_courses_fast(self, df: pd.DataFrame, sample_size: int = None):
        """Xử lý và lưu courses vào ChromaDB - KHÔNG dùng embedding, rất nhanh"""
        if sample_size:
            df = df.head(sample_size)
            logger.info(f"🧪 Đang xử lý {sample_size} courses mẫu...")
        else:
            logger.info(f"🚀 Đang xử lý {len(df)} courses...")

        documents = []
        metadatas = []
        ids = []

        successful = 0

        for course_idx, row in df.iterrows():
            try:
                if course_idx % 50 == 0:  # Log ít hơn để đỡ spam
                    logger.info(f"📝 Đang xử lý course {course_idx + 1}/{len(df)}...")

                # Tạo document
                document_text, metadata = self.create_course_document(row)

                # Tạo ID
                course_id = f"course_{course_idx}"

                documents.append(document_text)
                metadatas.append(metadata)
                ids.append(course_id)

                successful += 1

                # Lưu theo batch để tránh memory issues
                if len(documents) >= 100:
                    self.collection.add(
                        documents=documents,
                        metadatas=metadatas,
                        ids=ids
                    )
                    logger.info(f"✅ Đã lưu batch {len(documents)} courses")
                    documents, metadatas, ids = [], [], []

            except Exception as e:
                logger.error(f"❌ Lỗi khi xử lý course {course_idx}: {e}")
                continue

        # Lưu batch cuối cùng
        if documents:
            self.collection.add(
                documents=documents,
                metadatas=metadatas,
                ids=ids
            )
            logger.info(f"✅ Đã lưu batch cuối {len(documents)} courses")

        logger.info(f"🎉 Hoàn thành! Đã lưu {successful} courses vào ChromaDB")
        return successful

    def get_collection_info(self):
        """Hiển thị thông tin collection"""
        count = self.collection.count()
        logger.info(f"📊 Collection '{self.collection_name}' có {count} documents")
        return count

def main():
    """Hàm main để chạy script"""
    print("🚀 Udemy Course Data Analyzer - Fast Version (No Embedding)")
    print("=" * 60)

    # Khởi tạo analyzer
    analyzer = UdemyCourseAnalyzer()

    # File CSV path
    csv_file = Path(__file__).resolve().parent.parent / "data" / "UDEMY_2025.csv"

    if not os.path.exists(csv_file):
        logger.error(f"❌ Không tìm thấy file: {csv_file}")
        return

    # Load dữ liệu
    df = analyzer.load_and_process_data(csv_file)

    print(f"\n📊 Tổng số courses: {len(df)}")
    print(f"🎯 3 courses đầu tiên:")
    for idx, row in df.head(3).iterrows():
        print(f"  {idx + 1}. {row['Title'][:80]}...")

    # Hỏi sample size
    print(f"\n⚡ PHƯƠNG PHÁP NHANH: Không dùng OpenAI Embedding")
    print(f"   ChromaDB sẽ tự động xử lý text search")
    print(f"\n🧪 Bạn muốn xử lý bao nhiêu courses?")
    print("   (Nhập số, hoặc 'all' để xử lý tất cả)")
    response = input("   Số lượng: ").strip().lower()

    sample_size = None
    if response != 'all' and response.isdigit():
        sample_size = min(int(response), len(df))
        print(f"   ✅ Sẽ xử lý {sample_size} courses")
    else:
        sample_size = len(df)
        print(f"   ✅ Sẽ xử lý tất cả {sample_size} courses")

    # Xác nhận
    confirm = input(f"\n🚀 Bắt đầu xử lý NHANH? (y/n): ").strip().lower()
    if confirm != 'y':
        print("❌ Đã hủy")
        return

    # Xử lý
    print(f"\n⏳ Đang xử lý NHANH (không dùng embedding)...")
    start_time = time.time()
    successful = analyzer.process_and_store_courses_fast(df, sample_size)
    end_time = time.time()

    # Kết quả
    final_count = analyzer.get_collection_info()

    print(f"\n🎉 HOÀN THÀNH SIÊU NHANH!")
    print(f"⏱️  Thời gian: {end_time - start_time:.2f} giây")
    print(f"📊 Courses processed: {successful}")
    print(f"💾 ChromaDB: {analyzer.chroma_path}")
    print(f"📚 Collection: {analyzer.collection_name}")
    print(f"✅ Documents: {final_count}")

    # Test query
    print(f"\n🔍 Testing search...")
    try:
        test_results = analyzer.collection.query(
            query_texts=["python backend development"],
            n_results=3
        )
        if test_results['documents']:
            print(f"✅ Search test thành công! Tìm thấy {len(test_results['documents'][0])} kết quả")
        else:
            print("⚠️ Search test không có kết quả")
    except Exception as e:
        print(f"❌ Search test lỗi: {e}")

if __name__ == "__main__":
    main()
