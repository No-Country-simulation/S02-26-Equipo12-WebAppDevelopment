import { useState } from 'react'

import { Robot } from '../ui/Icons/Robot'
import Chat from './Chat'

import './Bubble.css'

function Bubble() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <button
        className={`chat-bubble ${isOpen ? 'hidden' : ''}`}
        onClick={toggleChat}
        aria-label="Open chat"
      >
        <Robot />
      </button>

      {isOpen && (
        <div className="chat-container">
          <Chat onClose={toggleChat} />
        </div>
      )}
    </>
  )
}

export default Bubble
