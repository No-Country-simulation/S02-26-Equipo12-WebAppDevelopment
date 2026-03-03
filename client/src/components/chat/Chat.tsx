import './Chat.css'

import { Robot } from '../ui/Icons/Robot'
import { Send } from '../ui/Icons/Send'
import { useRef, useState } from 'react'

type Message = {
  id: string
  role: 'bot' | 'user'
  content: string
}

type Props = {
  onClose?: () => void
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'bot',
    content: "Hello! I'm your sizing assistant. How can I help you today?"
  },
  {
    id: '2',
    role: 'user',
    content: "I need help finding my size"
  }
]

function Chat({ onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSendMessage = () => {
    const trimmedMessage = inputValue.trim()
    if (!trimmedMessage) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedMessage
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <aside className="chat">
      <header>
        <div className="avatar">
          <Robot />
        </div>

        <div className="info">
          <h1>FitBot AI</h1>
          <span>Sizing Assistant - Online</span>
        </div>

        {onClose && (
          <button className="close-btn" onClick={onClose} aria-label="Close chat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </header>

      <div className="messages">
        {
          messages.map((message) => {
            const messageClass = `message ${message.role}`

            return (
              <div key={message.id} className={messageClass}>
                <div className="bubble">
                  {message.content}
                </div>
              </div>
            )
          })
        }
      </div>

      <footer>
        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSendMessage}
            aria-label="Send message">
            <Send />
          </button>
        </div>
      </footer>
    </aside >
  )
}

export default Chat
