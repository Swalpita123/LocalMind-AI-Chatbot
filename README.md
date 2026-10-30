# LocalMind — AI-Powered Voice & Document Assistant

LocalMind is a privacy-focused AI assistant that allows users to upload documents, ask questions in natural language, and interact through voice. It combines a React frontend, FastAPI backend, and Retrieval-Augmented Generation (RAG) to provide context-aware answers from uploaded documents.

## Features

- **Document Q&A:** Upload documents and ask questions about their content.
- **RAG Pipeline:** Retrieve relevant information from documents to answer questions.
- **Local LLM:** Generate responses using Ollama and a locally running language model.
- **Voice Input:** Convert spoken questions into text using faster-whisper.
- **Text-to-Speech:** Listen to AI-generated responses.
- **Chat History:** Keep track of conversations in the interface.
- **Modern UI:** Responsive React interface with custom CSS.
- **Local Execution:** Run the application locally with your own models and documents.

## Tech Stack

- **Frontend:** React, JavaScript, CSS
- **Backend:** Python, FastAPI
- **AI Orchestration:** LangChain, LangGraph
- **Vector Database:** ChromaDB
- **Embeddings:** Sentence Transformers
- **LLM Runtime:** Ollama
- **Language Model:** Qwen2.5 3B
- **Speech Recognition:** faster-whisper
- **Text-to-Speech:** pyttsx3

## Architecture

1. Users upload documents through the React interface.
2. FastAPI processes the uploaded documents.
3. ChromaDB stores information for similarity-based retrieval.
4. Relevant document context is retrieved when a question is asked.
5. The language model generates a context-aware answer.
6. Users can interact using text or voice and listen to responses.

## Prerequisites

- Python and pip
- Node.js and npm
- Git
- Ollama
- The language model configured for the application

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Swalpita123/LocalMind-AI-Chatbot.git
cd LocalMind
```

### 2. Configure Ollama

Install Ollama from https://ollama.com/.

If your application is configured to use Qwen2.5 3B, download the model:

```bash
ollama pull qwen2.5:3b
```

Ensure Ollama is running before using the assistant.

### 3. Set up the backend

Create a Python virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install dependencies using your project's dependency file:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### 4. Set up the frontend

Open another terminal in the directory containing `package.json`:

```bash
npm install
npm run dev
```

Open the local URL displayed in your terminal.

> Adjust commands if your actual backend entry point, dependency file, or frontend directory differs from these examples.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Check backend health |
| POST | `/api/documents` | Upload documents |
| POST | `/api/chat` | Submit a question and receive an answer |
| POST | `/api/voice/transcribe` | Convert audio to text |
| POST | `/api/voice/speak` | Generate speech from text |

**Local backend URL:** `http://127.0.0.1:8000`

## Security and Privacy

- Do not commit API keys, passwords, or secret configuration.
- Do not upload private documents or personal data to the repository.
- Exclude virtual environments, downloaded model weights, and generated vector databases from Git.
- Review `.gitignore` before pushing changes.
- Local execution does not automatically guarantee privacy; verify which services the application sends data to.

## Future Enhancements

- Improve document processing and retrieval accuracy.
- Add automated tests for backend APIs.
- Improve voice interaction and error handling.
- Add configurable deployment settings.
- Introduce authentication and per-user document isolation if needed.

## Contributing

Suggestions and improvements are welcome. Open an issue to report a bug or discuss a feature.

## License

A license has not yet been specified. Add a `LICENSE` file before distributing the project as open-source software.
