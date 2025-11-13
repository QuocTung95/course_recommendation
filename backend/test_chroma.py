# test_chroma.py
import chromadb
import os
from pathlib import Path

BASE_DIR = Path(__file__).parent
def test_chroma_connection():
    try:
        chroma_path = os.getenv('CHROMA_DB_PATH', str(BASE_DIR / 'chroma_db'))
        collection_name = 'udemy_courses'

        print(f"📁 Chroma path: {chroma_path}")
        print(f"📚 Collection: {collection_name}")

        # Kiểm tra thư mục tồn tại
        current_dir = Path(__file__).parent
        full_path = current_dir / chroma_path
        print(f"🔍 Full path: {full_path}")

        if not full_path.exists():
            print(f"❌ ChromaDB directory not found: {full_path}")
            # Liệt kê các thư mục trong backend để debug
            print("📂 Contents of backend directory:")
            for item in current_dir.iterdir():
                print(f"   - {item.name} {'(DIR)' if item.is_dir() else ''}")
            return False

        client = chromadb.PersistentClient(path=chroma_path)
        print("✅ Chroma client connected")

        # Kiểm tra collection tồn tại
        collections = client.list_collections()
        print(f"📋 Available collections: {[col.name for col in collections]}")

        if not any(col.name == collection_name for col in collections):
            print(f"❌ Collection '{collection_name}' not found")
            return False

        collection = client.get_collection(collection_name)
        print(f"✅ Collection '{collection_name}' loaded")

        # Kiểm tra số lượng documents
        count = collection.count()
        print(f"📊 Total documents in collection: {count}")

        if count == 0:
            print("❌ Collection is empty!")
            return False

        # Test query
        test_results = collection.query(
            query_texts=["python backend development"],
            n_results=3
        )

        print(f"🔍 Test query results: {len(test_results['documents'][0])} documents")

        if test_results['documents'][0]:
            print("✅ Sample course found:")
            print(f"   Title: {test_results['metadatas'][0][0].get('title', 'N/A')}")
            print(f"   Text: {test_results['documents'][0][0][:100]}...")
        else:
            print("❌ No results from test query")

        return True

    except Exception as e:
        print(f"❌ ChromaDB error: {e}")
        return False

if __name__ == "__main__":
    test_chroma_connection()
