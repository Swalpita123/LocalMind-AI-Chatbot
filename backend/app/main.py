import logging
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from .config import settings
from .documents import parse_upload, ALLOWED_EXTENSIONS
from .rag import rag_service
from .schemas import ChatRequest, ChatResponse, IngestResponse
from .voice import transcribe_audio, synthesize_speech

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
app = FastAPI(title="Local Voice RAG Assistant", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "llm": settings.ollama_model, "embedding_model": settings.embedding_model, "inference": "local"}

@app.post("/api/documents", response_model=IngestResponse)
async def upload_document(file: UploadFile = File(...)):
    filename = Path(file.filename or "upload.txt").name
    if Path(filename).suffix.lower() not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only PDF, TXT, and MD files are supported.")
    data = await file.read()
    if len(data) > settings.max_upload_mb * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f"File exceeds {settings.max_upload_mb} MB limit.")
    try:
        docs = parse_upload(filename, data)
        if not docs:
            raise HTTPException(status_code=422, detail="No readable text found in this file.")
        count = rag_service.add_documents(docs)
        return IngestResponse(filename=filename, chunks_added=count, message=f"Indexed {count} text chunks locally.")
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Document ingestion failed")
        raise HTTPException(status_code=500, detail=f"Could not process document: {exc}") from exc

@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    try:
        return ChatResponse(**rag_service.chat(request.question.strip(), request.history))
    except Exception as exc:
        logger.exception("Chat failed")
        detail = str(exc)
        if "Connection refused" in detail or "Failed to connect" in detail:
            detail = "Cannot connect to Ollama. Start Ollama and pull the configured model."
        raise HTTPException(status_code=503, detail=detail) from exc

@app.post("/api/voice/transcribe")
async def voice_transcribe(file: UploadFile = File(...)):
    suffix = Path(file.filename or "recording.webm").suffix.lower()
    data = await file.read()
    if len(data) > 25 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Audio exceeds 25 MB.")
    try:
        return {"text": transcribe_audio(data, suffix)}
    except Exception as exc:
        logger.exception("Transcription failed")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {exc}") from exc

@app.post("/api/voice/speak")
def voice_speak(payload: dict):
    text = str(payload.get("text", "")).strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text is required.")
    try:
        return Response(content=synthesize_speech(text), media_type="audio/wav")
    except Exception as exc:
        logger.exception("TTS failed")
        raise HTTPException(status_code=500, detail=f"Text-to-speech failed: {exc}") from exc
