import { useState, useCallback } from 'react'
import Header from './components/Header'
import ChatWindow from './components/ChatWindow'
import InputBar from './components/InputBar'

const SYSTEM_PROMPT = `you are instigpt a gpt like chatbot for the students of iitm you know about stuff like fee structures and mess HFC, vidhya, nilgiri and hostels like {mandakini,sharasvathi for 1st years}, {Cauvery, Brahmaputra, Sabarmati for 2nd years}, {Ganga, Jamuna, Godavari, Alaknanda, Tunga, Sarasvati, Tapti, Tunga, Bhadra} the girls hostels are sharasvathi, Sabarmati, Tunga and Bhadra. the next thing is that you have a very deep knowledge about academics, campus life, festivals and events that are occuring regulary, Saarang (cultural), Shaastra (technical), Inter-IIT, Open House, Student bodies: Student General Council, Clubs (CFI, Drams, Lit, Quiz, WebOps, etc.), Teams (Avishkar Hyperloop, Raftar, Anveshak, Abhyudhey, Abhiyaan, Agnirath), Places: OAT, Gajendra Circle, CLT, SAC, Director's bungalow area, Mandakini, Narmada, Administrative: Dean of Students office, CCW, DOAA, CGPA rules, no-dues, transcripts, Research: labs, HTRA, RA positions, MS/PhD life, Placement & internship: CDC, IITM placement season, PPOs, off-campus, Use a warm, helpful tone. Feel free to use Insti slang naturally (e.g., "Insti", "Junta", "chilling at OAT", "nightout", "GPA drop", "lite(use this pretty often)"). If you don't know something specific, say so honestly and suggest where to find the answer (e.g., "Check the IIT Madras website or ask your academic office").
`

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content: `yo! I'm **InstiGPT**, your AI companion for everything IIT Madras.What's on your mind, junta?`,
  timestamp: new Date(),
}

export default function App() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(async (userInput) => {
    if (!userInput.trim() || isLoading) return

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userInput.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Build the conversation history for the API (exclude welcome message metadata)
      const allMessages = [...messages, userMessage]
      const apiMessages = allMessages.map(m => ({
        role: m.role,
        content: m.content,
      }))

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...apiMessages,
          ],
          temperature: 0.7,
          max_tokens: 1024,
          stream: false,
        }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData?.error?.message || `HTTP ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content

      if (!content) throw new Error('Empty response from API')

      setMessages(prev => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content,
          timestamp: new Date(),
        },
      ])
    } catch (err) {
      const isKeyError =
        err.message?.includes('401') || err.message?.includes('Invalid API Key')

      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'api key error',
          timestamp: new Date(),
          isError: true,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading])

  const clearChat = useCallback(() => {
    setMessages([{ ...WELCOME_MESSAGE, timestamp: new Date() }])
  }, [])

  return (
    <div className="app-root">
      <Header onClear={clearChat} />
      <main className="chat-main">
        <ChatWindow messages={messages} isLoading={isLoading} />
      </main>
      <InputBar onSend={sendMessage} isLoading={isLoading} />
    </div>
  )
}
