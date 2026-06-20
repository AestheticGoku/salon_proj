import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from './context/AppContext'
import Navigation from './components/Navigation'
import BoutiqueCart from './components/BoutiqueCart'
import AIAdvisor from './components/AIAdvisor'
import ChatDrawer from './components/ChatDrawer'
import AdminDashboard from './components/AdminDashboard'

export default function App() {
  const { cart, addToCart, bookings, addBooking, deleteBooking, activeTab, setActiveTab, user, setAuthOpen } = useContext(AppContext)
  const [isChatOpen, setChatOpen] = useState(false)
  
  // Testimonials state
  const testimonials = [
    {
      text: '"The Maharani Day Journey was unlike anything I have experienced — each ritual felt like an act of devotion. I left feeling restored to something I had forgotten about myself."',
      author: '— Nalini Agarwal, Delhi · Maharani Day Journey'
    },
    {
      text: '"Vandana made me feel like an actual queen on my wedding day. The attention to every detail — the mehndi, the skin, the hair — was poetry in practice."',
      author: '— Shreya Bhatt, Ahmedabad · Elite Bridal Package'
    },
    {
      text: '"I have visited spas across the world. Udaipur Royal Wellness is the only place where tradition and luxury feel completely at home together. Non-negotiable on every visit."',
      author: '— Kavita Menon, Mumbai · Royal Spa Retreat'
    }
  ]
  const [activeTesti, setActiveTesti] = useState(0)

  // Automatic slide interval for testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTesti(prev => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // Services Modal details state
  const services = {
    spa: {
      title: 'Royal Spa Retreats',
      desc: 'Ancient Panchakarma detox, warm kesar-milk body wraps, and chakra-balancing massages in our palace-inspired suites overlooking Lake Pichola.',
      price: 'From ₹ 8,500',
      includes: ['Signature abhyanga full-body massage (90 min)', 'Kesar milk & saffron body wrap', 'Chakra balancing crystal therapy', 'Herbal steam & cold plunge', 'Complimentary chai & mithai']
    },
    salon: {
      title: 'Heritage Salon',
      desc: 'Master artisans trained in centuries of Rajputana beauty tradition — intricate mehndi, kumkum rituals, and couture styling.',
      price: 'From ₹ 3,200',
      includes: ['Traditional Rajputana mehndi (hands)', 'Herbal hair oil ritual & blow dry', 'Kumkum & kajal eye ceremony', 'Customised hair colour consultation', 'Sandalwood post-treatment care']
    },
    bridal: {
      title: 'Elite Bridal Grooming',
      desc: 'Complete bridal transformation programmes spanning 30-day skin preparation to day-of artistry.',
      price: 'From ₹ 45,000',
      includes: ['30-day pre-bridal skin luminosity program', 'Full bridal makeup & hair architecture', 'Bespoke family-motif mehndi', 'Bridal party preparation (up to 6)', 'On-location setup at your venue']
    },
    wellness: {
      title: 'Wellness Alchemy',
      desc: 'Holistic Ayurvedic consultations, herbal steam therapy, and curated nutrition journeys led by certified practitioners.',
      price: 'From ₹ 5,500',
      includes: ['Pulse-diagnosis Ayurvedic consultation', 'Customised herbal formulation', 'Shirodhara warm oil therapy (60 min)', 'Detox dietary plan (7-day)', 'Follow-up wellbeing check-in']
    },
    facial: {
      title: 'Luminosity Facials',
      desc: '24K gold infusions, rose quartz gua sha, and Rajasthani saffron elixirs for skin that glows like the ghats at dusk.',
      price: 'From ₹ 6,800',
      includes: ['Deep-cleanse & enzyme exfoliation', '24K gold leaf infusion mask', 'Rose quartz gua sha sculpting', 'Saffron & turmeric brightening serum', 'LED light therapy finish']
    },
    nail: {
      title: 'Haute Nail Atelier',
      desc: 'Bespoke nail artistry drawing from jharokha lattices, mirror-work embroidery, and palace fresco motifs.',
      price: 'From ₹ 2,400',
      includes: ['Botanical soak & cuticle ritual', 'Customised heritage nail art', 'Gel or Shellac long-wear finish', 'Paraffin hand mask treatment', 'Complimentary nail care kit']
    }
  }

  const [activeModalService, setActiveModalService] = useState(null) // null or key of service

  // Booking Form State
  const [bookingFormData, setBookingFormData] = useState({
    firstName: '',
    lastName: '',
    service: 'Royal Spa Retreats',
    date: '',
    time: 'Morning — 9:00 am',
    phone: '',
    specialRequests: ''
  })
  const [bookingStatus, setBookingStatus] = useState(null) // null, 'success'

  const handleBookingChange = (e) => {
    const { name, value } = e.target
    setBookingFormData(prev => ({ ...prev, [name]: value }))
  }

  const submitBooking = (e) => {
    e.preventDefault()
    if (!user) {
      setAuthOpen(true)
      return
    }
    if (!bookingFormData.firstName || !bookingFormData.phone || !bookingFormData.date) {
      alert('Please fill out Name, Phone, and Preferred Date.')
      return
    }
    
    addBooking(bookingFormData)
    setBookingStatus('success')
    
    // Reset status after 3 seconds
    setTimeout(() => {
      setBookingStatus(null)
      setBookingFormData({
        firstName: '',
        lastName: '',
        service: 'Royal Spa Retreats',
        date: '',
        time: 'Morning — 9:00 am',
        phone: '',
        specialRequests: ''
      })
    }, 4000)
  }

  // Boutique items data
  const boutiqueProducts = [
    { id: 'bp1', brand: 'Kesar Naturals', name: 'Saffron & Rose Luminance Serum', price: 3200, img: '/images/saffron_serum.png', badge: 'Bestseller' },
    { id: 'bp2', brand: 'Udaipur Attar', name: 'Jasmine & Vetiver Ritual Oil', price: 1800, img: '/images/ritual_oil.png' },
    { id: 'bp3', brand: 'Royal Glow', name: '24K Gold Facial Dust', price: 5500, img: '/images/gold_dust.png', badge: 'Limited' },
    { id: 'bp4', brand: 'Aravalli Herbs', name: 'Sandalwood Ubtan Body Scrub', price: 1200, img: '/images/body_scrub.png' }
  ]

  const handleScrollToSection = (id) => {
    setActiveTab('home')
    setTimeout(() => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <>
      <Navigation />
      
      {activeTab === 'admin' ? (
        <AdminDashboard />
      ) : activeTab === 'bookings' ? (
        /* BOOKINGS LISTING VIEW */
        <section className="bookings-list view-container" style={{ animation: 'fadeIn 0.5s' }}>
          <span className="section-eyebrow">Your Wellness Ledger</span>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Active <em>Reservations</em></h2>
          <p style={{ color: 'var(--charcoal-soft)', fontSize: '0.85rem' }}>Here are your scheduled spa journeys and heritage beauty ceremonies.</p>
          
          <div className="bookings-grid">
            {bookings.length === 0 ? (
              <div className="booking-card" style={{ justifyContent: 'center', padding: '4rem 2rem', fontStyle: 'italic', color: 'var(--charcoal-soft)' }}>
                No active bookings found. Select a ritual on the home page to reserve.
              </div>
            ) : (
              bookings.map((b) => {
                const statusColor = b.status === 'Confirmed' ? '#4CAF50' : b.status === 'Rejected' ? '#e07a5f' : 'var(--gold)';
                return (
                  <div className="booking-card" key={b.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: `3px solid ${statusColor}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                      <div className="booking-card-details" style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                          <h3 style={{ margin: 0 }}>{b.service}</h3>
                          <span 
                            style={{ 
                              fontSize: '0.62rem', 
                              padding: '0.2rem 0.5rem', 
                              background: b.status === 'Confirmed' ? 'rgba(76, 175, 80, 0.1)' : b.status === 'Rejected' ? 'rgba(224, 122, 95, 0.1)' : 'rgba(223, 179, 78, 0.1)',
                              color: statusColor,
                              border: `0.5px solid ${statusColor}`,
                              letterSpacing: '0.05em',
                              textTransform: 'uppercase',
                              fontWeight: 500
                            }}
                          >
                            {b.status || 'Pending'}
                          </span>
                        </div>
                        <p>Reserved for: <strong>{b.firstName} {b.lastName}</strong></p>
                        <p>Date & Time: <strong>{b.date} at {b.time}</strong></p>
                        <p>Concierge Contact: <strong>{b.phone}</strong></p>
                        {b.specialRequests && <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--gold)' }}>Notes: {b.specialRequests}</p>}
                        
                        {b.status === 'Rejected' && b.rejection_message && (
                          <div style={{ 
                            marginTop: '0.8rem', 
                            padding: '0.6rem 0.8rem', 
                            background: 'rgba(224, 122, 95, 0.05)', 
                            borderLeft: '2.5px solid #e07a5f',
                            fontSize: '0.78rem',
                            color: 'rgba(250, 248, 243, 0.8)'
                          }}>
                            <strong style={{ color: '#e07a5f', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Staff Re-reservation Suggestion:</strong>
                            "{b.rejection_message}"
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem', width: '100%' }}>
                      {b.status === 'Rejected' ? (
                        <button 
                          className="btn-primary"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.68rem', flex: 1 }}
                          onClick={() => {
                            setBookingFormData({
                              firstName: b.firstName,
                              lastName: b.lastName || '',
                              service: b.service,
                              date: b.date,
                              time: b.time,
                              phone: b.phone,
                              specialRequests: `Reschedule of #${b.id}: ` + (b.specialRequests || '')
                            })
                            handleScrollToSection('booking')
                          }}
                        >
                          Reschedule / Book Again
                        </button>
                      ) : null}
                      <button 
                        className="btn-ghost" 
                        style={{ 
                          borderColor: '#e07a5f', 
                          color: '#e07a5f', 
                          padding: '0.5rem 1rem', 
                          fontSize: '0.68rem',
                          flex: b.status === 'Rejected' ? 1 : 'none'
                        }}
                        onClick={() => deleteBooking(b.id)}
                      >
                        Cancel Reservation
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
          
          <button 
            className="btn-primary" 
            style={{ marginTop: '2rem' }}
            onClick={() => handleScrollToSection('services')}
          >
            Explore More Offerings
          </button>
        </section>
      ) : (
        /* HOMEPAGE VIEW */
        <main className="view-container">
          
          {/* HERO */}
          <section className="hero">
            <div style={{ animation: 'fadeIn 1s ease' }}>
              <span className="hero-ornament">City of Lakes · Udaipur, Rajasthan</span>
              <h1>Where <em>Heritage</em><br />Meets Ritual</h1>
              <p className="hero-sub">Luxury spa sanctuaries, heritage salon artistry, and elite bridal ceremonies — curated for the discerning.</p>
              <div className="hero-actions">
                <button className="btn-primary" onClick={() => handleScrollToSection('booking')}>Book an Experience</button>
                <button className="btn-ghost" onClick={() => handleScrollToSection('services')}>Explore Offerings</button>
              </div>
              
              {bookings.length > 0 && (
                <button 
                  className="btn-outline" 
                  style={{ marginTop: '2.5rem', display: 'inline-block' }}
                  onClick={() => setActiveTab('bookings')}
                >
                  View My {bookings.length} Reservation{bookings.length > 1 ? 's' : ''} →
                </button>
              )}
            </div>
          </section>

          {/* SERVICES / RITUALS */}
          <section className="services" id="services">
            <div className="services-header">
              <span className="section-eyebrow">Our Sanctuaries</span>
              <h2>Crafted for <em>Royalty</em><br />in Every Ritual</h2>
              <p>Rooted in centuries of Rajasthani beauty traditions, elevated with the finest global techniques and ingredients.</p>
            </div>

            <div className="services-grid">
              <div className="service-card" onClick={() => setActiveModalService('spa')}>
                <div style={{ height: '180px', margin: '-3.5rem -3rem 2rem -3rem', overflow: 'hidden', borderBottom: '0.5px solid var(--border-soft)' }}>
                  <img src="/images/spa_retreat.png" alt="Royal Spa Retreats" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="service-img-zoom" />
                </div>
                <span className="service-icon">✦</span>
                <h3>Royal Spa Retreats</h3>
                <p>Ancient Panchakarma detox, warm kesar-milk body wraps, and chakra-balancing massages in palace-inspired suites.</p>
                <div className="service-from">From</div>
                <div className="service-price">₹ 8,500</div>
                <a className="service-link" href="#" onClick={(e) => e.preventDefault()}>Discover packages</a>
              </div>

              <div className="service-card" onClick={() => setActiveModalService('salon')}>
                <div style={{ height: '180px', margin: '-3.5rem -3rem 2rem -3rem', overflow: 'hidden', borderBottom: '0.5px solid var(--border-soft)' }}>
                  <img src="/images/hair_styling.png" alt="Heritage Salon" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="service-img-zoom" />
                </div>
                <span className="service-icon">◈</span>
                <h3>Heritage Salon</h3>
                <p>Master artisans trained in Mughal and Rajput beauty secrets — intricate mehndi, kumkum rituals, and couture styling.</p>
                <div className="service-from">From</div>
                <div className="service-price">₹ 3,200</div>
                <a className="service-link" href="#" onClick={(e) => e.preventDefault()}>Book a session</a>
              </div>

              <div className="service-card" onClick={() => setActiveModalService('bridal')}>
                <div style={{ height: '180px', margin: '-3.5rem -3rem 2rem -3rem', overflow: 'hidden', borderBottom: '0.5px solid var(--border-soft)' }}>
                  <img src="/images/bridal_makeup.png" alt="Elite Bridal Grooming" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="service-img-zoom" />
                </div>
                <span className="service-icon">❖</span>
                <h3>Elite Bridal Grooming</h3>
                <p>Personalised bridal trousseau spanning skin luminosity programs, bridal lehenga draping, and complete day-of artistry.</p>
                <div className="service-from">From</div>
                <div className="service-price">₹ 45,000</div>
                <a className="service-link" href="#" onClick={(e) => e.preventDefault()}>Inquire now</a>
              </div>

              <div className="service-card" onClick={() => setActiveModalService('wellness')}>
                <div style={{ height: '180px', margin: '-3.5rem -3rem 2rem -3rem', overflow: 'hidden', borderBottom: '0.5px solid var(--border-soft)' }}>
                  <img src="/images/body_scrub.png" alt="Wellness Alchemy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="service-img-zoom" />
                </div>
                <span className="service-icon">⊕</span>
                <h3>Wellness Alchemy</h3>
                <p>Holistic Ayurvedic consultations, herbal steam therapy, and curated nutrition journeys led by certified practitioners.</p>
                <div className="service-from">From</div>
                <div className="service-price">₹ 5,500</div>
                <a className="service-link" href="#" onClick={(e) => e.preventDefault()}>View therapies</a>
              </div>

              <div className="service-card" onClick={() => setActiveModalService('facial')}>
                <div style={{ height: '180px', margin: '-3.5rem -3rem 2rem -3rem', overflow: 'hidden', borderBottom: '0.5px solid var(--border-soft)' }}>
                  <img src="/images/gold_dust.png" alt="Luminosity Facials" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="service-img-zoom" />
                </div>
                <span className="service-icon">◇</span>
                <h3>Luminosity Facials</h3>
                <p>24K gold infusions, rose quartz gua sha, and Rajasthani saffron elixirs for skin that reflects the golden light of Pichola.</p>
                <div className="service-from">From</div>
                <div className="service-price">₹ 6,800</div>
                <a className="service-link" href="#" onClick={(e) => e.preventDefault()}>Browse treatments</a>
              </div>

              <div className="service-card" onClick={() => setActiveModalService('nail')}>
                <div style={{ height: '180px', margin: '-3.5rem -3rem 2rem -3rem', overflow: 'hidden', borderBottom: '0.5px solid var(--border-soft)' }}>
                  <img src="/images/nail_art.png" alt="Haute Nail Atelier" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="service-img-zoom" />
                </div>
                <span className="service-icon">❋</span>
                <h3>Haute Nail Atelier</h3>
                <p>Bespoke nail artistry drawing from jharokha lattices, mirror-work embroidery, and palace fresco motifs.</p>
                <div className="service-from">From</div>
                <div className="service-price">₹ 2,400</div>
                <a className="service-link" href="#" onClick={(e) => e.preventDefault()}>Reserve a chair</a>
              </div>
            </div>
          </section>

          {/* SIGNATURE EXPERIENCE BANNER */}
          <section className="featured-banner">
            <div style={{ position: 'relative' }}>
              <span className="section-eyebrow">Signature Experience</span>
              <h2>The Maharani <em>Day Journey</em></h2>
              <p>A full-day immersion across eight curated rituals — from sunrise abhyanga to moonlit hair mask ceremonies. Our most beloved offering.</p>
              <div className="package-highlights">
                <div className="pkg-item"><strong>8</strong><span>Rituals</span></div>
                <div className="pkg-item"><strong>6</strong><span>Hours</span></div>
                <div className="pkg-item"><strong>3</strong><span>Therapists</span></div>
                <div className="pkg-item"><strong>₹ 24,000</strong><span>Per person</span></div>
              </div>
              <button className="btn-primary" onClick={() => handleScrollToSection('booking')}>Reserve the Journey</button>
            </div>
          </section>

          {/* BRIDAL SECTION */}
          <section className="bridal" id="bridal">
            <div className="divider"><div className="divider-diamond"></div></div>
            <div className="bridal-inner">
              <div className="bridal-text">
                <span className="section-eyebrow">Elite Bridal Grooming</span>
                <h2>Your Most <em>Luminous</em><br />Moment, Prepared</h2>
                <p>Udaipur's lake palaces have witnessed a thousand royal unions. We carry that legacy forward — composing bridal transformations that honour tradition while embracing contemporary artistry.</p>
                <ul className="bridal-features">
                  <li>Pre-bridal skin luminosity program (30-day)</li>
                  <li>Bespoke mehndi design with family motifs</li>
                  <li>Bridal makeup & couture hair architecture</li>
                  <li>Full bridal party preparation services</li>
                  <li>On-location setup at your haveli or resort</li>
                  <li>Post-wedding recovery & skin restoration</li>
                </ul>
                <button className="btn-primary" onClick={() => handleScrollToSection('booking')}>Begin Bridal Consultation</button>
              </div>
              <div className="bridal-visual">
                <span className="bridal-monogram">ℬ</span>
                <p className="bridal-tag">Bridal Collections 2026–27</p>
                <div className="bridal-packages">
                  <div className="pkg-pill" onClick={() => {
                    setBookingFormData(prev => ({ ...prev, service: 'Elite Bridal Grooming', specialRequests: 'Selected: The Pichola Bride Package' }))
                    handleScrollToSection('booking')
                  }}>
                    <span>The Pichola Bride</span>
                    <em>₹ 45,000</em>
                  </div>
                  <div className="pkg-pill" onClick={() => {
                    setBookingFormData(prev => ({ ...prev, service: 'Elite Bridal Grooming', specialRequests: 'Selected: The Monsoon Radiance Package' }))
                    handleScrollToSection('booking')
                  }}>
                    <span>The Monsoon Radiance</span>
                    <em>₹ 72,000</em>
                  </div>
                  <div className="pkg-pill" onClick={() => {
                    setBookingFormData(prev => ({ ...prev, service: 'Elite Bridal Grooming', specialRequests: 'Selected: The Palace Ceremony Package' }))
                    handleScrollToSection('booking')
                  }}>
                    <span>The Palace Ceremony</span>
                    <em>₹ 1,10,000</em>
                  </div>
                  <div className="pkg-pill" onClick={() => {
                    setBookingFormData(prev => ({ ...prev, service: 'Elite Bridal Grooming', specialRequests: 'Selected: Bespoke Trousseau Consultation' }))
                    handleScrollToSection('booking')
                  }}>
                    <span>Full Royal Trousseau</span>
                    <em>Bespoke</em>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* BOOKING RESERVATION FORM */}
          <section className="booking-section" id="booking">
            <div className="booking-inner">
              <div className="booking-header">
                <span className="section-eyebrow">Reserve Your Visit</span>
                <h2>Book an <em>Experience</em></h2>
                <p>Our concierge will confirm your appointment within 2 hours and curate a personalised pre-visit ritual guide.</p>
              </div>
              
              <form className="booking-form" onSubmit={submitBooking}>
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    name="firstName" 
                    placeholder="Priya" 
                    value={bookingFormData.firstName} 
                    onChange={handleBookingChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    name="lastName" 
                    placeholder="Rathore" 
                    value={bookingFormData.lastName} 
                    onChange={handleBookingChange} 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="service">Service Category</label>
                  <select 
                    id="service" 
                    name="service" 
                    value={bookingFormData.service} 
                    onChange={handleBookingChange}
                  >
                    <option value="Royal Spa Retreats">Royal Spa Retreat</option>
                    <option value="Heritage Salon">Heritage Salon</option>
                    <option value="Elite Bridal Grooming">Bridal Grooming</option>
                    <option value="Wellness Alchemy">Wellness Alchemy</option>
                    <option value="Luminosity Facials">Luminosity Facial</option>
                    <option value="Haute Nail Atelier">Nail Atelier</option>
                    <option value="Maharani Day Journey">Maharani Day Journey</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="date">Preferred Date</label>
                  <input 
                    type="date" 
                    id="date" 
                    name="date" 
                    value={bookingFormData.date} 
                    onChange={handleBookingChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="time">Preferred Time</label>
                  <select 
                    id="time" 
                    name="time" 
                    value={bookingFormData.time} 
                    onChange={handleBookingChange}
                  >
                    <option>Morning — 9:00 am</option>
                    <option>Morning — 10:30 am</option>
                    <option>Noon — 12:00 pm</option>
                    <option>Afternoon — 2:00 pm</option>
                    <option>Afternoon — 3:30 pm</option>
                    <option>Evening — 5:00 pm</option>
                    <option>Evening — 6:30 pm</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Mobile Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    placeholder="+91 98XXX XXXXX" 
                    value={bookingFormData.phone} 
                    onChange={handleBookingChange} 
                    required 
                  />
                </div>
                <div className="form-group full">
                  <label htmlFor="specialRequests">Special Requests or Occasion</label>
                  <input 
                    type="text" 
                    id="specialRequests" 
                    name="specialRequests" 
                    placeholder="Anniversary, bridal, first visit, medical notes..." 
                    value={bookingFormData.specialRequests} 
                    onChange={handleBookingChange} 
                  />
                </div>
                <div className="form-submit">
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    style={{ width: '100%', padding: '1.1rem', background: bookingStatus ? 'var(--success)' : '' }}
                    disabled={bookingStatus === 'success'}
                  >
                    {bookingStatus === 'success' ? '✦ Reservation Confirmed' : !user ? 'Sign In to Reserve' : 'Confirm Reservation'}
                  </button>
                  {bookingStatus === 'success' && (
                    <div style={{ marginTop: '1rem', animation: 'fadeIn 0.3s', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <p style={{ color: 'var(--success)', fontSize: '0.82rem', fontWeight: 500 }}>
                        Thank you! Your royal wellness suite has been pre-scheduled.
                      </p>
                      <button 
                        type="button" 
                        className="btn-outline" 
                        style={{ padding: '0.4rem 1rem', fontSize: '0.65rem' }} 
                        onClick={() => setActiveTab('bookings')}
                      >
                        View My Reservation Ledger
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </section>

          {/* THERAPISTS / MASTER ARTISANS */}
          <section className="therapists">
            <div className="therapists-header">
              <span className="section-eyebrow">Our Masters</span>
              <h2>The <em>Artisans</em> Behind Every Ritual</h2>
            </div>
            <div className="therapists-grid">
              <div className="therapist-card">
                <div className="therapist-avatar">R</div>
                <div className="therapist-name">Rekha Sharma</div>
                <div className="therapist-role">Ayurvedic Therapist</div>
                <div className="therapist-exp">18 years of practice</div>
              </div>
              <div className="therapist-card">
                <div className="therapist-avatar">V</div>
                <div className="therapist-name">Vandana Sisodia</div>
                <div className="therapist-role">Bridal Makeup Artist</div>
                <div className="therapist-exp">Trained in Paris & Mumbai</div>
              </div>
              <div className="therapist-card">
                <div className="therapist-avatar">A</div>
                <div className="therapist-name">Arjun Mehta</div>
                <div className="therapist-role">Master Hair Stylist</div>
                <div className="therapist-exp">Former — Taj Lake Palace</div>
              </div>
              <div className="therapist-card">
                <div className="therapist-avatar">P</div>
                <div className="therapist-name">Pushpa Rathore</div>
                <div className="therapist-role">Mehndi & Skin Ritualist</div>
                <div className="therapist-exp">5th generation artisan</div>
              </div>
            </div>
          </section>

          {/* TESTIMONIALS CAROUSEL */}
          <section className="testimonials">
            <span className="section-eyebrow">Guest Chronicles</span>
            <div className="testi-container">
              <p className="testi-quote" key={`quote-${activeTesti}`}>{testimonials[activeTesti].text}</p>
              <p className="testi-author" key={`auth-${activeTesti}`}>{testimonials[activeTesti].author}</p>
            </div>
            <div className="testi-dots">
              {testimonials.map((_, i) => (
                <div 
                  key={i} 
                  className={`testi-dot ${activeTesti === i ? 'active' : ''}`} 
                  onClick={() => setActiveTesti(i)}
                ></div>
              ))}
            </div>
          </section>

          {/* ROYAL BOUTIQUE MARKETPLACE */}
          <section className="marketplace" id="marketplace">
            <div className="divider"><div className="divider-diamond"></div></div>
            <div className="marketplace-header">
              <span className="section-eyebrow">Royal Boutique</span>
              <h2>Bring the <em>Ritual</em> Home</h2>
            </div>
            <div className="products-grid">
              {boutiqueProducts.map((p) => (
                <div className="product-card" key={p.id}>
                  <div className="product-img">
                    {p.img && p.img.startsWith('/images/') ? (
                      <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      p.img
                    )}
                    {p.badge && <div className="product-badge">{p.badge}</div>}
                  </div>
                  <div className="product-info">
                    <div className="product-brand">{p.brand}</div>
                    <h3 className="product-name">{p.name}</h3>
                    <div className="product-price-row">
                      <span className="product-price">₹ {p.price.toLocaleString('en-IN')}</span>
                      <button className="product-add" onClick={() => addToCart(p)}>Add →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>
      )}

      {/* RITUAL EXPLORER MODALS (BOTTOM SHEETS ON MOBILE) */}
      {activeModalService && (
        <div className="modal-overlay open" onClick={(e) => {
          if (e.target.classList.contains('modal-overlay')) setActiveModalService(null)
        }}>
          <div className="modal">
            <button className="modal-close" onClick={() => setActiveModalService(null)}>×</button>
            <h3>{services[activeModalService].title}</h3>
            <p>{services[activeModalService].desc}</p>
            <div className="modal-price">{services[activeModalService].price}</div>
            
            <ul className="modal-includes">
              {services[activeModalService].includes.map((inc, index) => (
                <li key={index}>{inc}</li>
              ))}
            </ul>
            
            <button 
              className="btn-primary" 
              style={{ width: '100%' }} 
              onClick={() => {
                setActiveModalService(null)
                setBookingFormData(prev => ({ ...prev, service: services[activeModalService].title }))
                if (!user) {
                  setAuthOpen(true)
                } else {
                  handleScrollToSection('booking')
                }
              }}
            >
              {!user ? 'Sign In to Reserve' : 'Reserve This Experience'}
            </button>
          </div>
        </div>
      )}

      {/* SHOPPING CART OVERLAY */}
      <BoutiqueCart />

      {/* AI WELLNESS ADVISOR FLOATING INTERACTION */}
      <AIAdvisor />

      {/* CHAT CONCIERGE FLOATING INTERACTION */}
      <button className="chat-concierge-btn" onClick={() => setChatOpen(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        Chat Concierge
      </button>
      <ChatDrawer isOpen={isChatOpen} onClose={() => setChatOpen(false)} />

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#" className="nav-logo" onClick={() => handleScrollToSection('services')} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <img src="/images/kesari_atelier_logo.png" alt="Kesari Atelier Logo" style={{ height: '28px', width: 'auto', borderRadius: '4px' }} />
              Kesari <span>Atelier</span>
            </a>
            <p>A sanctuary of heritage beauty and conscious wellness, nestled in the City of Lakes. Serving Udaipur's most discerning guests since 2009.</p>
          </div>
          <div className="footer-col">
            <h4>Experiences</h4>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleScrollToSection('services'); }}>Royal Spa Retreats</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleScrollToSection('services'); }}>Heritage Salon</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleScrollToSection('services'); }}>Bridal Grooming</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleScrollToSection('services'); }}>Wellness Alchemy</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleScrollToSection('services'); }}>Nail Atelier</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Bookings</h4>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleScrollToSection('booking'); }}>Book Appointment</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('bookings'); }}>Active Reservation Ledger</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleScrollToSection('services'); }}>Resort Locations</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <ul>
              <li><a href="tel:+919414100000" onClick={(e) => e.stopPropagation()}>+91 94141 00000</a></li>
              <li><a href="mailto:hello@kesariatelier.in">hello@kesariatelier.in</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Instagram</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>WhatsApp Consult</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Kesari Atelier. All rights reserved.</p>
          <div className="footer-badge">Est. 2009 · Udaipur</div>
        </div>
      </footer>
    </>
  )
}
