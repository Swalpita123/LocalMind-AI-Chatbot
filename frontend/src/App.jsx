
import { useEffect, useRef, useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import WelcomeScreen from "./components/WelcomeScreen";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";

const API_BASE = "http://127.0.0.1:8000";
const STORAGE_KEY = "localmind_chat_history";

function loadChatHistory() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function createChat() {
  return {
    id: crypto.randomUUID(),
    title: "New Chat",
    messages: [],
    updatedAt: Date.now(),
  };
}

function App() {
  const [chatHistory, setChatHistory] = useState(loadChatHistory);

  const [activeChatId, setActiveChatId] = useState(
    () => loadChatHistory()[0]?.id ?? null
  );

  const [messages, setMessages] = useState(
    () => loadChatHistory()[0]?.messages ?? []
  );

  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [speakAnswers, setSpeakAnswers] = useState(true);
  const [files, setFiles] = useState([]);
  const [voiceStatus, setVoiceStatus] = useState("Listening...");

  const inputRef = useRef(null);
  const chatEndRef = useRef(null);

  // Save history whenever it changes.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Save messages to the currently active conversation.
  useEffect(() => {
    if (!activeChatId) return;

    setChatHistory((previous) =>
      previous.map((chat) => {
        if (chat.id !== activeChatId) return chat;

        const firstQuestion = messages.find(
          (message) => message.role === "user"
        );

        const title = (
          firstQuestion?.content || "New Chat"
        ).trim();

        return {
          ...chat,
          title:
            title === "New Chat" ? title : title.slice(0, 36),
          messages,
          updatedAt: Date.now(),
        };
      })
    );
  }, [messages, activeChatId]);

  // Scroll to the latest message.
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, busy]);

  // Create a new conversation.
  const handleNewChat = () => {
    const newChat = createChat();

    setChatHistory((previous) => [newChat, ...previous]);
    setActiveChatId(newChat.id);
    setMessages([]);
    setQuestion("");

    inputRef.current?.focus();
  };

  // Select an existing conversation.
  const handleSelectChat = (chatId) => {
    const selectedChat = chatHistory.find(
      (chat) => chat.id === chatId
    );

    if (!selectedChat) return;

    setActiveChatId(selectedChat.id);
    setMessages([...selectedChat.messages]);
    setQuestion("");
  };

  // Remove a file from the visible list.
  // This does not delete it from the backend knowledge base.
  const removeFileFromDisplay = (name) => {
    setFiles((previous) =>
      previous.filter((file) => file.name !== name)
    );
  };

  // Upload documents to the backend.
  const uploadFiles = async (event) => {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    event.target.value = "";

    if (!selectedFiles.length) return;

    setUploading(true);

    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
          `${API_BASE}/api/documents`,
          {
            method: "POST",
            body: formData,
          }
        );

        const body = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            body.detail || `Upload failed: ${file.name}`
          );
        }

        const chunks =
          body.chunks_added ??
          body.chunks ??
          body.chunk_count ??
          0;

        setFiles((previous) => [
          ...previous.filter((item) => item.name !== file.name),
          { name: file.name, chunks },
        ]);

        setMessages((previous) => [
          ...previous,
          {
            role: "system",
            content: `${file.name} uploaded successfully.`,
          },
        ]);
      }
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "system",
          content: `Upload error: ${error.message}`,
        },
      ]);
    } finally {
      setUploading(false);
    }
  };

  // Send a question to the backend.
  const ask = async (text = question) => {
    const userQuestion = text.trim();

    if (!userQuestion || busy) return;

    // Create a conversation if the user starts chatting
    // directly from the welcome screen.
    let conversationId = activeChatId;

    if (!conversationId) {
      const newChat = createChat();
      conversationId = newChat.id;

      setActiveChatId(newChat.id);
      setChatHistory((previous) => [newChat, ...previous]);
    }

    const history = messages
      .filter((message) =>
        ["user", "assistant"].includes(message.role)
      )
      .map(({ role, content }) => ({ role, content }));

    setQuestion("");

    setMessages((previous) => [
      ...previous,
      { role: "user", content: userQuestion },
    ]);

    setBusy(true);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userQuestion,
          history,
        }),
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          body.detail || body.message || "Failed to get an answer"
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            body.answer ??
            body.response ??
            body.message ??
            "I couldn't generate an answer.",
          sources: Array.isArray(body.sources) ? body.sources : [],
        },
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "system",
          content: `Error: ${error.message}. Check that the backend is running.`,
        },
      ]);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  };

  // Temporary voice placeholders.
  // Replace these with your original MediaRecorder/transcription logic.
  const startVoiceMode = () => {
    setVoiceStatus("Voice recording is not configured yet.");
  };

  const stopVoiceMode = () => {
    setRecording(false);
    setVoiceStatus("Voice chat stopped");
  };

  return (
    <div className="app-shell">
      <Sidebar
        chatHistory={chatHistory}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        files={files}
        onRemoveFile={removeFileFromDisplay}
      />

      <main className="main-panel">
        <section
          className={`chat-area ${
            messages.length ? "has-messages" : ""
          }`}
        >
          {messages.length === 0 ? (
            <WelcomeScreen onAsk={(prompt) => void ask(prompt)} />
          ) : (
            <ChatMessages
              messages={messages}
              busy={busy}
              chatEndRef={chatEndRef}
            />
          )}
        </section>

        <ChatInput
          question={question}
          setQuestion={setQuestion}
          ask={ask}
          busy={busy}
          uploading={uploading}
          uploadFiles={uploadFiles}
          recording={recording}
          startVoiceMode={startVoiceMode}
          stopVoiceMode={stopVoiceMode}
          voiceStatus={voiceStatus}
          speakAnswers={speakAnswers}
          setSpeakAnswers={setSpeakAnswers}
          inputRef={inputRef}
        />
      </main>
    </div>
  );
}

export default App;
