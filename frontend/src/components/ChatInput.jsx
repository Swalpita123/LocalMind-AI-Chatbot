
import {
  LoaderCircle,
  Mic,
  MicOff,
  Send,
  Upload,
  Volume2,
  VolumeX,
} from "lucide-react";

export default function ChatInput({
  question,
  setQuestion,
  ask,
  busy,
  uploading,
  uploadFiles,
  recording,
  startVoiceMode,
  stopVoiceMode,
  voiceStatus,
  speakAnswers,
  setSpeakAnswers,
  inputRef,
}) {
  return (
    <div className="composer-wrap">
      <div className="composer">
        <label
          className={`composer-upload ${uploading ? "disabled" : ""}`}
          title={uploading ? "Indexing documents..." : "Upload documents"}
        >
          {uploading ? (
            <LoaderCircle size={20} className="spin-animation" />
          ) : (
            <Upload size={19} />
          )}

          <input
            type="file"
            accept=".pdf,.txt,.md"
            multiple
            onChange={uploadFiles}
            disabled={uploading}
          />
        </label>

        <button
          className={`composer-mic ${recording ? "recording" : ""}`}
          type="button"
          title={
            recording
              ? "Stop continuous voice chat"
              : "Start continuous voice chat"
          }
          onClick={recording ? stopVoiceMode : startVoiceMode}
        >
          {recording ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        <div className="composer-input-wrap">
          <textarea
            ref={inputRef}
            rows={1}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                void ask();
              }
            }}
            placeholder={
              recording ? voiceStatus : "Ask LocalMind anything..."
            }
            disabled={busy}
          />
        </div>

        <div className="composer-tools">
          <button
            className={`speak-toggle ${speakAnswers ? "enabled" : ""}`}
            type="button"
            onClick={() => setSpeakAnswers((value) => !value)}
            title="Toggle spoken answers"
          >
            {speakAnswers ? (
              <Volume2 size={17} />
            ) : (
              <VolumeX size={17} />
            )}
            <span>Speak answers</span>
            <span className="toggle-track">
              <i />
            </span>
          </button>
        </div>

        <button
          className="send-button"
          type="button"
          onClick={() => void ask()}
          disabled={!question.trim() || busy}
          aria-label="Send message"
        >
          <Send size={19} />
        </button>
      </div>
    </div>
  );
}
