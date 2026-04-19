import { useState, useEffect, useRef } from 'react'
import { SendHorizonal } from 'lucide-react'

export default function InputBar({ onSend, isLoading }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  // Listen for suggestion chip clicks from ChatWindow
  useEffect(() => {
    const handler = (e) => {
      setValue(e.detail)
      textareaRef.current?.focus()
    }
    window.addEventListener('instigpt:suggest', handler)
    return () => window.removeEventListener('instigpt:suggest', handler)
  }, [])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [value])

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="input-bar">
      <div className="input-wrapper">
        <textarea
          ref={textareaRef}
          className="chat-input"
          placeholder="Ask anything about Insti... (Enter to send)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isLoading}
          aria-label="Type your message"
        />
        <button
          className={`send-btn ${value.trim() && !isLoading ? 'send-btn-active' : ''}`}
          onClick={handleSubmit}
          disabled={!value.trim() || isLoading}
          aria-label="Send message"
        >
          <SendHorizonal size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}
