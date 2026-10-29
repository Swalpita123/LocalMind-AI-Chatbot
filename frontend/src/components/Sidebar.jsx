
import {
  Bot,
  FileText,
  MessageSquare,
  ShieldCheck,
  X,
} from "lucide-react";

export default function Sidebar({
  chatHistory,
  activeChatId,
  onNewChat,
  onSelectChat,
  files,
  onRemoveFile,
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-bot">
          <Bot size={31} strokeWidth={2} />
          <span className="bot-glow" />
        </div>

        <div className="brand-copy">
          <h1>
            Local<span>Mind</span>
          </h1>
          <p>AI Chatbot</p>
        </div>
      </div>

      <div className="sidebar-nav">
        <button
          className="nav-item new-chat-button"
          type="button"
          onClick={onNewChat}
        >
          <MessageSquare size={19} />
          <span>New Chat</span>
          <span className="new-chat-plus">+</span>
        </button>
      </div>

      <div className="sidebar-divider" />

      <p className="sidebar-label">CHAT HISTORY</p>

      <div className="chat-history-list">
        {chatHistory.length === 0 ? (
          <p className="empty-documents">
            Your conversations will appear here.
          </p>
        ) : (
          [...chatHistory]
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .map((chat) => (
              <button
                key={chat.id}
                type="button"
                className={`nav-item history-item ${
                  activeChatId === chat.id ? "active" : ""
                }`}
                onClick={() => onSelectChat(chat.id)}
                title={chat.title}
              >
                <MessageSquare size={17} />
                <span>{chat.title}</span>
              </button>
            ))
        )}
      </div>

      <div className="document-list">
        {files.length === 0 ? (
          <div className="empty-documents">
            <FileText size={17} />
            <span>Your uploaded files will appear here.</span>
          </div>
        ) : (
          files.map((file) => (
            <div className="document-item" key={file.name}>
              <div className="document-icon">
                <FileText size={18} />
              </div>

              <div className="document-meta">
                <span title={file.name}>{file.name}</span>
                <small>{file.chunks} chunks</small>
              </div>

              <button
                type="button"
                className="document-remove"
                title="Remove from this list"
                aria-label={`Remove ${file.name} from visible list`}
                onClick={() => onRemoveFile(file.name)}
              >
                <X size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="sidebar-bottom">
        <div className="privacy-icon">
          <ShieldCheck size={21} />
        </div>
        <div className="privacy-copy">
          <strong>
            Local Processing Enabled <i />
          </strong>
          <span>Your data stays on this machine</span>
        </div>
      </div>
    </aside>
  );
}
