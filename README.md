# 🎓 RAG Learning Assistant - Hệ Thống Gợi ý Khóa Học Thông Minh

## 📖 Giới Thiệu

RAG Learning Assistant là ứng dụng AI sử dụng kỹ thuật RAG (Retrieval-Augmented Generation) để phân tích hồ sơ người dùng và gợi ý khóa học phù hợp. Hệ thống tích hợp quiz đánh giá trình độ trước và sau khi học để đo lường sự tiến bộ.

## ✨ Tính Năng Chính

- **📊 Đánh giá trình độ**: Tạo bài quiz tự động dựa trên profile và mục tiêu nghề nghiệp
- **🎓 Gợi ý khóa học thông minh**: Sử dụng vector embedding và similarity search
- **📈 Theo dõi tiến bộ**: So sánh kết quả pre-quiz và post-quiz
- **🤖 AI-Powered**: Sử dụng OpenAI GPT-4o-mini để tạo nội dung động
- **🔍 Semantic Search**: Tìm kiếm khóa học dựa trên ngữ nghĩa

## 🏗️ Kiến Trúc Hệ Thống

```
course_recomendation/
├── 📁 ingestion/          # Xử lý dữ liệu
│   ├── __init__.py
│   ├── load_data.py      # Load dữ liệu khóa học
│   ├── chunking.py       # Chunk văn bản
│   └── embed_documents.py # Embed và lưu vectorstore
├── 📁 data/
│   └── courses.json      # Database khóa học
├── 📁 vectorstore/
│   └── embedded_docs.json # Vector database
├── 📄 rag_llm.py         # Main application
├── 📄 profile.txt        # User profile
├── 📄 requirements.txt   # Dependencies
└── 📄 .env              # Environment variables
```

## 🚀 Cài Đặt & Chạy Ứng Dụng

### 1. Thiết Lập Môi Trường

```bash
# Tạo virtual environment
python -m venv venv

# Kích hoạt virtual environment
# Trên Mac/Linux:
source venv/bin/activate
# Trên Windows:
venv\Scripts\activate

# Cài đặt dependencies
pip install -r requirements.txt
```

### 2. Cấu Hình Environment Variables

Tạo file `.env` với nội dung:

```env
OPENAI_API_KEY_GPT4O=sk-k9QPcok3w5ObzLaQyGxVtg
OPENAI_API_KEY_EMBED=sk-LwPFJSWZ-yYK-yVjpkArQw
OPENAI_BASE_URL=https://aiportalapi.stu-platform.live/jpe
OPENAI_API_KEY=$OPENAI_API_KEY_EMBED
```

### 3. Chuẩn Bị Dữ Liệu

**File `profile.txt`:**

```
Tên: Nguyễn Văn A
Kinh nghiệm: 2 năm lập trình Python, từng làm dự án web Flask
Học vấn: Đại học Công nghệ Thông tin
Kỹ năng: Python, Flask, HTML, CSS, SQL
Mục tiêu: Trở thành Backend Developer chuyên nghiệp
```

### 4. Chạy Ứng Dụng

```bash
# Bước 1: Embed documents (chỉ cần chạy 1 lần)
python -m ingestion.embed_documents

# Bước 2: Chạy ứng dụng chính
python rag_llm.py
```

## 📋 Luồng Hoạt Động

1. **📚 Load dữ liệu** - Đọc khóa học từ JSON
2. **🔡 Chunk + Embed** - Xử lý văn bản và tạo vector embeddings
3. **🤖 RAG Pipeline** - Khởi tạo hệ thống tìm kiếm ngữ nghĩa
4. **👤 Nhập input** - Đọc profile và mục tiêu nghề nghiệp
5. **📝 Pre-quiz** - Tạo và chạy bài kiểm tra trình độ hiện tại
6. **🎓 Course Recommendation** - Gợi ý khóa học phù hợp
7. **📈 Post-quiz** - Đánh giá kiến thức sau khi học

## 🎮 Hướng Dẫn Sử Dụng

Khi chạy ứng dụng:

```
🚀 Khởi động hệ thống RAG Learning Assistant...
📚 Đang tải dữ liệu khóa học...
🔍 Đang tải vectorstore...

==================================================
📄 Profile đã load: Tên: Nguyễn Văn A...
🎯 Nhập mục tiêu nghề nghiệp của bạn: Backend Developer

==================================================
📝 Đang tạo bài kiểm tra trình độ hiện tại...

=== Pre-quiz - Kiểm tra trình độ hiện tại ===

Câu hỏi 1: Flask là gì trong lập trình web?
A. Một ngôn ngữ lập trình
B. Một framework web cho Python
C. Một cơ sở dữ liệu
D. Một công cụ kiểm thử
Đáp án của bạn (A/B/C/D): B
✅ Đúng!
```

## 🔧 Công Nghệ Sử Dụng

- **OpenAI API**: GPT-4o-mini cho text generation, text-embedding-3-small cho embeddings
- **Vector Database**: JSON-based local vectorstore
- **Similarity Search**: Cosine similarity cho semantic search
- **Text Processing**: Custom chunking với overlap

## 📊 Đầu Ra Mẫu

```
=== Khóa học được gợi ý ===

1. 🎓 Python for Beginners
   📖 Learn Python programming from scratch...
   🔍 Độ phù hợp: Cao

📊 SO SÁNH KẾT QUẢ:
• Điểm Pre-quiz: 2/5
• Điểm Post-quiz: 4/5
🎉 Chúc mừng! Bạn đã tiến bộ 2 điểm!
```

## 🐛 Xử Lý Lỗi Thường Gặp

- **Lỗi Import**: Chạy `python -m ingestion.embed_documents` thay vì trực tiếp
- **Lỗi API Key**: Kiểm tra file `.env` và API keys
- **Lỗi Model**: Đảm bảo sử dụng model `gpt-4o-mini`

---

**Bắt đầu hành trình học tập thông minh ngay hôm nay! 🚀**
