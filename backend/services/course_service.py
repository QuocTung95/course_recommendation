# services/course_service.py
import chromadb
from chromadb.config import Settings
import os
from typing import List, Dict, Any
from utils.openai_client import openai_client

class ChromaDBCourseService:
    def __init__(self):
        self.chroma_path = './chroma_db'
        self.collection_name = 'udemy_courses'

        print(f"🔍 Initializing ChromaDB...")
        print(f"   Path: {self.chroma_path}")
        print(f"   Collection: {self.collection_name}")

        try:
            self.client = chromadb.PersistentClient(path=self.chroma_path)
            print("✅ ChromaDB client created")

            collections = self.client.list_collections()
            collection_names = [col.name for col in collections]
            print(f"📚 Available collections: {collection_names}")

            if self.collection_name not in collection_names:
                print(f"❌ Collection '{self.collection_name}' not found!")
                return None
            else:
                self.collection = self.client.get_collection(self.collection_name)
                print(f"✅ Collection '{self.collection_name}' loaded successfully")

            count = self.collection.count()
            print(f"📊 Total documents in collection: {count}")

        except Exception as e:
            print(f"❌ Failed to initialize ChromaDB: {e}")
            self.collection = None

    def search_courses(self, query: str, profile_analysis: dict, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Search courses từ ChromaDB và enhance với AI-generated content
        """
        if not self.collection:
            print("❌ ChromaDB collection not available")
            return []

        try:
            enhanced_query = self._enhance_query(query, profile_analysis)
            print(f"🔍 Searching with query: {enhanced_query}")

            results = self.collection.query(
                query_texts=[enhanced_query],
                n_results=top_k * 2,
                include=['documents', 'metadatas', 'distances']
            )

            print(f"📈 Raw results: {len(results['documents'][0])} documents")

            courses = self._process_chroma_results(results, profile_analysis)

            # Enhance courses với AI-generated outcomes, requirements, audience
            enhanced_courses = self._enhance_courses_with_ai(courses, profile_analysis)

            print(f"✅ Enhanced courses: {len(enhanced_courses)}")
            return enhanced_courses[:top_k]

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
                course = {
                    "course_title": metadata.get('title', f'Course {i+1}'),
                    "text": doc,
                    "similarity": float(1 - distance) if distance else 0.5,
                    "source": "chromadb",
                    "instructor": metadata.get('instructor', 'Unknown'),
                    "level": metadata.get('level', 'All Levels'),
                    "rating": float(metadata.get('rating', 4.0)),
                    "duration": metadata.get('duration', 'Not specified'),
                    "url": metadata.get('link', '#'),
                    "price": metadata.get('price', 'Free'),
                    "students": metadata.get('students', '1000+'),
                    "original_data": metadata  # Giữ nguyên data gốc để AI enhance
                }

                if self._is_course_suitable(course, profile_analysis):
                    courses.append(course)
                    print(f"   ✅ Added: {course['course_title']} (similarity: {course['similarity']:.2f})")

            except Exception as e:
                print(f"   ❌ Error processing course {i}: {e}")
                continue

        courses.sort(key=lambda x: x['similarity'], reverse=True)
        return courses

    def _enhance_courses_with_ai(self, courses: List[Dict[str, Any]], profile_analysis: dict) -> List[Dict[str, Any]]:
        """Enhance courses với AI-generated outcomes, requirements, và audience"""
        enhanced_courses = []

        for course in courses:
            try:
                print(f"🤖 Enhancing course with AI: {course['course_title'][:50]}...")

                # Gọi AI để generate structured content
                enhanced_content = self._generate_course_content_with_ai(course, profile_analysis)

                # Merge AI-generated content với course data
                enhanced_course = {**course, **enhanced_content}
                enhanced_courses.append(enhanced_course)

            except Exception as e:
                print(f"❌ Error enhancing course with AI: {e}")
                # Fallback: dùng course data gốc
                enhanced_courses.append(self._get_fallback_course_content(course))
                continue

        return enhanced_courses

    def _generate_course_content_with_ai(self, course: Dict[str, Any], profile_analysis: dict) -> Dict[str, Any]:
        """Generate outcomes, requirements, audience với AI"""

        prompt = f"""
        Dựa trên thông tin khóa học và profile người học, hãy tạo nội dung structured:

        THÔNG TIN KHÓA HỌC:
        - Tiêu đề: {course['course_title']}
        - Mô tả: {course['text'][:500]}
        - Trình độ: {course['level']}
        - Giảng viên: {course['instructor']}

        PROFILE NGƯỜI HỌC:
        - Kỹ năng hiện tại: {profile_analysis.get('extracted_skills', [])}
        - Trình độ: {profile_analysis.get('experience_level', 'Không xác định')}
        - Mục tiêu: {profile_analysis.get('career_interests', [])}

        Hãy trả về JSON với format:
        {{
            "outcomes": [
                "Kỹ năng/kến thức cụ thể học được 1",
                "Kỹ năng/kến thức cụ thể học được 2",
                "Kỹ năng/kến thức cụ thể học được 3"
            ],
            "requirements": [
                "Yêu cầu kiến thức/kỹ năng 1",
                "Yêu cầu kiến thức/kỹ năng 2",
                "Yêu cầu kiến thức/kỹ năng 3"
            ],
            "audience": [
                "Đối tượng phù hợp 1",
                "Đối tượng phù hợp 2",
                "Đối tượng phù hợp 3"
            ]
        }}

        Lưu ý:
        - Outcomes: Tập trung vào kỹ năng thực tế, ứng dụng được
        - Requirements: Phù hợp với trình độ người học
        - Audience: Liên quan đến mục tiêu nghề nghiệp
        - Dùng tiếng Việt, ngắn gọn, cụ thể

        Chỉ trả về JSON, không thêm text nào khác.
        """

        try:
            response = openai_client.chat_completion([
                {"role": "user", "content": prompt}
            ])

            if response and response.choices:
                content = response.choices[0].message.content.strip()

                # Parse JSON từ response
                import json
                if content.startswith("```json"):
                    content = content[7:-3].strip()
                elif content.startswith("```"):
                    content = content[3:-3].strip()

                enhanced_data = json.loads(content)
                print(f"✅ AI-enhanced course: {len(enhanced_data.get('outcomes', []))} outcomes")
                return enhanced_data
            else:
                return self._get_fallback_course_content(course)

        except Exception as e:
            print(f"❌ AI enhancement failed: {e}")
            return self._get_fallback_course_content(course)

    def _get_fallback_course_content(self, course: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback content khi AI fails"""
        title_lower = course['course_title'].lower()

        # Dynamic fallback dựa trên course title
        if 'python' in title_lower:
            return {
                "outcomes": [
                    "Lập trình Python từ cơ bản đến nâng cao",
                    "Xây dựng ứng dụng thực tế với Python",
                    "Debug và optimize code Python hiệu quả"
                ],
                "requirements": [
                    "Hiểu biết cơ bản về lập trình",
                    "Môi trường phát triển Python cài đặt sẵn",
                    "Tinh thần học hỏi và thực hành"
                ],
                "audience": [
                    "Developer muốn học Python từ đầu",
                    "Backend developer muốn chuyên sâu Python",
                    "Người mới bắt đầu trong lập trình"
                ]
            }
        elif 'javascript' in title_lower or 'react' in title_lower:
            return {
                "outcomes": [
                    "Thành thạo JavaScript ES6+",
                    "Xây dựng ứng dụng React hiện đại",
                    "Quản lý state và side effects hiệu quả"
                ],
                "requirements": [
                    "Kiến thức HTML/CSS cơ bản",
                    "Hiểu biết về lập trình web",
                    "Máy tính có kết nối internet"
                ],
                "audience": [
                    "Frontend developer muốn nâng cao kỹ năng",
                    "Fullstack developer học JavaScript",
                    "Người muốn xây dựng web app hiện đại"
                ]
            }
        elif 'aws' in title_lower or 'cloud' in title_lower:
            return {
                "outcomes": [
                    "Thành thạo các dịch vụ AWS core",
                    "Triển khai ứng dụng trên cloud",
                    "Quản lý infrastructure với AWS"
                ],
                "requirements": [
                    "Kiến thức hệ thống cơ bản",
                    "Hiểu biết về networking",
                    "Tài khoản AWS (có thể dùng free tier)"
                ],
                "audience": [
                    "DevOps engineer muốn học AWS",
                    "Developer muốn deploy ứng dụng cloud",
                    "System administrator chuyển sang cloud"
                ]
            }
        else:
            # Generic fallback
            return {
                "outcomes": [
                    "Nắm vững kiến thức chuyên môn",
                    "Áp dụng vào dự án thực tế",
                    "Phát triển kỹ năng giải quyết vấn đề"
                ],
                "requirements": [
                    "Kiến thức nền tảng liên quan",
                    "Môi trường học tập phù hợp",
                    "Thời gian thực hành đều đặn"
                ],
                "audience": [
                    "Người muốn phát triển kỹ năng chuyên môn",
                    "Developer muốn nâng cao trình độ",
                    "Người chuyển đổi nghề nghiệp"
                ]
            }

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
    """Recommend courses từ ChromaDB với AI enhancement"""
    print(f"🎓 Đang tìm khóa học cho: {career_goal}")

    if not profile_analysis:
        print("⚠️ No profile analysis provided")
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
    """Fallback courses với enhanced content"""
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
            "students": "10,000+",
            "outcomes": [
                f"Thành thạo kỹ năng {career_goal} cốt lõi",
                "Xây dựng ứng dụng thực tế từ A-Z",
                "Chuẩn bị cho vị trí công việc thực tế"
            ],
            "requirements": [
                "Kiến thức lập trình cơ bản",
                "Môi trường phát triển phù hợp",
                "Tinh thần học hỏi và kiên nhẫn"
            ],
            "audience": [
                f"Người muốn trở thành {career_goal}",
                "Developer muốn chuyển đổi nghề nghiệp",
                "Sinh viên IT muốn có kỹ năng thực tế"
            ]
        }
    ]

    return fallback_courses
