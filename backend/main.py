from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from utils.openai_client import test_openai_connection
from services.quiz_service import generate_quiz, generate_post_quiz
from services.course_service import recommend_courses

from fastapi import File, UploadFile, Form
from services.profile_service import normalize_profile, save_normalized_profile, PROFILE_PATH
from utils.file_parser import extract_text_from_file

print("🚀 Đang khởi động RAG Learning Assistant API...")

# Kiểm tra kết nối OpenAI trước khi khởi động
if not test_openai_connection():
    print("❌ Không thể khởi động do lỗi kết nối OpenAI")
    exit(1)

app = FastAPI(title="RAG Learning Assistant API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ProfileRequest(BaseModel):
    profile_text: str
    career_goal: str = "Backend Developer"

class QuizRequest(BaseModel):
    profile_text: str
    career_goal: str
    quiz_type: str = "pre-quiz"

# API routes
@app.get("/")
async def root():
    return {"message": "RAG Learning Assistant API", "status": "running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "RAG Learning Assistant"}

# # Endpoint: upload file (pdf/docx/txt), trả về JSON normalized và content để frontend review
# @app.post("/api/upload-profile")
# async def upload_profile_file(file: UploadFile = File(...)):
#     try:
#         filename = file.filename
#         content = await file.read()
#         text, detected = extract_text_from_file(filename, content)
#         # call OpenAI normalize
#         normalized = normalize_profile_and_save(text)
#         return {"ok": True, "detected_type": detected, "raw_text": text, "normalized_profile": normalized}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Upload/parse error: {e}")

# Endpoint: accept raw text (user pasted/edited) and normalize & save
# class TextProfileRequest(BaseModel):
#     profile_text: str

# @app.post("/api/profile-from-text")
# async def profile_from_text(req: TextProfileRequest):
#     try:
#         normalized = normalize_profile_and_save(req.profile_text)
#         return {"ok": True, "normalized_profile": normalized}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Normalization error: {e}")

# Endpoint: upload file (pdf/docx/txt), trả về JSON normalized và content để frontend review
@app.post("/api/upload-profile")
async def upload_profile_file(file: UploadFile = File(...)):
    try:
        filename = file.filename
        content = await file.read()
        text, detected = extract_text_from_file(filename, content)
        # call OpenAI normalize
        normalized = normalize_profile(text)
        return {"ok": True, "detected_type": detected, "raw_text": text, "normalized_profile": normalized}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload/parse error: {e}")


class ProfileTextIn(BaseModel):
    profile_text: str

@app.post("/api/normalize-profile")
def api_normalize_profile(payload: ProfileTextIn):
    try:
        normalized = normalize_profile(payload.profile_text)
        return {"ok": True, "normalized_profile": normalized}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Normalization error: {e}")

# Save normalized JSON
class NormalizedProfileIn(BaseModel):
    normalized_profile: dict

@app.post("/api/save-profile")
def api_save_profile(payload: NormalizedProfileIn):
    try:
        final = save_normalized_profile(payload.normalized_profile)
        return {"ok": True, "normalized_profile": final, "saved_path": str(PROFILE_PATH)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Save error: {e}")

@app.post("/api/generate-quiz")
async def api_generate_quiz(request: QuizRequest):
    print(f"📝 API: Generate quiz - {request.quiz_type}")
    try:
        result = await generate_quiz(request.profile_text, request.career_goal, request.quiz_type)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi tạo quiz: {str(e)}")

@app.post("/api/recommend-courses")
async def api_recommend_courses(request: ProfileRequest):
    print(f"🎓 API: Recommend courses - {request.career_goal}")
    try:
        result = await recommend_courses(request.profile_text, request.career_goal)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi gợi ý khóa học: {str(e)}")

@app.post("/api/generate-post-quiz")
async def api_generate_post_quiz(request: QuizRequest):
    print(f"📝 API: Generate post-quiz")
    try:
        result = await generate_post_quiz(request.career_goal)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi tạo post-quiz: {str(e)}")

if __name__ == "__main__":
    print("✅ Khởi động thành công! Truy cập: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
