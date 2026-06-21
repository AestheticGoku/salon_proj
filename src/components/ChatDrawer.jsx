import React, { useState, useEffect, useContext, useRef } from 'react'
import { AppContext } from '../context/AppContext'

export default function ChatDrawer({ isOpen, onClose }) {
  const { user } = useContext(AppContext)
  const [activeTab, setActiveTab] = useState('ai') // 'ai' or 'staff'
  const [inputText, setInputText] = useState('')
  
  // AI Tab Chat History
  const [aiMessages, setAiMessages] = useState([
    {
      sender: 'bot',
      message: 'Khammaghani. I am your Royal AI Concierge for Kesari Atelier. I am informed on all of Kesari Atelier\'s luxury retreats, elixirs, pricing, and master artisans. How may I assist you in your wellness journey today?'
    }
  ])
  const [isAiLoading, setIsAiLoading] = useState(false)

  // Staff Tab Chat History
  const [staffMessages, setStaffMessages] = useState([])
  const [isStaffLoading, setIsStaffLoading] = useState(false)
  const [isStaffTyping, setIsStaffTyping] = useState(false)

  const messagesEndRef = useRef(null)
  const isSendingRef = useRef(false)

  // Scroll to bottom of message container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Blur any focused element when drawer opens to prevent keyboard from opening
  // and browser from scrolling to the input
  useEffect(() => {
    if (isOpen) {
      document.activeElement?.blur()
    }
  }, [isOpen])

  // Fetch staff messages when tab/open state changes
  useEffect(() => {
    if (isOpen && activeTab === 'staff' && user) {
      fetchStaffMessages()
    }
  }, [isOpen, activeTab])

  // Scroll to bottom only when new messages arrive, not on initial open
  useEffect(() => {
    const isInitialAiMessage = activeTab === 'ai' && aiMessages.length === 1
    if (isInitialAiMessage) return
    scrollToBottom()
  }, [aiMessages, staffMessages, isStaffTyping])

  // Periodic poll for staff chat
  useEffect(() => {
    let interval;
    if (isOpen && activeTab === 'staff' && user) {
      interval = setInterval(() => {
        fetchStaffMessages()
      }, 4000)
    }
    return () => clearInterval(interval)
  }, [isOpen, activeTab, user])

  const fetchStaffMessages = async () => {
    if (!user) return
    try {
      const response = await fetch(`http://localhost:8000/api/chat/staff?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setStaffMessages(data)
        if (data.length > 0 && data[data.length - 1].sender === 'staff') {
          setIsStaffTyping(false)
        }
      }
    } catch (e) {
      console.error('Error fetching staff messages:', e)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!inputText.trim() || isSendingRef.current) return

    isSendingRef.current = true
    const textToSend = inputText
    setInputText('')

    if (activeTab === 'ai') {
      setAiMessages(prev => [...prev, { sender: 'user', message: textToSend }])
      setIsAiLoading(true)

      try {
        const response = await fetch('http://localhost:8000/api/chat/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: textToSend })
        })
        if (response.ok) {
          const data = await response.json()
          setAiMessages(prev => [...prev, { sender: 'bot', message: data.reply }])
        } else {
          setAiMessages(prev => [...prev, { sender: 'bot', message: 'I apologize, my royal link is weak. Please try again.' }])
        }
      } catch (err) {
        setAiMessages(prev => [...prev, { sender: 'bot', message: 'Could not reach the AI Concierge server. Please check your backend connection.' }])
      } finally {
        setIsAiLoading(false)
        isSendingRef.current = false
      }
    } else {
      if (!user) {
        isSendingRef.current = false
        return
      }

      const tempUserMsg = { sender: 'user', message: textToSend, timestamp: new Date().toISOString() }
      setStaffMessages(prev => [...prev, tempUserMsg])

      setTimeout(() => {
        setIsStaffTyping(true)
      }, 1000)

      try {
        const response = await fetch('http://localhost:8000/api/chat/staff', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            sender: 'user',
            message: textToSend
          })
        })

        if (response.ok) {
          await fetchStaffMessages()
        }
      } catch (err) {
        console.error('Error sending staff message:', err)
      } finally {
        isSendingRef.current = false
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="chat-drawer-overlay open" onClick={(e) => {
      if (e.target.classList.contains('chat-drawer-overlay')) onClose()
    }}>
      <div className="chat-drawer" onTouchStart={(e) => e.stopPropagation()}>
        <div className="chat-drawer-header">
          <h3>Kesari <span>Concierge</span></h3>
          <button className="cart-close" onClick={onClose} style={{ color: 'var(--ivory)' }}>×</button>
        </div>

        <div className="chat-tabs-nav">
          <button 
            className={`chat-tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai')}
          >
            AI Concierge
          </button>
          <button 
            className={`chat-tab-btn ${activeTab === 'staff' ? 'active' : ''}`}
            onClick={() => setActiveTab('staff')}
          >
            1-to-1 Staff Chat
          </button>
        </div>

        <div className="chat-messages-area">
          {activeTab === 'ai' ? (
            aiMessages.map((msg, index) => (
              <div className={`chat-bubble ${msg.sender}`} key={index}>
                {msg.sender === 'bot' && <span className="chat-bubble-sender">AI Concierge</span>}
                {msg.message}
              </div>
            ))
          ) : (
            !user ? (
              <div className="chat-system-notification" style={{ marginTop: '4rem' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>🔒</span>
                <p>To request a live 1-to-1 conversation with our master artisans or concierge desk, please **Sign In** using the account button in the header.</p>
              </div>
            ) : (
              <>
                <div className="chat-system-notification">
                  Connected with Concierge Desk (Online)
                  <p style={{ fontSize: '0.65rem', color: 'var(--gold-light)', marginTop: '0.2rem' }}>Typically replies in under 2 minutes</p>
                </div>
                
                {staffMessages.length === 0 && (
                  <div className="chat-bubble staff">
                    <span className="chat-bubble-sender">Vandana Sisodia · Manager</span>
                    Khammaghani {user.name.split(' ')[0]}. I am online and happy to assist with any custom spa itineraries, bridal bookings, or products details. What is on your mind?
                  </div>
                )}

                {staffMessages.map((msg, index) => (
                  <div className={`chat-bubble ${msg.sender}`} key={index}>
                    {msg.sender === 'staff' && (
                      <span className="chat-bubble-sender">Vandana Sisodia · Concierge</span>
                    )}
                    {msg.message}
                  </div>
                ))}

                {isStaffTyping && (
                  <div className="chat-bubble staff" style={{ fontStyle: 'italic', color: 'rgba(250,248,243,0.5)', padding: '0.8rem 1.2rem' }}>
                    Vandana is typing...
                  </div>
                )}
              </>
            )
          )}
          
          {activeTab === 'ai' && isAiLoading && (
            <div className="chat-bubble bot" style={{ fontStyle: 'italic', color: 'rgba(250,248,243,0.5)' }}>
              AI Concierge is thinking...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {(activeTab === 'ai' || user) && (
          <form className="chat-input-bar" onSubmit={handleSend}>
            <input 
              type="text"
              autoFocus={false}
              placeholder={activeTab === 'ai' ? "Ask about treatments, prices, hours..." : "Message spa staff..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              required
            />
            <button 
              type="submit" 
              className="chat-send-btn"
              disabled={(activeTab === 'ai' && isAiLoading) || (activeTab === 'staff' && isStaffTyping)}
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  )
}