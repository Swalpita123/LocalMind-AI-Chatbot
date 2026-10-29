
import { Activity, Bot, FileText } from "lucide-react";

function sourceName(source) {
  if (typeof source === "string") return source;

  return (
    source?.filename ||
    source?.file_name ||
    source?.source ||
    source?.name ||
    "Document"
  );
}

export default function ChatMessages({
  messages,
  busy,
  chatEndRef,
}) {
  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <article
          className={`message-row ${message.role}`}
          key={`${message.role}-${index}`}
        >
          <div
            className={`message-avatar ${
              message.role === "user"
                ? "user-avatar"
                : message.role === "system"
                  ? "system-avatar"
                  : "assistant-avatar"
            }`}
          >
            {message.role === "user" ? (
              <span>Y</span>
            ) : message.role === "system" ? (
              <Activity size={17} />
            ) : (
              <Bot size={19} />
            )}
          </div>

          <div className="message-content">
            <div className="message-label">
              {message.role === "user"
                ? "You"
                : message.role === "system"
                  ? "System"
                  : "LocalMind"}
            </div>

            <div className="message-bubble">
              <p>{message.content}</p>
            </div>

            {message.role === "assistant" &&
              message.sources?.length > 0 && (
                <div className="message-sources">
                  <span className="sources-label">
                    <FileText size={13} /> Sources
                  </span>

                  {message.sources.map((source, sourceIndex) => (
                    <span
                      className="source-chip"
                      key={`${sourceName(source)}-${sourceIndex}`}
                    >
                      <FileText size={12} />
                      {sourceName(source)}
                    </span>
                  ))}
                </div>
              )}
          </div>
        </article>
      ))}

      {busy && (
        <article className="message-row assistant">
          <div className="message-avatar assistant-avatar">
            <Bot size={19} />
          </div>

          <div className="message-content">
            <div className="message-label">LocalMind</div>

            <div className="message-bubble thinking-bubble">
              <span className="thinking-dots">
                <i />
                <i />
                <i />
              </span>
              <span>Thinking locally...</span>
            </div>
          </div>
        </article>
      )}

      <div ref={chatEndRef} />
    </div>
  );
}
