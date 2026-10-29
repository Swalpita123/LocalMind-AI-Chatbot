from pathlib import Path
from io import BytesIO
from pypdf import PdfReader
from langchain_core.documents import Document
from .rag import rag_service

ALLOWED_EXTENSIONS = {".pdf", ".txt", ".md"}

def parse_upload(filename: str, data: bytes) -> list[Document]:
    ext = Path(filename).suffix.lower()
    safe_name = Path(filename).name
    docs: list[Document] = []
    if ext == ".pdf":
        reader = PdfReader(BytesIO(data))
        for page_num, page in enumerate(reader.pages, start=1):
            text = page.extract_text() or ""
            if text.strip():
                docs.extend(rag_service.split_text(text, {"filename": safe_name, "page": page_num}))
    elif ext in {".txt", ".md"}:
        text = data.decode("utf-8-sig", errors="replace")
        docs.extend(rag_service.split_text(text, {"filename": safe_name}))
    else:
        raise ValueError("Unsupported file type. Upload PDF, TXT, or Markdown.")
    return docs
