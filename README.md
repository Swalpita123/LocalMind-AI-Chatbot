# Local Voice RAG Assistant (No OpenAI)

React + FastAPI chatbot with LangChain, LangGraph, ChromaDB, Sentence Transformers, Ollama, faster-whisper, and pyttsx3. All inference is local.

## Requirements
- Windows 10/11
- Python 3.12 recommended
- Node.js 20+
- Ollama for Windows: https://ollama.com/download
- 8 GB RAM minimum recommended; 16 GB is more comfortable.

## 1. Pull the local language model
Install Ollama, then:
```powershell
ollama pull qwen2.5:3b
```
Ollama serves locally at `http://127.0.0.1:11434`.

## 2. Start backend (PowerShell)
```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
If activation is blocked: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`

First run downloads embedding and Whisper model files. Check `http://127.0.0.1:8000/health` and `http://127.0.0.1:8000/docs`.

## 3. Start frontend in another PowerShell window
```powershell
cd frontend
npm install
npm run dev
```
Open `http://127.0.0.1:5173`.

## Use
Upload PDF/TXT/MD, then use text chat or click the microphone for **continuous hands-free voice chat**. In continuous mode, speak naturally and pause for about 1.3 seconds when you finish a sentence. The app detects the pause, transcribes locally with faster-whisper, sends the question to the local RAG model, speaks the answer, and resumes listening automatically. Click the microphone again to end voice mode. Turn off **Speak answers** if you want continuous voice input but text-only replies. Sources show filename/page and excerpts.

### Continuous voice behavior
- Uses browser microphone capture and local audio-level/silence detection; it does not use the browser's cloud speech-recognition API.
- During spoken answers, automatic listening pauses to reduce the assistant hearing its own voice. It resumes after playback finishes.
- This is a hands-free, turn-by-turn loop, not full-duplex real-time streaming. Interrupting the assistant mid-sentence is not supported in this version, and CPU inference can add noticeable delay.

## Configuration
Edit `backend/.env`. `OLLAMA_MODEL=qwen2.5:3b`; `WHISPER_MODEL=tiny` is CPU-oriented. Set Whisper to `base` for potentially better transcription at a speed/memory cost.

## Tests
From `backend/` with venv activated: `pytest -q`

## Notes
- No OpenAI SDK/API is used. Ollama, embeddings, speech recognition, and TTS run locally.
- Setup downloads packages/models. After setup, offline use is possible if all model files are cached.
- PDF text extraction does not OCR scanned/image-only PDFs.
- This is a local starter, not hardened for public deployment. It uses a shared local vector collection; add authentication and per-user isolation before multi-user use.
