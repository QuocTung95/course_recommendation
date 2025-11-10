def chunk_text(text, chunk_size=50, overlap=10):
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start += chunk_size - overlap
    return chunks

if __name__ == "__main__":
    text = "Python là ngôn ngữ lập trình dễ học. Nó hỗ trợ nhiều kiểu dữ liệu cơ bản, câu lệnh điều kiện, vòng lặp, hàm, và module."
    chunks = chunk_text(text)
    for i, c in enumerate(chunks):
        print(f"Chunk {i+1}: {c}")
