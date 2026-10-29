
import { Bot, FileText, MessageSquare, Sparkles } from "lucide-react";

const suggestions = [
  {
    icon: MessageSquare,
    title: "Get started",
    text: "What can you help me with?",
    prompt: "What can you help me with?",
  },
  {
    icon: Sparkles,
    title: "Learn something",
    text: "Explain RAG in simple terms.",
    prompt: "Explain retrieval-augmented generation simply.",
  },
  {
    icon: FileText,
    title: "Explore documents",
    text: "Ask questions about my files.",
    prompt: "How should I ask questions about my documents?",
  },
];

export default function WelcomeScreen({ onAsk }) {
  return (
    <div className="welcome-screen">
      <div className="hero-bot-wrap">
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="hero-orbit orbit-three" />

        <div className="hero-bot">
          <Bot size={65} strokeWidth={1.8} />
          <span className="hero-bot-spark">✦</span>
        </div>
      </div>

      <p className="welcome-eyebrow">YOUR PRIVATE AI ASSISTANT</p>

      <h2>
        Welcome to <span>LocalMind</span>
      </h2>

      <p className="welcome-description">
        Upload your documents, ask questions, and get helpful answers
        <br className="desktop-break" />
        using local AI models. Your data stays on your machine.
      </p>

      <div className="suggestion-area">
        <p>Try asking something like:</p>

        <div className="suggestion-list">
          {suggestions.map((item) => (
            <button
              className="suggestion-chip"
              type="button"
              key={item.title}
              onClick={() => onAsk(item.prompt)}
            >
              <span className="suggestion-arrow">→</span>
              {item.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
