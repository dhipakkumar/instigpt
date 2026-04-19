import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'

const SUGGESTED_PROMPTS = [
    "how do i get a girlfriend in insti? lol",
    "how do i increase cg?",
    "how do i bulk more and better in gym?"
]

export default function ChatWindow({ messages, isLoading }) {
  const bottomRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const isOnlyWelcome = messages.length === 1

  return (
    <div className="chat-window" ref={containerRef}>
      <div className="messages-list">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isLoading && <TypingIndicator />}

        {isOnlyWelcome && !isLoading && (
          <div className="suggestion-chips">
            <p className="suggestion-label">Try asking:</p>
            <div className="chips-row">
              {SUGGESTED_PROMPTS.map(prompt => (
                <button
                  key={prompt}
                  className="chip"
                  onClick={() => {
                    // Dispatch a custom event that InputBar & App pick up
                    window.dispatchEvent(
                      new CustomEvent('instigpt:suggest', { detail: prompt })
                    )
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
