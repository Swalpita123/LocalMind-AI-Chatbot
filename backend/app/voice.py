import os
import tempfile
from pathlib import Path
from threading import Lock

_model = None
_lock = Lock()

def transcribe_audio(audio_bytes: bytes, suffix: str = ".webm") -> str:
    global _model
    if not audio_bytes:
        raise ValueError("Audio recording is empty.")
    from faster_whisper import WhisperModel
    with _lock:
        if _model is None:
            _model = WhisperModel(os.getenv("WHISPER_MODEL", "tiny"), device="cpu", compute_type="int8")
    suffix = suffix if suffix in {".webm", ".wav", ".mp3", ".m4a", ".ogg"} else ".webm"
    path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as f:
            f.write(audio_bytes)
            path = f.name
        segments, _ = _model.transcribe(path, vad_filter=True)
        text = " ".join(s.text.strip() for s in segments).strip()
        if not text:
            raise ValueError("No speech detected. Please try again.")
        return text
    finally:
        if path and os.path.exists(path):
            os.remove(path)

def synthesize_speech(text: str) -> bytes:
    import pyttsx3
    fd, path = tempfile.mkstemp(suffix=".wav")
    os.close(fd)
    try:
        engine = pyttsx3.init()
        engine.setProperty("rate", 175)
        engine.save_to_file(text[:5000], path)
        engine.runAndWait()
        engine.stop()
        data = Path(path).read_bytes()
        if not data:
            raise RuntimeError("TTS produced an empty audio file.")
        return data
    finally:
        try:
            os.remove(path)
        except OSError:
            pass
