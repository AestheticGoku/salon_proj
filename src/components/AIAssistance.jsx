import React, { useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'

const API_BASE_URL = window.location.hostname !== 'salonproj-production.up.railway.app'
  ? `http://${window.location.hostname || 'localhost'}:8000/api`
  : 'https://salonproj-production.up.railway.app/api';

export default function AIAssistance() {
  const { user, addToCart, addBooking, triggerBookingPrefill } = useContext(AppContext)
  const [isOpen, setOpen] = useState(false)
  const [mode, setMode] = useState(null) // null: Welcome/Menu, 'advisor': AI Advisor Quiz, 'planner': AI Planner
  const [step, setStep] = useState(0) // 0: Name, 1: Goal, 2: Skin, 3: Duration, 4: Result (for AI Advisor)
  const [selections, setSelections] = useState({
    goal: '',
    skinType: '',
    duration: '',
    name: ''
  })
  
  // Occasion Planner States
  const [plannerPrompt, setPlannerPrompt] = useState('')
  const [plannerResult, setPlannerResult] = useState(null)
  const [isPlannerLoading, setIsPlannerLoading] = useState(false)

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

  const resetPlanner = () => {
    setPlannerPrompt('')
    setPlannerResult(null)
    setIsAddedToCart(false)
    setIsBooked(false)
  }

  // API Call for AI Advisor (Wellness Curation)
  const fetchCuration = async () => {
    setIsLoading(true)
    setStep(4)
    try {
      const response = await fetch(`${API_BASE_URL}/ai-consultation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        setRecommendation({
          description: "Our connection to the royal backend was interrupted. Using local defaults.",
          services: [
            { id: 'facial', name: 'Luminosity Facials', price: 6800, details: 'Saffron & gold leaf skin refresh' }
          ],
          products: []
        })
      }
    } catch (e) {
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

  const getFallbackPlan = () => ({
    welcomeMessage: "Khammaghani! We are delighted to assist you in preparing for your royal occasion. Here is a curated wellness schedule from Kesari Atelier.",
    timeline: [
      {
        dayNumber: 10,
        timeLabel: "10 Days Before",
        serviceId: "spa",
        serviceName: "Royal Spa Retreats",
        rationale: "Dissolve pre-event tension with our signature Ayurvedic abhyanga massage and warm kesar-milk body wraps."
      },
      {
        dayNumber: 5,
        timeLabel: "5 Days Before",
        serviceId: "facial",
        serviceName: "Luminosity Facials",
        rationale: "Infuse your skin with 24K gold leaves and brightening saffron to ensure a luminous glow for the event."
      },
      {
        dayNumber: 2,
        timeLabel: "2 Days Before",
        serviceId: "salon",
        serviceName: "Heritage Salon",
        rationale: "Adorn your hands with traditional Rajputana jali-style mehndi and prepare your hair with botanical oil infusions."
      }
    ],
    products: [
      {
        id: "bp1",
        name: "Saffron & Rose Luminance Serum",
        brand: "Kesar Naturals",
        price: 3200,
        img: "/images/saffron_serum.png",
        usage: "Apply 3-4 drops nightly on cleansed skin to lock in radiant hydration."
      },
      {
        id: "bp3",
        name: "24K Gold Facial Dust",
        brand: "Royal Glow",
        price: 5500,
        img: "/images/gold_dust.png",
        usage: "Mix a pinch with rose water and apply as a mask twice a week for royal luminosity."
      }
    ]
  })

  // API Call for AI Planner (Occasion Planning)
  const fetchOccasionPlan = async () => {
    if (!plannerPrompt.trim()) return
    setIsPlannerLoading(true)
    setIsAddedToCart(false)
    setIsBooked(false)
    try {
      const guestName = user ? user.name.split(' ')[0] : ''
      const payloadPrompt = guestName 
        ? `Greet and address the guest as "${guestName}". ${plannerPrompt}`
        : plannerPrompt
        
      const response = await fetch(`${API_BASE_URL}/ai-occasion-planner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: payloadPrompt })
      })

      if (response.ok) {
        const data = await response.json()
        setPlannerResult(data)
      } else {
        console.error('Failed to generate occasion plan')
        setPlannerResult(getFallbackPlan())
      }
    } catch (e) {
      console.error('Error connecting to planner API:', e)
      setPlannerResult(getFallbackPlan())
    } finally {
      setIsPlannerLoading(false)
    }
  }

  const handleAddAllProducts = (products) => {
    products.forEach(p => {
      // Map API product keys to catalog product keys
      addToCart({
        id: p.id,
        brand: p.brand,
        name: p.name,
        price: p.price,
        img: p.img
      })
    })
    setIsAddedToCart(true)
  }

  const handleBookAllServices = (services, isTimeline = false) => {
    // Try to guess the event timeframe from the prompt to schedule sequential dates
    const match = plannerPrompt.match(/\d+/)
    const totalDays = match ? parseInt(match[0], 10) : 15

    services.forEach(s => {
      let bookingDate = new Date()
      if (isTimeline && s.dayNumber !== undefined) {
        const daysFromToday = Math.max(0, totalDays - s.dayNumber)
        bookingDate.setDate(bookingDate.getDate() + daysFromToday)
      } else {
        // Default to tomorrow
        bookingDate.setDate(bookingDate.getDate() + 1)
      }

      addBooking({
        firstName: selections.name || 'Guest',
        lastName: 'Royal Advisor',
        service: s.name || s.serviceName,
        date: bookingDate.toISOString().split('T')[0],
        time: 'Afternoon — 2:00 pm',
        phone: '+91 94141 00000',
        specialRequests: `Curated via AI Assistance for: ${plannerPrompt || selections.goal}`
      })
    })
    setIsBooked(true)
  }

  const handleTimelineItemClick = (item) => {
    const match = plannerPrompt.match(/\d+/)
    const totalDays = match ? parseInt(match[0], 10) : 15
    
    let bookingDate = new Date()
    if (item.dayNumber !== undefined) {
      const daysFromToday = Math.max(0, totalDays - item.dayNumber)
      bookingDate.setDate(bookingDate.getDate() + daysFromToday)
    } else {
      bookingDate.setDate(bookingDate.getDate() + 1)
    }
    
    const dateStr = bookingDate.toISOString().split('T')[0]
    setOpen(false)
    triggerBookingPrefill(
      item.serviceName,
      dateStr,
      `Scheduled via AI Occasion Planner: ${plannerPrompt}`
    )
  }

  return (
    <>
      {/* FLOATING ACTION TRIGGER */}
      <button className="ai-assistance-btn" onClick={() => { setOpen(true); setMode(null); resetAdvisor(); resetPlanner(); }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
        AI Assistance
      </button>

      {/* QUIZ WIZARD & PLANNER MODAL */}
      <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={(e) => {
        if (e.target.classList.contains('modal-overlay')) setOpen(false)
      }}>
        <div className="modal ai-modal">
          <button className="modal-close" onClick={() => setOpen(false)}>×</button>

          <div className="ai-wizard">
            {/* MAIN SELECTION MENU */}
            {mode === null && (
              <div className="ai-step-body" style={{ animation: 'fadeIn 0.4s', padding: '1rem 0' }}>
                <span className="section-eyebrow" style={{ color: 'var(--gold-light)' }}>Kesari AI Engine</span>
                <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.2rem', color: '#FFF', margin: '0.5rem 0 1.5rem' }}>
                  Royal AI <span>Assistance</span>
                </h3>
                <p style={{ color: 'rgba(250,248,243,0.6)', fontSize: '0.85rem', lineHeight: '1.8', marginBottom: '2.5rem' }}>
                  Select an AI module to craft your bespoke beauty experience. Let our intelligence match Mewari traditions to your timeline.
                </p>
                
                <div className="ai-options-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.5rem' }}>
                  <button 
                    className="ai-menu-card-btn" 
                    onClick={() => { setMode('advisor'); resetAdvisor(); }}
                  >
                    <span className="ai-card-icon">✦</span>
                    <h4>AI Advisor</h4>
                    <p>Analyze your skin profile and wellness goals to receive a custom product and treatment curation.</p>
                  </button>

                  <button 
                    className="ai-menu-card-btn" 
                    onClick={() => { setMode('planner'); resetPlanner(); }}
                  >
                    <span className="ai-card-icon">📅</span>
                    <h4>AI Planner</h4>
                    <p>Input an upcoming occasion (like a wedding or festival) to generate a custom chronological beauty schedule.</p>
                  </button>
                </div>
              </div>
            )}

            {/* MODULE 1: AI ADVISOR QUIZ */}
            {mode === 'advisor' && (
              <>
                <div className="ai-header">
                  <h3>Royal <span>AI</span> Advisor</h3>
                  <div className="ai-progress-bar">
                    <div className="ai-progress-fill" style={{ width: `${(step / 4) * 100}%` }}></div>
                  </div>
                </div>

                {/* STEP 0: NAME INPUT */}
                {step === 0 && (
                  <div className="ai-step-body" style={{ animation: 'fadeIn 0.3s' }}>
                    <span className="section-eyebrow" style={{ color: 'var(--gold-light)' }}>Wellness Curation</span>
                    <h4 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.6rem', color: '#FFF', margin: '0.5rem 0 1.2rem' }}>
                      Discover Your Bespoke Wellness Ritual
                    </h4>
                    <div className="ai-input-group" style={{ marginBottom: '1.8rem' }}>
                      <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '0.6rem', color: 'var(--gold-light)' }}>
                        How shall we address you?
                      </label>
                      <input 
                        type="text" 
                        placeholder="Enter your name (e.g. Priya)" 
                        value={selections.name}
                        onChange={(e) => handleSelect('name', e.target.value)}
                      />
                    </div>
                    <div className="ai-wizard-footer">
                      <button className="btn-ghost" style={{ borderColor: 'rgba(250,248,243,0.2)', color: '#FFF' }} onClick={() => setMode(null)}>Back to Menu</button>
                      <button className="btn-primary" onClick={() => setStep(1)} disabled={!selections.name.trim()}>Begin</button>
                    </div>
                  </div>
                )}

                {/* STEP 1: GOAL */}
                {step === 1 && (
                  <div className="ai-step-body" style={{ animation: 'fadeIn 0.3s' }}>
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
                        <p>Bespoke hair architecture, grooming, and facial cleanse.</p>
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
                  <div className="ai-step-body" style={{ animation: 'fadeIn 0.3s' }}>
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
                  <div className="ai-step-body" style={{ animation: 'fadeIn 0.3s' }}>
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

                {/* STEP 4: RESULTS */}
                {step === 4 && (
                  <div className="ai-results">
                    {isLoading ? (
                      <div style={{ textAlign: 'center', padding: '4rem 0', animation: 'fadeIn 0.3s' }}>
                        <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>✨</span>
                        <h4 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', color: 'var(--gold-light)' }}>
                          Consulting Python AI Sage...
                        </h4>
                        <p style={{ color: 'rgba(250,248,243,0.4)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                          Mapping your Ayurvedic Curation
                        </p>
                      </div>
                    ) : recommendation ? (
                      <div style={{ animation: 'fadeIn 0.5s' }}>
                        <span className="section-eyebrow" style={{ color: 'var(--gold)' }}>Your Bespoke Curation</span>
                        <h4 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.7rem', color: '#FFF', margin: '0.4rem 0 0.8rem' }}>
                          Rituals for {selections.name}
                        </h4>
                        <p className="ai-res-intro" style={{ color: 'rgba(250,248,243,0.7)', fontSize: '0.82rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>{recommendation.description}</p>
                        
                        {recommendation.services && recommendation.services.length > 0 && (
                          <div className="ai-res-section">
                            <h4 className="ai-section-title">Recommended Spa & Salon Rituals</h4>
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
                            <h4 className="ai-section-title">Recommended Boutique Elixirs</h4>
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
                              {isAddedToCart ? '✓ Added to Basket' : 'Add Elixirs to Basket'}
                            </button>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                          <button 
                            className="btn-ghost" 
                            style={{ flex: 1, borderColor: 'rgba(250,248,243,0.15)', color: 'rgba(250,248,243,0.5)' }} 
                            onClick={() => setMode(null)}
                          >
                            Back to Menu
                          </button>
                          <button 
                            className="btn-primary" 
                            style={{ flex: 1 }} 
                            onClick={() => setOpen(false)}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                        <p style={{ color: 'rgba(250,248,243,0.6)' }}>Error generating curation. Please try again.</p>
                        <button className="btn-ghost" style={{ marginTop: '1.5rem', color: '#FFF' }} onClick={() => setStep(3)}>
                          Back
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* MODULE 2: AI OCCASION PLANNER */}
            {mode === 'planner' && (
              <div className="ai-planner-module" style={{ animation: 'fadeIn 0.3s' }}>
                <div className="ai-header">
                  <h3>Royal <span>AI</span> Planner</h3>
                </div>

                {!plannerResult && !isPlannerLoading && (
                  <div className="ai-step-body" style={{ animation: 'fadeIn 0.3s' }}>
                    <span className="section-eyebrow" style={{ color: 'var(--gold-light)' }}>Chronological Prep</span>
                    <h4 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.6rem', color: '#FFF', margin: '0.5rem 0 1.2rem' }}>
                      Design Your Occasion Timeline
                    </h4>
                    <p style={{ color: 'rgba(250,248,243,0.6)', fontSize: '0.85rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                      Describe your upcoming event and number of days (e.g. "I have my wedding in 20 days"). Our AI will organize a step-by-step beauty and wellness plan leading up to it.
                    </p>

                    <div className="ai-input-group" style={{ marginBottom: '1rem' }}>
                      <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '0.6rem', color: 'var(--gold-light)' }}>
                        Describe your occasion:
                      </label>
                      <textarea 
                        rows="3"
                        placeholder="I have my destination wedding in Udaipur in 20 days and want a full glow prep..."
                        value={plannerPrompt}
                        onChange={(e) => setPlannerPrompt(e.target.value)}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(201,168,76,0.3)', borderRadius: '8px', padding: '0.8rem', color: '#FFF', fontFamily: 'inherit', fontSize: '0.85rem', resize: 'none' }}
                      />
                    </div>

                    {/* Pre-fill Suggestion Chips */}
                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                      {[
                        "Wedding in 20 days",
                        "Engagement in 10 days",
                        "Festive party in 5 days",
                        "Weekend getaway in 3 days"
                      ].map(chip => (
                        <button 
                          key={chip}
                          className="ai-suggestion-chip"
                          onClick={() => setPlannerPrompt(`I have my ${chip.toLowerCase()} and want a royal preparation plan.`)}
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>

                    <div className="ai-wizard-footer">
                      <button className="btn-ghost" style={{ borderColor: 'rgba(250,248,243,0.2)', color: '#FFF' }} onClick={() => setMode(null)}>Back to Menu</button>
                      <button className="btn-primary" onClick={fetchOccasionPlan} disabled={!plannerPrompt.trim()}>Generate Plan</button>
                    </div>
                  </div>
                )}

                {/* LOADING SCREEN */}
                {isPlannerLoading && (
                  <div style={{ textAlign: 'center', padding: '4rem 0', animation: 'fadeIn 0.3s' }}>
                    <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>✨</span>
                    <h4 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', color: 'var(--gold-light)' }}>
                      Curating Royal Schedule...
                    </h4>
                    <p style={{ color: 'rgba(250,248,243,0.4)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                      Aligning treatment timelines to your event date
                    </p>
                  </div>
                )}

                {/* TIMELINE & RECOMMENDATIONS RESULTS */}
                {plannerResult && !isPlannerLoading && (
                  <div className="ai-results" style={{ animation: 'fadeIn 0.5s' }}>
                    <span className="section-eyebrow" style={{ color: 'var(--gold)' }}>Bespoke Occasion Plan</span>
                    <p className="ai-res-intro" style={{ color: 'rgba(250,248,243,0.7)', fontSize: '0.85rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                      {plannerResult.welcomeMessage}
                    </p>

                    {/* Timeline List */}
                    {plannerResult.timeline && plannerResult.timeline.length > 0 && (
                      <div className="ai-planner-timeline" style={{ marginBottom: '2rem' }}>
                        <h4 className="ai-section-title">Sequential Preparation Steps</h4>
                        <div className="vertical-timeline">
                          {plannerResult.timeline.map((item, idx) => (
                            <div 
                              className="timeline-node clickable-node" 
                              key={idx}
                              onClick={() => handleTimelineItemClick(item)}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="timeline-dot"></div>
                              <div className="timeline-content-box">
                                <div className="timeline-time-badge">{item.timeLabel}</div>
                                <h5 className="timeline-service-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                                  {item.serviceName}
                                  <span className="instabook-badge">Book Instantly →</span>
                                </h5>
                                <p className="timeline-service-rationale">{item.rationale}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Product Recommendations */}
                    {plannerResult.products && plannerResult.products.length > 0 && (
                      <div className="ai-res-section" style={{ marginBottom: '2rem' }}>
                        <h4 className="ai-section-title">Daily Saffron & Sandalwood Care</h4>
                        {plannerResult.products.map(p => (
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
                                <p>{p.brand} · {p.usage}</p>
                              </div>
                            </div>
                            <div className="ai-res-price">₹ {p.price.toLocaleString('en-IN')}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="ai-actions-row">
                      {plannerResult.timeline && plannerResult.timeline.length > 0 && (
                        <button 
                          className="btn-primary"
                          style={{ flexGrow: 1 }}
                          onClick={() => handleBookAllServices(plannerResult.timeline, true)}
                          disabled={isBooked}
                        >
                          {isBooked ? '✓ Timeline Bookings Reserved' : 'Book All Timeline Services'}
                        </button>
                      )}
                      {plannerResult.products && plannerResult.products.length > 0 && (
                        <button 
                          className="btn-ghost"
                          style={{ flexGrow: 1, borderColor: 'var(--gold)', color: 'var(--gold)' }}
                          onClick={() => handleAddAllProducts(plannerResult.products)}
                          disabled={isAddedToCart}
                        >
                          {isAddedToCart ? '✓ Products Added' : 'Add Care Products to Basket'}
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.2rem' }}>
                      <button 
                        className="btn-ghost" 
                        style={{ flex: 1, borderColor: 'rgba(250,248,243,0.15)', color: 'rgba(250,248,243,0.5)' }} 
                        onClick={() => { setPlannerResult(null); }}
                      >
                        New Plan
                      </button>
                      <button 
                        className="btn-ghost" 
                        style={{ flex: 1, borderColor: 'rgba(250,248,243,0.15)', color: 'rgba(250,248,243,0.5)' }} 
                        onClick={() => setMode(null)}
                      >
                        Back to Menu
                      </button>
                      <button 
                        className="btn-primary" 
                        style={{ flex: 1 }} 
                        onClick={() => setOpen(false)}
                      >
                        Close
                      </button>
                    </div>
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
