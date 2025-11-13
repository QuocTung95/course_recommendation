# services/course_service.py
import chromadb
from chromadb.config import Settings
import os
from typing import List, Dict, Any
from utils.openai_client import openai_client  # Sử dụng client thống nhất
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
class ChromaDBCourseService:
    def __init__(self):
        self.chroma_path = os.getenv('CHROMA_DB_PATH', str(BASE_DIR / 'chroma_db'))
        self.collection_name = 'udemy_courses'

        print(f"🔍 Initializing ChromaDB...")
        print(f"   Path: {self.chroma_path}")
        print(f"   Collection: {self.collection_name}")

        try:
            self.client = chromadb.PersistentClient(path=self.chroma_path)
            print("✅ ChromaDB client created")

            # Kiểm tra collection tồn tại
            collections = self.client.list_collections()
            collection_names = [col.name for col in collections]
            print(f"📚 Available collections: {collection_names}")

            if self.collection_name not in collection_names:
                print(f"❌ Collection '{self.collection_name}' not found!")
                return None
            else:
                self.collection = self.client.get_collection(self.collection_name)
                print(f"✅ Collection '{self.collection_name}' loaded successfully")

            # Kiểm tra số lượng documents
            count = self.collection.count()
            print(f"📊 Total documents in collection: {count}")

        except Exception as e:
            print(f"❌ Failed to initialize ChromaDB: {e}")
            self.collection = None

    def search_courses(self, query: str, profile_analysis: dict, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Search courses từ ChromaDB - Sử dụng text search thay vì embedding
        """
        if not self.collection:
            print("❌ ChromaDB collection not available")
            return []

        try:
            # Enhanced query với thông tin từ profile
            enhanced_query = self._enhance_query(query, profile_analysis)
            print(f"🔍 Searching with query: {enhanced_query}")

            # Sử dụng text-based search thay vì embedding để tránh dimension mismatch
            results = self.collection.query(
                query_texts=[enhanced_query],  # ChromaDB sẽ tự tạo embedding phù hợp
                n_results=top_k * 2,
                include=['documents', 'metadatas', 'distances']
            )

            print(f"📈 Raw results: {len(results['documents'][0])} documents")

            # Process và filter results
            courses = self._process_chroma_results(results, profile_analysis)

            print(f"✅ Filtered courses: {len(courses)}")
            return courses[:top_k]

        except Exception as e:
            print(f"❌ Error searching ChromaDB: {e}")
            return []

    def _enhance_query(self, query: str, profile_analysis: dict) -> str:
        """Enhanced query với thông tin từ profile"""
        skills = profile_analysis.get('extracted_skills', [])
        experience = profile_analysis.get('experience_level', '')
        career_goals = profile_analysis.get('career_interests', [])
        learning_goals = profile_analysis.get('learning_goals', [])

        enhanced_parts = [query]

        if skills:
            enhanced_parts.append(f"skills: {', '.join(skills[:3])}")
        if experience:
            enhanced_parts.append(f"{experience} level")
        if career_goals:
            enhanced_parts.append(f"career: {', '.join(career_goals[:2])}")
        if learning_goals:
            enhanced_parts.append(f"learn: {', '.join(learning_goals[:2])}")

        enhanced_query = " ".join(enhanced_parts)
        print(f"🎯 Enhanced query: {enhanced_query}")
        return enhanced_query

    def _process_chroma_results(self, results: Any, profile_analysis: dict) -> List[Dict[str, Any]]:
        """Process kết quả từ ChromaDB"""
        courses = []

        if not results or not results['documents'] or not results['documents'][0]:
            print("❌ No documents in results")
            return courses

        for i, (doc, metadata, distance) in enumerate(zip(
            results['documents'][0],
            results['metadatas'][0],
            results['distances'][0]
        )):
            try:
                # Convert ChromaDB result thành course format
                course = {
                    "course_title": metadata.get('title', f'Course {i+1}'),
                    "text": doc,
                    "similarity": float(1 - distance) if distance else 0.5,
                    "source": "chromadb",
                    "instructor": metadata.get('instructor', 'Unknown'),
                    "level": metadata.get('level', 'All Levels'),
                    "rating": float(metadata.get('rating', 4.0)),
                    "duration": metadata.get('duration', 'Not specified'),
                    "chunk_type": metadata.get('chunk_type', 'course'),
                    "url": metadata.get('link', '#'),
                    "price": metadata.get('price', 'Free'),
                    "students": metadata.get('students', '1000+')
                }

                # Filter by experience level
                if self._is_course_suitable(course, profile_analysis):
                    courses.append(course)
                    print(f"   ✅ Added: {course['course_title']} (similarity: {course['similarity']:.2f})")
                else:
                    print(f"   ⏭️  Skipped (not suitable): {course['course_title']}")

            except Exception as e:
                print(f"   ❌ Error processing course {i}: {e}")
                continue

        # Sort by similarity
        courses.sort(key=lambda x: x['similarity'], reverse=True)
        return courses

    def _is_course_suitable(self, course: dict, profile_analysis: dict) -> bool:
        """Check if course phù hợp với profile"""
        user_level = profile_analysis.get('experience_level', '').lower()
        course_level = course.get('level', '').lower()

        level_mapping = {
            'beginner': ['beginner', 'all levels', ''],
            'intermediate': ['beginner', 'intermediate', 'all levels', ''],
            'advanced': ['beginner', 'intermediate', 'advanced', 'all levels', '']
        }

        suitable_levels = level_mapping.get(user_level, ['all levels', ''])
        return any(level in course_level for level in suitable_levels)

# Global instance
chroma_service = ChromaDBCourseService()

async def recommend_courses(profile_text: str, career_goal: str, profile_analysis: dict = None):
    """Recommend courses từ ChromaDB"""
    print(f"🎓 Đang tìm khóa học cho: {career_goal}")

    if not profile_analysis:
        print("⚠️ No profile analysis provided")
        # Tạo profile analysis đơn giản nếu không có
        profile_analysis = {
            'extracted_skills': [],
            'experience_level': 'intermediate',
            'career_interests': [career_goal],
            'learning_goals': [f'Learn {career_goal} skills']
        }

    try:
        query = f"{career_goal} programming development tutorial course"
        courses = chroma_service.search_courses(query, profile_analysis, top_k=5)

        if not courses:
            print("⚠️ No courses found from ChromaDB, using fallback")
            courses = get_fallback_courses(career_goal)

        return {"courses": courses}

    except Exception as e:
        print(f"❌ Lỗi recommend courses: {e}")
        return {"courses": get_fallback_courses(career_goal)}

def get_fallback_courses(career_goal: str):
    """Fallback courses khi ChromaDB empty"""
    print("🔄 Using fallback courses")

    fallback_courses = [
        {
            "course_title": f"Complete {career_goal} Masterclass 2024",
            "text": f"Learn everything you need to become a professional {career_goal}. This comprehensive course covers all fundamental concepts and advanced techniques.",
            "similarity": 0.9,
            "source": "fallback",
            "instructor": "Expert Instructor",
            "level": "All Levels",
            "rating": 4.5,
            "duration": "15 hours",
            "url": "#",
            "price": "Free",
            "students": "10,000+"
        },
        {
            "course_title": f"Advanced {career_goal} Programming",
            "text": f"Deep dive into advanced {career_goal} concepts, design patterns, and best practices for building scalable applications.",
            "similarity": 0.8,
            "source": "fallback",
            "instructor": "Senior Developer",
            "level": "Intermediate",
            "rating": 4.3,
            "duration": "12 hours",
            "url": "#",
            "price": "Free",
            "students": "5,000+"
        }
    ]

    return fallback_courses
