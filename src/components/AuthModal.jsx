import React, { useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'

export default function AuthModal({ isOpen, onClose }) {
  const { login, signup } = useContext(AppContext)
  const [activeTab, setActiveTab] = useState('login') // 'login' or 'signup'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      let success = false
      if (activeTab === 'login') {
        success = await login(formData.email, formData.password)
      } else {
        if (!formData.name.trim()) {
          setError('Please enter your name.')
          setIsSubmitting(false)
          return
        }
        success = await signup(formData.name, formData.email, formData.password)
      }

      if (success) {
        onClose()
        // Reset form
        setFormData({ name: '', email: '', password: '' })
      } else {
        setError(activeTab === 'login' 
          ? 'Invalid email or password.' 
          : 'Registration failed. Email may already be in use.'
        )
      }
    } catch (err) {
      setError('Connection to backend failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-modal-overlay" onClick={(e) => {
      if (e.target.classList.contains('auth-modal-overlay')) onClose()
    }}>
      <div className="auth-modal">
        <button className="modal-close" onClick={onClose} aria-label="Close form">×</button>
        
        <div className="auth-tabs">
          <button 
            type="button"
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setError(null); }}
          >
            Sign In
          </button>
          <button 
            type="button"
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => { setActiveTab('signup'); setError(null); }}
          >
            Create Account
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="booking-form" style={{ gridTemplateColumns: '1fr', gap: '1rem' }}>
          {activeTab === 'signup' && (
            <div className="form-group">
              <label htmlFor="auth-name">Your Name</label>
              <input 
                type="text" 
                id="auth-name" 
                name="name" 
                placeholder="Priya Rathore"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email">Email Address</label>
            <input 
              type="email" 
              id="auth-email" 
              name="email" 
              placeholder="priya@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <input 
              type="password" 
              id="auth-password" 
              name="password" 
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? 'Please wait...' 
              : activeTab === 'login' 
                ? 'Sign In to Ledger' 
                : 'Establish Account'
            }
          </button>
        </form>
      </div>
    </div>
  )
}
