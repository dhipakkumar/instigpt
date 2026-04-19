import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`message-row ${isUser ? 'user-row' : 'assistant-row'}`}>
      {!isUser && (
        <div className="avatar assistant-avatar" aria-hidden="true">
          IG
        </div>
      )}

      <div className={`bubble ${isUser ? 'user-bubble' : 'assistant-bubble'} ${message.isError ? 'error-bubble' : ''}`}>
        <div className="bubble-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer" />
              ),
              // Style code blocks
              code: ({ node, inline, ...props }) =>
                inline ? (
                  <code className="inline-code" {...props} />
                ) : (
                  <code className="block-code" {...props} />
                ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        <span className="bubble-time">{formatTime(message.timestamp)}</span>
      </div>

      {isUser && (
        <div className="avatar user-avatar" aria-hidden="true">
          U
        </div>
      )}
    </div>
  )
}
