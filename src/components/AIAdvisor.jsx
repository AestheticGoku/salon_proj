import React, { useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'

export default function AIAdvisor() {
  const { addToCart, addBooking } = useContext(AppContext)
  const [isOpen, setOpen] = useState(false)
  const [step, setStep] = useState(0) // 0: Intro, 1: Goal, 2: Skin, 3: Duration, 4: Result
  const [selections, setSelections] = useState({
    goal: '',
    skinType: '',
    duration: '',
    name: ''
  })
  
  const [recommendation, setRecommendation] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [isBooked, setIsBooked] = useState(false)

  const handleSelect = (key, value) => {
    setSelections(prev => ({ ...prev, [key]: value }))
  }

  const resetAdvisor = () => {
    setStep(0)
    setSelections({ goal: '', skinType: '', duration: '', name: '' })
    setRecommendation(null)
    setIsAddedToCart(false)
    setIsBooked(false)
  }

  // API Call to Python backend
  const fetchCuration = async () => {
    setIsLoading(true)
    setStep(4) // Move to results step but show loading
    try {
      const response = await fetch('http://localhost:8000/api/ai-consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: selections.name,
          goal: selections.goal,
          skinType: selections.skinType,
          duration: selections.duration
        })
      })

      if (response.ok) {
        const data = await response.json()
        setRecommendation(data)
      } else {
        console.error('Failed to retrieve AI consultation')
        setRecommendation({
          description: "Our connection to the royal backend was interrupted. Using local defaults.",
          services: [
            { id: 'facial', name: 'Luminosity Facials', price: 6800, details: 'Saffron & gold leaf skin refresh' }
          ],
          products: []
        })
      }
    } catch (e) {
      console.error('Error contacting AI engine:', e)
      setRecommendation({
        description: "Could not establish database link to Python AI engine. Please ensure uvicorn is running on port 8000.",
        services: [
          { id: 'spa', name: 'Royal Spa Retreats', price: 8500, details: 'Backup spa service' }
        ],
        products: []
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAllProducts = (products) => {
    products.forEach(p => addToCart(p))
    setIsAddedToCart(true)
  }

  const handleBookAllServices = (services) => {
    services.forEach(s => {
      addBooking({
        firstName: selections.name || 'Guest',
        lastName: 'Royal Advisor',
        service: s.name,
        date: new Date().toISOString().split('T')[0],
        time: 'Afternoon — 2:00 pm',
        phone: '+91 99999 99999',
        specialRequests: `Curated via AI Wellness Advisor for: ${selections.goal}`
      })
    })
    setIsBooked(true)
  }

  return (
    <>
      {/* FLOATING ACTION TRIGGER */}
      <button className="ai-advisor-btn" onClick={() => { setOpen(true); resetAdvisor(); }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
        AI Advisor
      </button>

      {/* QUIZ WIZARD MODAL */}
      <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={(e) => {
        if (e.target.classList.contains('modal-overlay')) setOpen(false)
      }}>
        <div className="modal ai-modal">
          <button className="modal-close" onClick={() => setOpen(false)}>×</button>

          <div className="ai-wizard">
            <div className="ai-header">
              <h3>Royal <span>AI</span> Wellness Advisor</h3>
              <div className="ai-progress-bar">
                <div className="ai-progress-fill" style={{ width: `${(step / 4) * 100}%` }}></div>
              </div>
            </div>

            {/* STEP 0: WELCOME */}
            {step === 0 && (
              <div className="ai-step-body" style={{ animation: 'fadeIn 0.4s' }}>
                <span className="section-eyebrow" style={{ color: 'var(--gold-light)' }}>Heritage Intelligence</span>
                <h4 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.8rem', color: '#FFF', margin: '0.8rem 0 1.2rem' }}>
                  Discover Your Bespoke Wellness Ritual
                </h4>
                <p style={{ color: 'rgba(250,248,243,0.6)', fontSize: '0.85rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                  Our AI advisor connects directly to our Python backend to apply Ayurvedic logic, matching local Udaipur ingredients to your skin profile and occasion.
                </p>
                <div className="ai-input-group">
                  <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '0.5rem', color: 'var(--gold-light)' }}>
                    How shall we address you?
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter your name (e.g. Priya)" 
                    value={selections.name}
                    onChange={(e) => handleSelect('name', e.target.value)}
                  />
                </div>
                <button 
                  className="btn-primary" 
                  style={{ width: '100%', padding: '1rem' }} 
                  onClick={() => setStep(1)}
                  disabled={!selections.name.trim()}
                >
                  Begin Consultation
                </button>
              </div>
            )}

            {/* STEP 1: GOAL */}
            {step === 1 && (
              <div className="ai-step-body" style={{ animation: 'fadeIn 0.4s' }}>
                <div className="ai-step-title">What is your principal wellness goal, {selections.name}?</div>
                <div className="ai-options-grid">
                  <div 
                    className={`ai-opt-card ${selections.goal === 'bridal' ? 'selected' : ''}`}
                    onClick={() => handleSelect('goal', 'bridal')}
                  >
                    <h4>Bridal / Groom Glow</h4>
                    <p>Preparation for a destination wedding or special royal ceremony.</p>
                  </div>
                  <div 
                    className={`ai-opt-card ${selections.goal === 'detox' ? 'selected' : ''}`}
                    onClick={() => handleSelect('goal', 'detox')}
                  >
                    <h4>Lakeside Detox</h4>
                    <p>Deep stress relief, massage therapy, and Ayurvedic body detox.</p>
                  </div>
                  <div 
                    className={`ai-opt-card ${selections.goal === 'grooming' ? 'selected' : ''}`}
                    onClick={() => handleSelect('goal', 'grooming')}
                  >
                    <h4>Rajputana Styling</h4>
                    <p>Bespoke hair architecture, beard grooming, and facial cleanse.</p>
                  </div>
                  <div 
                    className={`ai-opt-card ${selections.goal === 'pamper' ? 'selected' : ''}`}
                    onClick={() => handleSelect('goal', 'pamper')}
                  >
                    <h4>Weekend Escape</h4>
                    <p>Saffron luminosity facials, spa refresh, and custom nail art.</p>
                  </div>
                </div>
                <div className="ai-wizard-footer">
                  <button className="btn-ghost" style={{ borderColor: 'rgba(250,248,243,0.2)', color: '#FFF' }} onClick={() => setStep(0)}>Back</button>
                  <button className="btn-primary" onClick={() => setStep(2)} disabled={!selections.goal}>Next Step</button>
                </div>
              </div>
            )}

            {/* STEP 2: SKIN TYPE */}
            {step === 2 && (
              <div className="ai-step-body" style={{ animation: 'fadeIn 0.4s' }}>
                <div className="ai-step-title">Select your skin or scalp profile:</div>
                <div className="ai-options-grid">
                  <div 
                    className={`ai-opt-card ${selections.skinType === 'dry' ? 'selected' : ''}`}
                    onClick={() => handleSelect('skinType', 'dry')}
                  >
                    <h4>Dry & Sun-kissed</h4>
                    <p>Needs intense sandalwood hydration and saffron skin polishing.</p>
                  </div>
                  <div 
                    className={`ai-opt-card ${selections.skinType === 'sensitive' ? 'selected' : ''}`}
                    onClick={() => handleSelect('skinType', 'sensitive')}
                  >
                    <h4>Sensitive & Delicate</h4>
                    <p>Requires rose quartz cooling gua sha and raw kesar milk baths.</p>
                  </div>
                  <div 
                    className={`ai-opt-card ${selections.skinType === 'active' ? 'selected' : ''}`}
                    onClick={() => handleSelect('skinType', 'active')}
                  >
                    <h4>Active & Oily</h4>
                    <p>Requires organic clay ubtan, Aravalli herbs, and steam detox.</p>
                  </div>
                </div>
                <div className="ai-wizard-footer">
                  <button className="btn-ghost" style={{ borderColor: 'rgba(250,248,243,0.2)', color: '#FFF' }} onClick={() => setStep(1)}>Back</button>
                  <button className="btn-primary" onClick={() => setStep(3)} disabled={!selections.skinType}>Next Step</button>
                </div>
              </div>
            )}

            {/* STEP 3: DURATION */}
            {step === 3 && (
              <div className="ai-step-body" style={{ animation: 'fadeIn 0.4s' }}>
                <div className="ai-step-title">How long are you staying in Udaipur?</div>
                <div className="ai-options-grid">
                  <div 
                    className={`ai-opt-card ${selections.duration === 'day' ? 'selected' : ''}`}
                    onClick={() => handleSelect('duration', 'day')}
                  >
                    <h4>Just a Single Day</h4>
                    <p>A fast, high-impact combination of treatments and spa rituals.</p>
                  </div>
                  <div 
                    className={`ai-opt-card ${selections.duration === 'week' ? 'selected' : ''}`}
                    onClick={() => handleSelect('duration', 'week')}
                  >
                    <h4>A Few Days / Week</h4>
                    <p>Multi-session Ayurvedic program and skin preparation.</p>
                  </div>
                  <div 
                    className={`ai-opt-card ${selections.duration === 'long' ? 'selected' : ''}`}
                    onClick={() => handleSelect('duration', 'long')}
                  >
                    <h4>Udaipur Resident</h4>
                    <p>Ongoing monthly memberships and bridal trousseau prep.</p>
                  </div>
                </div>
                <div className="ai-wizard-footer">
                  <button className="btn-ghost" style={{ borderColor: 'rgba(250,248,243,0.2)', color: '#FFF' }} onClick={() => setStep(2)}>Back</button>
                  <button className="btn-primary" onClick={fetchCuration} disabled={!selections.duration}>Generate Curation</button>
                </div>
              </div>
            )}

            {/* STEP 4: RESULTS & LOADING */}
            {step === 4 && (
              <div className="ai-results">
                {isLoading ? (
                  <div style={{ textAlign: 'center', padding: '4rem 0', animation: 'fadeIn 0.3s' }}>
                    <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>✨</span>
                    <h4 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', color: 'var(--gold-light)' }}>
                      Consulting Python AI Sage...
                    </h4>
                    <p style={{ color: 'rgba(250,248,243,0.4)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                      Mapping your Ayurvedic Dosha in Udaipur
                    </p>
                  </div>
                ) : recommendation ? (
                  <div style={{ animation: 'fadeIn 0.5s' }}>
                    <span className="section-eyebrow" style={{ color: 'var(--gold)' }}>Your Bespoke Prescription</span>
                    <h4 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.7rem', color: '#FFF', margin: '0.4rem 0 0.8rem' }}>
                      Rituals for {selections.name}
                    </h4>
                    <p className="ai-res-intro">{recommendation.description}</p>
                    
                    {recommendation.services && recommendation.services.length > 0 && (
                      <div className="ai-res-section">
                        <h4>Recommended Spa & Salon Rituals</h4>
                        {recommendation.services.map(s => (
                          <div className="ai-res-card" key={s.id}>
                            <div className="ai-res-info">
                              <h5>{s.name}</h5>
                              <p>{s.details}</p>
                            </div>
                            <div className="ai-res-price">₹ {s.price.toLocaleString('en-IN')}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {recommendation.products && recommendation.products.length > 0 && (
                      <div className="ai-res-section">
                        <h4>Recommended Boutique Elixirs</h4>
                        {recommendation.products.map(p => (
                          <div className="ai-res-card" key={p.id}>
                            <div className="ai-res-info" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                              <span style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', width: '32px', height: '32px', overflow: 'hidden' }}>
                                {p.img && p.img.startsWith('/images/') ? (
                                  <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  p.img
                                )}
                              </span>
                              <div>
                                <h5>{p.name}</h5>
                                <p>{p.brand}</p>
                              </div>
                            </div>
                            <div className="ai-res-price">₹ {p.price.toLocaleString('en-IN')}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="ai-actions-row">
                      {recommendation.services && recommendation.services.length > 0 && (
                        <button 
                          className="btn-primary"
                          style={{ flexGrow: 1 }}
                          onClick={() => handleBookAllServices(recommendation.services)}
                          disabled={isBooked}
                        >
                          {isBooked ? '✓ Experiences Scheduled' : 'Book Services Now'}
                        </button>
                      )}
                      {recommendation.products && recommendation.products.length > 0 && (
                        <button 
                          className="btn-ghost"
                          style={{ flexGrow: 1, borderColor: 'var(--gold)', color: 'var(--gold)' }}
                          onClick={() => handleAddAllProducts(recommendation.products)}
                          disabled={isAddedToCart}
                        >
                          {isAddedToCart ? '✓ Added to Boutique Basket' : 'Add Elixirs to Basket'}
                        </button>
                      )}
                    </div>

                    <button 
                      className="btn-ghost" 
                      style={{ width: '100%', marginTop: '1rem', borderColor: 'rgba(250,248,243,0.15)', color: 'rgba(250,248,243,0.5)' }} 
                      onClick={() => setOpen(false)}
                    >
                      Close & View Website
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                    <p style={{ color: 'rgba(250,248,243,0.6)' }}>Error generating consultation. Please try again.</p>
                    <button className="btn-ghost" style={{ marginTop: '1.5rem', color: '#FFF' }} onClick={() => setStep(3)}>
                      Back
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Loading Spin Style Injection */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}
