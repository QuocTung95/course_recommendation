#!/usr/bin/env python3
"""
Script setup để cài đặt dependencies và kiểm tra cấu hình cho Udemy Course Recommendation System
"""

import subprocess
import sys
import os
from pathlib import Path

def install_requirements():
    """Cài đặt các dependencies từ requirements.txt"""
    print("🔧 Đang cài đặt dependencies...")

    requirements_files = [
        "requirements.txt",
        "../requirements.txt"
    ]

    requirements_found = False

    for req_file in requirements_files:
        if Path(req_file).exists():
            print(f"📦 Found requirements file: {req_file}")
            try:
                subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", req_file])
                print("✅ Đã cài đặt thành công tất cả dependencies!")
                requirements_found = True
                break
            except subprocess.CalledProcessError as e:
                print(f"❌ Lỗi khi cài đặt dependencies từ {req_file}: {e}")
                return False

    if not requirements_found:
        print("❌ Không tìm thấy file requirements.txt")
        return False

    return True

def check_env_file():
    """Kiểm tra file .env"""
    env_files = [
        Path(__file__).resolve().parent.parent / ".env",
        Path(__file__).resolve().parent / ".env",
        Path(__file__).resolve().parent.parent.parent / ".env"
    ]

    env_file = None
    for env_path in env_files:
        if env_path.exists():
            env_file = env_path
            break

    if not env_file:
        print("⚠️ File .env không tồn tại ở các vị trí thông thường")
        print("📝 Tạo file .env trong thư mục backend với nội dung:")
        print("""
OPENAI_API_KEY_GPT4O=your_openai_api_key_here
OPENAI_API_KEY_EMBED=your_openai_api_key_here
OPENAI_BASE_URL=your_openai_base_url_optional
CHROMA_DB_PATH=./chroma_db
COLLECTION_NAME=udemy_courses

# Hoặc nếu dùng Azure OpenAI:
AZURE_OPENAI_EMBEDDING_ENDPOINT=your_azure_endpoint
AZURE_OPENAI_EMBEDDING_API_KEY=your_azure_api_key
AZURE_OPENAI_EMBED_MODEL=your_embedding_model
        """)
        return False

    # Đọc và kiểm tra API key
    with open(env_file, 'r') as f:
        content = f.read()

    print(f"✅ File .env found: {env_file}")

    # Kiểm tra các API key cần thiết
    required_keys = []
    if "OPENAI_API_KEY_GPT4O" in content:
        required_keys.append("OPENAI_API_KEY_GPT4O")
    if "AZURE_OPENAI_EMBEDDING_API_KEY" in content:
        required_keys.append("AZURE_OPENAI_EMBEDDING_API_KEY")

    for key in required_keys:
        if f"{key}=your_" in content or f"{key}=" not in content:
            print(f"⚠️ Bạn cần cập nhật {key} trong file .env")
            return False

    print("✅ File .env đã được cấu hình đúng")
    return True

def check_data_file():
    """Kiểm tra file dữ liệu UDEMY_2025.csv"""
    data_paths = [
        Path(__file__).resolve().parent.parent / "data" / "UDEMY_2025.csv",
        Path(__file__).resolve().parent / "data" / "UDEMY_2025.csv",
        Path(__file__).resolve().parent.parent.parent / "data" / "UDEMY_2025.csv"
    ]

    data_file = None
    for data_path in data_paths:
        if data_path.exists():
            data_file = data_path
            break

    if not data_file:
        print("⚠️ File UDEMY_2025.csv không tồn tại")
        print("📁 Đảm bảo file dữ liệu CSV có trong thư mục /data")
        return False

    # Kiểm tra kích thước file
    file_size = data_file.stat().st_size
    print(f"✅ File dữ liệu CSV found: {data_file}")
    print(f"📊 File size: {file_size / (1024*1024):.2f} MB")

    if file_size == 0:
        print("❌ File CSV trống!")
        return False

    return True

def check_chroma_db():
    """Kiểm tra ChromaDB"""
    chroma_paths = [
        Path(__file__).resolve().parent.parent / "chroma_db",
        Path(__file__).resolve().parent / "chroma_db"
    ]

    chroma_exists = False
    for chroma_path in chroma_paths:
        if chroma_path.exists():
            print(f"📁 ChromaDB directory found: {chroma_path}")
            chroma_exists = True

            # Kiểm tra file chroma.sqlite3
            db_file = chroma_path / "chroma.sqlite3"
            if db_file.exists():
                db_size = db_file.stat().st_size
                print(f"📊 ChromaDB size: {db_size / (1024*1024):.2f} MB")
            else:
                print("ℹ️ ChromaDB chưa có dữ liệu (chroma.sqlite3 not found)")

            break

    if not chroma_exists:
        print("ℹ️ ChromaDB directory chưa tồn tại - sẽ được tạo khi chạy data_analyzer.py")

    return True

def test_imports():
    """Test import các thư viện cần thiết"""
    print("🧪 Đang kiểm tra imports...")

    import_tests = [
        ('pandas', 'pandas'),
        ('chromadb', 'chromadb'),
        ('openai', 'openai'),
        ('python-dotenv', 'dotenv'),
        ('fastapi', 'fastapi'),
        ('uvicorn', 'uvicorn'),
        ('pydantic', 'pydantic')
    ]

    failed_imports = []

    for package_name, import_statement in import_tests:
        try:
            if import_statement == 'dotenv':
                from dotenv import load_dotenv
            else:
                __import__(import_statement)
            print(f"  ✅ {package_name}")
        except ImportError as e:
            print(f"  ❌ {package_name} - {e}")
            failed_imports.append(package_name)

    if failed_imports:
        print(f"\n❌ Một số module không import được: {failed_imports}")
        return False

    print("✅ Tất cả modules đã sẵn sàng!")
    return True

def check_directory_structure():
    """Kiểm tra cấu trúc thư mục"""
    print("📁 Kiểm tra cấu trúc thư mục...")

    backend_dir = Path(__file__).resolve().parent.parent
    expected_dirs = [
        backend_dir / "data",
        backend_dir / "services",
        backend_dir / "utils",
        backend_dir / "courses_analyzer"
    ]

    all_exists = True
    for dir_path in expected_dirs:
        exists = dir_path.exists()
        status = "✅" if exists else "❌"
        print(f"  {status} {dir_path.name}: {'Exists' if exists else 'Missing'}")
        if not exists:
            all_exists = False

    return all_exists

def main():
    """Hàm main"""
    print("🚀 Udemy Course Recommendation System - Setup Script")
    print("=" * 60)

    # Kiểm tra Python version
    python_version = sys.version_info
    if python_version.major < 3 or (python_version.major == 3 and python_version.minor < 8):
        print("❌ Cần Python 3.8 trở lên")
        return

    print(f"✅ Python version: {python_version.major}.{python_version.minor}.{python_version.micro}")

    # Kiểm tra cấu trúc thư mục
    if not check_directory_structure():
        print("\n⚠️ Một số thư mục quan trọng bị thiếu")

    # Cài đặt dependencies
    if not install_requirements():
        print("\n❌ Không thể cài đặt dependencies")
        return

    # Test imports
    if not test_imports():
        print("\n🔄 Thử cài đặt lại dependencies:")
        print("pip install -r requirements.txt")
        return

    # Kiểm tra các file cần thiết
    env_ok = check_env_file()
    data_ok = check_data_file()
    chroma_ok = check_chroma_db()

    print("\n" + "=" * 60)
    print("📋 TỔNG KẾT SETUP:")

    all_checks = [env_ok, data_ok]

    if all(all_checks):
        print("✅ Setup hoàn tất! Bạn có thể chạy:")
        print("\n   1. Tạo ChromaDB:")
        print("      python courses_analyzer/data_analyzer.py")
        print("\n   2. Khởi động backend server:")
        print("      python main.py")
        print("\n   3. Test hệ thống:")
        print("      python test_chroma.py")
        print("      python test_recommend.py")
    else:
        print("⚠️ Cần hoàn thành các bước sau:")
        if not env_ok:
            print("   - Cập nhật API keys trong file .env")
        if not data_ok:
            print("   - Đảm bảo file UDEMY_2025.csv có trong thư mục /data")

        print("\nSau khi hoàn thành, chạy lại script này để kiểm tra.")

    print("\n🎯 NEXT STEPS:")
    print("   1. Chạy data_analyzer.py để import dữ liệu vào ChromaDB")
    print("   2. Chạy main.py để khởi động backend server")
    print("   3. Khởi động frontend (trong thư mục react/)")

if __name__ == "__main__":
    main()
