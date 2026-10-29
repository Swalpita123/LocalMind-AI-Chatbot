from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[1]

class Settings(BaseSettings):
    ollama_base_url: str = "http://127.0.0.1:11434"
    ollama_model: str = "qwen2.5:3b"
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    whisper_model: str = "tiny"
    chroma_path: str = "./data/chroma"
    max_upload_mb: int = 15
    chunk_size: int = 900
    chunk_overlap: int = 150
    retrieval_k: int = 4
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    def resolve_path(self, value: str) -> Path:
        p = Path(value)
        return p if p.is_absolute() else (BASE_DIR / p).resolve()

settings = Settings()
