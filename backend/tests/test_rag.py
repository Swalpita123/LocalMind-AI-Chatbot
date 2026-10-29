from app.rag import RAGService

def test_split_text_creates_chunks():
    service = RAGService()
    docs = service.split_text("Local RAG retrieves document chunks. " * 80, {"filename": "sample.txt"})
    assert len(docs) > 1
    assert all(d.metadata["filename"] == "sample.txt" for d in docs)

def test_graph_compiles_without_model_download():
    assert RAGService().graph is not None
