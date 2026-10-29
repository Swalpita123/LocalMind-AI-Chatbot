from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    question: str = Field(min_length=1, max_length=8000)
    history: list[dict[str, str]] = Field(default_factory=list)

class SourceItem(BaseModel):
    filename: str
    page: int | None = None
    excerpt: str

class ChatResponse(BaseModel):
    answer: str
    sources: list[SourceItem] = Field(default_factory=list)

class IngestResponse(BaseModel):
    filename: str
    chunks_added: int
    message: str
