# backend/utils/file_parser.py
import io
from typing import Tuple
import os
from docx import Document

# pdfplumber
import pdfplumber

def extract_text_from_docx(file_bytes: bytes) -> str:
    doc = Document(io.BytesIO(file_bytes))
    paragraphs = [p.text for p in doc.paragraphs if p.text]
    return "\n".join(paragraphs).strip()

def extract_text_from_pdf_with_pdfplumber(file_bytes: bytes) -> str:
    """
    Extract text from PDF using pdfplumber. This tries to extract
    page by page and returns concatenated text. Handles many layouts better.
    """
    text_pages = []
    # pdfplumber expects a file-like object
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            try:
                # .extract_text() returns text; for complex layouts you can try .extract_text(x_tolerance=... )
                page_text = page.extract_text()
                if page_text:
                    text_pages.append(page_text)
                else:
                    # if page has no text but has tables, extract tables as CSV-like text
                    tables = page.extract_tables()
                    if tables:
                        for table in tables:
                            # flatten table rows
                            for row in table:
                                # join non-empty cells
                                row_text = " | ".join([cell if cell is not None else "" for cell in row])
                                text_pages.append(row_text)
            except Exception:
                # if extraction fails for a page, skip it but continue
                continue
    return "\n\n".join(text_pages).strip()

def extract_text_from_txt(file_bytes: bytes, encoding="utf-8") -> str:
    try:
        return file_bytes.decode(encoding)
    except Exception:
        return file_bytes.decode(errors="ignore")

def extract_text_from_file(filename: str, file_bytes: bytes) -> Tuple[str, str]:
    """
    Return tuple (text, detected_type) where detected_type is 'pdf'|'docx'|'txt'|'unknown'
    Uses pdfplumber for PDFs.
    """
    lower = filename.lower()
    if lower.endswith(".pdf"):
        try:
            text = extract_text_from_pdf_with_pdfplumber(file_bytes)
            return text, "pdf"
        except Exception:
            # fallback: try decode as txt
            return extract_text_from_txt(file_bytes), "pdf"
    if lower.endswith(".docx"):
        try:
            return extract_text_from_docx(file_bytes), "docx"
        except Exception:
            return extract_text_from_txt(file_bytes), "docx"
    if lower.endswith(".txt"):
        return extract_text_from_txt(file_bytes), "txt"

    # fallback heuristics: try pdfplumber first
    try:
        text = extract_text_from_pdf_with_pdfplumber(file_bytes)
        if len(text) > 20:
            return text, "pdf"
    except Exception:
        pass

    try:
        text = extract_text_from_docx(file_bytes)
        if len(text) > 20:
            return text, "docx"
    except Exception:
        pass

    return extract_text_from_txt(file_bytes), "txt"
