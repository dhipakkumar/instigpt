export default function TypingIndicator() {
  return (
    <div className="message-row assistant-row">
      <div className="avatar assistant-avatar" aria-hidden="true">IG</div>
      <div className="bubble assistant-bubble typing-bubble" aria-label="InstiGPT is typing">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>
    </div>
  )
}
