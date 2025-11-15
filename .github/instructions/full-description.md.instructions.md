# 🎯 Learning Assistant - Hệ Thống Đề Xuất Khóa Học Thông Minh

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Python](https://img.shields.io/badge/python-3.11+-green)
![Next.js](https://img.shields.io/badge/next.js-14.0+-black)

## 📖 Giới Thiệu

**Learning Assistant** là hệ thống AI đề xuất khóa học cá nhân hóa dựa trên phân tích CV và mục tiêu nghề nghiệp. Ứng dụng sử dụng RAG (Retrieval-Augmented Generation) kết hợp với OpenAI để tạo ra lộ trình học tập tối ưu cho từng người dùng.

## 🚀 Tính Năng Chính

### 🤖 AI-Powered Analysis

- **Phân tích CV tự động**: Extract thông tin kỹ năng, kinh nghiệm từ CV
- **Đánh giá trình độ**: Tạo bài quiz đánh giá năng lực hiện tại
- **Gợi ý thông minh**: Đề xuất khóa học phù hợp với profile và mục tiêu

### 📚 Personalized Learning Path

- **Lộ trình cá nhân hóa**: Khóa học được đề xuất dựa trên phân tích AI
- **Theo dõi tiến bộ**: Pre-quiz và Post-quiz để đo lường sự cải thiện
- **Đa dạng lĩnh vực**: Backend, Frontend, Data Science, DevOps, v.v.

### 🎯 User Experience

- **Upload CV đa định dạng**: PDF, DOCX, TXT
- **Giao diện hiện đại**: React với Tailwind CSS và Framer Motion
- **Real-time processing**: Xử lý và phân tích dữ liệu nhanh chóng

## 🏗️ Kiến Trúc Hệ Thống

```
Frontend (React) ←→ Backend (FastAPI) ←→ AI Services ←→ Vector Database
     ↓                    ↓                    ↓              ↓
Next.js UI          FastAPI Server      OpenAI GPT-4o    ChromaDB
Tailwind CSS        Python 3.11+        Embeddings       Udemy Courses
```

## 📁 Cấu Trúc Thư Mục

```bash
course_recomendation/
├── backend/                 # FastAPI Backend
│   ├── chroma_db/          # Vector database (ChromaDB)
│   ├── courses_analyzer/   # Data processing scripts
│   │   ├── data_analyzer.py    # Import courses to ChromaDB
│   │   └── setup.py           # Setup and dependencies check
│   ├── data/               # Raw data files
│   │   └── UDEMY_2025.csv     # Udemy courses dataset
│   ├── services/           # Business logic
│   │   ├── course_service.py   # Course recommendations
│   │   ├── profile_service.py  # CV analysis
│   │   └── quiz_service.py     # Quiz generation
│   ├── utils/              # Utilities
│   │   ├── file_parser.py      # CV file parsing
│   │   ├── openai_client.py    # OpenAI API wrapper
│   │   └── vector_store.py     # ChromaDB operations
│   ├── main.py            # FastAPI application
│   └── requirements.txt   # Python dependencies
└── react/                 # Next.js Frontend
    ├── src/
    │   ├── app/           # Next.js app router
    │   ├── components/    # React components
    │   │   ├── Layout.tsx         # Main layout
    │   │   ├── ProfileUpload.tsx  # CV upload component
    │   │   ├── QuizComponent.tsx  # Quiz interface
    │   │   ├── CourseRecommendations.tsx # Course display
    │   │   └── CompletionScreen.tsx      # Results summary
    │   ├── lib/           # Utilities and API calls
    │   └── theme/         # Design system
    └── package.json       # Node.js dependencies
```

## 🔄 Workflow Chi Tiết

### 1. **📄 Upload & Phân Tích CV**

```python
# Input: CV file + Career goal
# Process: AI extract structured data
# Output: Profile analysis JSON

{
  "extracted_skills": ["python", "flask", "sql"],
  "experience_level": "intermediate",
  "career_interests": ["Backend Development"],
  "learning_goals": ["Advanced Python", "System Design"]
}
```

### 2. **🎯 Tạo Pre-Quiz (AI Generated)**

```python
# Input: Profile analysis
# Process: OpenAI GPT-4o generates personalized quiz
# Output: 5 câu hỏi đánh giá

{
  "quiz": [
    {
      "question": "Bạn có kinh nghiệm với Python ở mức độ nào?",
      "options": ["A. Mới bắt đầu", "B. Có chút kinh nghiệm", ...],
      "answer": "A",
      "purpose": "kinh_nghiem"
    }
  ]
}
```

### 3. **📚 Đề Xuất Khóa Học (Vector Search)**

```python
# Input: Profile + Quiz answers + Career goal
# Process: ChromaDB semantic search
# Output: Top 5 courses phù hợp

{
  "courses": [
    {
      "course_title": "Complete Python Backend Development",
      "similarity": 0.89,
      "level": "Intermediate",
      "rating": 4.6,
      "instructor": "Expert Instructor"
    }
  ]
}
```

### 4. **📝 Post-Quiz & Đánh Giá**

```python
# Input: Career goal (sau khi học)
# Process: AI generates knowledge assessment quiz
# Output: Quiz kiểm tra kiến thức + Progress tracking
```

## 🛠️ Cài Đặt & Chạy Ứng Dụng

### Prerequisites

- Python 3.11+
- Node.js 18+
- OpenAI API key

### 1. Backend Setup

```bash
cd backend

# Tạo virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# hoặc venv\Scripts\activate  # Windows

# Cài đặt dependencies
pip install -r requirements.txt

# Cấu hình environment variables
cp .env.example .env
# Chỉnh sửa .env với OpenAI API key của bạn

# Import dữ liệu khóa học vào ChromaDB
python courses_analyzer/data_analyzer.py

# Khởi động server
python main.py
```

### 2. Frontend Setup

```bash
cd react

# Cài đặt dependencies
npm install

# Khởi động development server
npm run dev
```

### 3. Truy Cập Ứng Dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔧 API Endpoints

### Core Endpoints

- `POST /api/upload-profile` - Upload và parse CV
- `POST /api/upload-and-analyze` - Upload CV + Analysis + Pre-quiz
- `POST /api/generate-quiz` - Tạo quiz (pre/post)
- `POST /api/recommend-courses` - Đề xuất khóa học
- `POST /api/normalize-profile` - Phân tích profile text

### Utility Endpoints

- `GET /` - Health check
- `GET /health` - Service status
- `GET /docs` - Interactive API documentation

## 🤖 AI Integration

### OpenAI Models Used

- **GPT-4o-mini**: Profile analysis & Quiz generation
- **Text Embedding**: Course similarity search (optional)
- **Fallback System**: Mock data khi API unavailable

### Prompt Engineering

```python
# Profile Analysis Prompt
"""
Phân tích CV và extract: skills, experience, education, career goals...
Trả về JSON structured data.
"""

# Quiz Generation Prompt
"""
Tạo quiz 5 câu dựa trên profile: đánh giá kỹ năng, kinh nghiệm, mục tiêu...
Mỗi câu 4 lựa chọn, format JSON chuẩn.
"""
```

## 📊 Data Pipeline

1. **Data Collection**: Udemy courses dataset (643+ courses)
2. **Data Processing**: Cleaning, chunking, embedding
3. **Vector Storage**: ChromaDB với 2452+ document chunks
4. **Semantic Search**: Cosine similarity for course matching
5. **Personalization**: Profile-based filtering và ranking

## 🎨 UI/UX Features

### Modern Design System

- **Responsive Layout**: Mobile-first design
- **Smooth Animations**: Framer Motion transitions
- **Professional Color Scheme**: Purple/blue gradient theme
- **Interactive Components**: Drag & drop, progress bars, hover effects

### User Journey

1. **Welcome** → Giới thiệu và hướng dẫn
2. **CV Upload** → Kéo thả file hoặc nhập thủ công
3. **Pre-Quiz** → Đánh giá trình độ hiện tại
4. **Recommendations** → Khóa học được đề xuất
5. **Post-Quiz** → Kiểm tra kiến thức sau khi học
6. **Completion** → Tổng kết và tiến bộ

## 🔮 Roadmap & Tính Năng Tương Lai

- [ ] **Multi-language Support**: English/Vietnamese interface
- [ ] **Advanced Analytics**: Learning progress dashboard
- [ ] **Social Features**: Share learning achievements
- [ ] **Course Providers**: Integration với nhiều nền tảng
- [ ] **Mobile App**: React Native version
- [ ] **AI Tutor**: Interactive learning assistant

## 🤝 Đóng Góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng:

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Team

**AI_11_HN** - Cháu Ngoan Bác Hồ 🚀

---

**Learning Assistant** - Personalize Your Learning Journey with AI!
