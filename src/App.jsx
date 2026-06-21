import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from './context/AppContext'
import Navigation from './components/Navigation'
import BoutiqueCart from './components/BoutiqueCart'
import AIAdvisor from './components/AIAdvisor'
import ChatDrawer from './components/ChatDrawer'
import AdminDashboard from './components/AdminDashboard'

// ─── Mobile screen detection ───────────────────────────────────────────────
const isMobileDevice = () => window.innerWidth <= 768

// ─── Mobile-only screens ────────────────────────────────────────────────────

function MobileHomeScreen({ onNavigate, bookings, setActiveTab }) {
  return (
    <div className="mobile-screen" style={{ animation: 'fadeIn 0.3s' }}>
      {/* Hero strip */}
      <div className="mobile-hero">
        <span className="hero-ornament" style={{ fontSize: '0.55rem' }}>City of Lakes · Udaipur, Rajasthan</span>
        <h1 style={{ fontSize: 'clamp(2.4rem, 10vw, 3.2rem)', lineHeight: 1.08 }}>Where <em>Heritage</em><br />Meets Ritual</h1>
        <p style={{ fontSize: '0.78rem', color: 'var(--charcoal-soft)', letterSpacing: '0.08em', marginTop: '0.8rem', lineHeight: 1.7 }}>
          Luxury spa sanctuaries, heritage artistry & elite bridal ceremonies.
        </p>
        <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <button className="btn-primary" style={{ flex: 1, padding: '0.9rem 1rem', fontSize: '0.68rem' }} onClick={() => onNavigate('book')}>Book an Experience</button>
          <button className="btn-ghost" style={{ flex: 1, padding: '0.9rem 1rem', fontSize: '0.68rem' }} onClick={() => onNavigate('rituals')}>Explore Offerings</button>
        </div>
        {bookings.length > 0 && (
          <button className="btn-outline" style={{ marginTop: '1rem', width: '100%', padding: '0.7rem', fontSize: '0.65rem' }} onClick={() => setActiveTab('bookings')}>
            View My {bookings.length} Reservation{bookings.length > 1 ? 's' : ''} →
          </button>
        )}
      </div>

      {/* Quick access cards */}
      <div style={{ padding: '0 1.2rem 1.5rem' }}>
        <p style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>Quick Access</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
          {[
            { icon: '✦', label: 'Royal Spa', sub: 'From ₹8,500', tab: 'rituals' },
            { icon: '◈', label: 'Heritage Salon', sub: 'From ₹3,200', tab: 'rituals' },
            { icon: '❖', label: 'Bridal', sub: 'From ₹45,000', tab: 'bridal' },
            { icon: '◇', label: 'Boutique', sub: '4 Products', tab: 'boutique' },
          ].map(card => (
            <button key={card.tab + card.label} onClick={() => onNavigate(card.tab)} style={{
              background: 'var(--white)', border: '0.5px solid var(--border-gold)',
              padding: '1.2rem 1rem', textAlign: 'left', cursor: 'pointer',
              transition: 'all 0.2s', borderRadius: '0'
            }}>
              <div style={{ fontSize: '1.2rem', color: 'var(--gold)', marginBottom: '0.5rem' }}>{card.icon}</div>
              <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1rem', color: 'var(--charcoal)' }}>{card.label}</div>
              <div style={{ fontSize: '0.62rem', color: 'var(--charcoal-soft)', marginTop: '0.2rem', letterSpacing: '0.05em' }}>{card.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Testimonial strip */}
      <div style={{ background: 'var(--charcoal)', padding: '2rem 1.5rem', margin: '0', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.05rem', color: 'var(--ivory)', fontStyle: 'italic', lineHeight: 1.6 }}>
          "Udaipur Royal Wellness is the only place where tradition and luxury feel completely at home together."
        </p>
        <p style={{ fontSize: '0.62rem', color: 'rgba(250,248,243,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '1rem' }}>— Kavita Menon, Mumbai</p>
      </div>

      {/* Signature Banner */}
      <div style={{ background: 'var(--cream)', padding: '2rem 1.5rem', borderTop: '0.5px solid var(--border-gold)', borderBottom: '0.5px solid var(--border-gold)' }}>
        <span className="section-eyebrow" style={{ fontSize: '0.58rem' }}>Signature Experience</span>
        <h2 style={{ fontSize: '1.8rem', margin: '0.5rem 0 0.8rem' }}>The Maharani <em>Day Journey</em></h2>
        <div style={{ display: 'flex', gap: '1.5rem', margin: '1rem 0 1.5rem', flexWrap: 'wrap' }}>
          {[['8', 'Rituals'], ['6', 'Hours'], ['3', 'Therapists'], ['₹24K', 'Per person']].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <strong style={{ display: 'block', fontFamily: 'Cormorant Garamond', fontSize: '1.6rem', color: 'var(--gold)' }}>{v}</strong>
              <span style={{ fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--charcoal-soft)' }}>{l}</span>
            </div>
          ))}
        </div>
        <button className="btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '0.68rem' }} onClick={() => onNavigate('book')}>Reserve the Journey</button>
      </div>

      {/* Master Artisans */}
      <div style={{ padding: '2rem 1.5rem' }}>
        <span className="section-eyebrow" style={{ fontSize: '0.58rem' }}>Our Masters</span>
        <h2 style={{ fontSize: '1.7rem', margin: '0.5rem 0 1.5rem' }}>The <em>Artisans</em></h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
          {[
            { init: 'R', name: 'Rekha Sharma', role: 'Ayurvedic Therapist' },
            { init: 'V', name: 'Vandana Sisodia', role: 'Bridal Makeup Artist' },
            { init: 'A', name: 'Arjun Mehta', role: 'Master Hair Stylist' },
            { init: 'P', name: 'Pushpa Rathore', role: 'Mehndi Ritualist' },
          ].map(a => (
            <div key={a.name} style={{ background: 'var(--white)', border: '0.5px solid var(--border-soft)', padding: '1.2rem 1rem', textAlign: 'center' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--cream)', border: '0.5px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.7rem', fontFamily: 'Cormorant Garamond', fontSize: '1.3rem', fontStyle: 'italic', color: 'var(--gold)' }}>{a.init}</div>
              <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '0.95rem', color: 'var(--charcoal)' }}>{a.name}</div>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--charcoal-soft)', marginTop: '0.2rem' }}>{a.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer strip */}
      <div style={{ background: 'var(--charcoal)', padding: '2rem 1.5rem', borderTop: '0.5px solid var(--border-gold)' }}>
        <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.4rem', color: 'var(--ivory)', marginBottom: '0.5rem' }}>Kesari <span style={{ color: 'var(--gold)' }}>Atelier</span></div>
        <p style={{ fontSize: '0.75rem', color: 'rgba(250,248,243,0.5)', lineHeight: 1.7, marginBottom: '1.2rem' }}>A sanctuary of heritage beauty and conscious wellness in the City of Lakes. Est. 2009.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <a href="tel:+919414100000" style={{ fontSize: '0.75rem', color: 'var(--gold)', textDecoration: 'none' }}>+91 94141 00000</a>
          <a href="mailto:hello@kesariatelier.in" style={{ fontSize: '0.75rem', color: 'rgba(250,248,243,0.5)', textDecoration: 'none' }}>hello@kesariatelier.in</a>
        </div>
        <p style={{ fontSize: '0.62rem', color: 'rgba(250,248,243,0.25)', marginTop: '1.5rem' }}>© 2026 Kesari Atelier. All rights reserved.</p>
      </div>
    </div>
  )
}

function MobileRitualsScreen({ services, onSelectService }) {
  return (
    <div className="mobile-screen" style={{ animation: 'fadeIn 0.3s' }}>
      <div style={{ padding: '1.5rem 1.2rem 1rem' }}>
        <span className="section-eyebrow" style={{ fontSize: '0.58rem' }}>Our Sanctuaries</span>
        <h2 style={{ fontSize: '1.8rem', marginTop: '0.4rem' }}>Crafted for <em>Royalty</em></h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {Object.entries(services).map(([key, svc]) => (
          <button key={key} onClick={() => onSelectService(key)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1.4rem 1.2rem', background: 'var(--white)',
            borderBottom: '0.5px solid var(--border-soft)', border: 'none',
            cursor: 'pointer', textAlign: 'left', width: '100%',
            transition: 'background 0.2s'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.2rem', color: 'var(--charcoal)', marginBottom: '0.2rem' }}>{svc.title}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--charcoal-soft)', lineHeight: 1.5 }}>{svc.desc.slice(0, 70)}…</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--gold)', marginTop: '0.4rem', fontWeight: 500 }}>{svc.price}</div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginLeft: '1rem' }}>
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}

function MobileBridalScreen({ onBook }) {
  return (
    <div className="mobile-screen" style={{ animation: 'fadeIn 0.3s' }}>
      <div style={{ background: 'var(--cream)', padding: '2rem 1.5rem', borderBottom: '0.5px solid var(--border-gold)', textAlign: 'center' }}>
        <span className="section-eyebrow" style={{ fontSize: '0.58rem' }}>Elite Bridal Grooming</span>
        <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '6rem', color: 'var(--gold-light)', lineHeight: 1, fontStyle: 'italic', margin: '0.5rem 0' }}>ℬ</div>
        <h2 style={{ fontSize: '1.8rem', lineHeight: 1.15 }}>Your Most <em>Luminous</em> Moment</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--charcoal-soft)', lineHeight: 1.8, marginTop: '0.8rem' }}>
          Udaipur's lake palaces have witnessed a thousand royal unions. We carry that legacy forward.
        </p>
      </div>

      <div style={{ padding: '1.5rem 1.2rem' }}>
        <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>What's included</p>
        {['Pre-bridal skin luminosity program (30-day)', 'Bespoke mehndi design with family motifs', 'Bridal makeup & couture hair architecture', 'Full bridal party preparation services', 'On-location setup at your haveli or resort', 'Post-wedding recovery & skin restoration'].map(f => (
          <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', padding: '0.7rem 0', borderBottom: '0.5px solid var(--border-soft)' }}>
            <span style={{ color: 'var(--gold)', fontSize: '0.45rem', marginTop: '0.4rem', flexShrink: 0 }}>◆</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--charcoal-mid)', lineHeight: 1.5 }}>{f}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: '0 1.2rem 1.5rem' }}>
        <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>Bridal Collections 2026–27</p>
        {[
          { name: 'The Pichola Bride', price: '₹ 45,000', service: 'Elite Bridal Grooming', note: 'Selected: The Pichola Bride Package' },
          { name: 'The Monsoon Radiance', price: '₹ 72,000', service: 'Elite Bridal Grooming', note: 'Selected: The Monsoon Radiance Package' },
          { name: 'The Palace Ceremony', price: '₹ 1,10,000', service: 'Elite Bridal Grooming', note: 'Selected: The Palace Ceremony Package' },
          { name: 'Full Royal Trousseau', price: 'Bespoke', service: 'Elite Bridal Grooming', note: 'Selected: Bespoke Trousseau Consultation' },
        ].map(pkg => (
          <button key={pkg.name} onClick={() => onBook(pkg.service, pkg.note)} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            width: '100%', padding: '1rem 1.2rem', marginBottom: '0.6rem',
            border: '0.5px solid var(--border-gold)', background: 'var(--white)',
            cursor: 'pointer', transition: 'all 0.2s'
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--charcoal)', letterSpacing: '0.04em' }}>{pkg.name}</span>
            <span style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.1rem', color: 'var(--gold)' }}>{pkg.price}</span>
          </button>
        ))}

        <button className="btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '0.5rem', fontSize: '0.72rem' }} onClick={() => onBook('Elite Bridal Grooming', '')}>
          Begin Bridal Consultation
        </button>
      </div>
    </div>
  )
}

function MobileBookScreen({ bookingFormData, setBookingFormData, submitBooking, bookingStatus, user, setAuthOpen }) {
  return (
    <div className="mobile-screen" style={{ animation: 'fadeIn 0.3s' }}>
      <div style={{ padding: '1.5rem 1.2rem 1rem' }}>
        <span className="section-eyebrow" style={{ fontSize: '0.58rem' }}>Reserve Your Visit</span>
        <h2 style={{ fontSize: '1.8rem', marginTop: '0.4rem' }}>Book an <em>Experience</em></h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--charcoal-soft)', lineHeight: 1.7, marginTop: '0.5rem' }}>
          Our concierge confirms within 2 hours and curates a personalised pre-visit ritual guide.
        </p>
      </div>

      <form onSubmit={submitBooking} style={{ padding: '0 1.2rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
          <div className="form-group">
            <label htmlFor="m-firstName">First Name</label>
            <input type="text" id="m-firstName" name="firstName" placeholder="Priya" value={bookingFormData.firstName} onChange={e => setBookingFormData(p => ({ ...p, firstName: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label htmlFor="m-lastName">Last Name</label>
            <input type="text" id="m-lastName" name="lastName" placeholder="Rathore" value={bookingFormData.lastName} onChange={e => setBookingFormData(p => ({ ...p, lastName: e.target.value }))} />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="m-service">Service Category</label>
          <select id="m-service" name="service" value={bookingFormData.service} onChange={e => setBookingFormData(p => ({ ...p, service: e.target.value }))}>
            <option>Royal Spa Retreats</option>
            <option>Heritage Salon</option>
            <option>Elite Bridal Grooming</option>
            <option>Wellness Alchemy</option>
            <option>Luminosity Facials</option>
            <option>Haute Nail Atelier</option>
            <option>Maharani Day Journey</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
          <div className="form-group">
            <label htmlFor="m-date">Preferred Date</label>
            <input type="date" id="m-date" name="date" value={bookingFormData.date} onChange={e => setBookingFormData(p => ({ ...p, date: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label htmlFor="m-time">Preferred Time</label>
            <select id="m-time" name="time" value={bookingFormData.time} onChange={e => setBookingFormData(p => ({ ...p, time: e.target.value }))}>
              <option>Morning — 9:00 am</option>
              <option>Morning — 10:30 am</option>
              <option>Noon — 12:00 pm</option>
              <option>Afternoon — 2:00 pm</option>
              <option>Afternoon — 3:30 pm</option>
              <option>Evening — 5:00 pm</option>
              <option>Evening — 6:30 pm</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="m-phone">Mobile Number</label>
          <input type="tel" id="m-phone" name="phone" placeholder="+91 98XXX XXXXX" value={bookingFormData.phone} onChange={e => setBookingFormData(p => ({ ...p, phone: e.target.value }))} required />
        </div>

        <div className="form-group">
          <label htmlFor="m-special">Special Requests or Occasion</label>
          <input type="text" id="m-special" name="specialRequests" placeholder="Anniversary, bridal, first visit…" value={bookingFormData.specialRequests} onChange={e => setBookingFormData(p => ({ ...p, specialRequests: e.target.value }))} />
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', background: bookingStatus ? 'var(--success)' : '' }} disabled={bookingStatus === 'success'}>
          {bookingStatus === 'success' ? '✦ Reservation Confirmed' : !user ? 'Sign In to Reserve' : 'Confirm Reservation'}
        </button>

        {bookingStatus === 'success' && (
          <p style={{ color: 'var(--success)', fontSize: '0.8rem', textAlign: 'center', animation: 'fadeIn 0.3s' }}>
            Thank you! Your royal wellness suite has been pre-scheduled.
          </p>
        )}
      </form>
    </div>
  )
}

function MobileBoutiqueScreen({ products, addToCart, setCartOpen }) {
  return (
    <div className="mobile-screen" style={{ animation: 'fadeIn 0.3s' }}>
      <div style={{ padding: '1.5rem 1.2rem 1rem' }}>
        <span className="section-eyebrow" style={{ fontSize: '0.58rem' }}>Royal Boutique</span>
        <h2 style={{ fontSize: '1.8rem', marginTop: '0.4rem' }}>Bring the <em>Ritual</em> Home</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {products.map(p => (
          <div key={p.id} style={{ display: 'flex', gap: '1rem', padding: '1.2rem', borderBottom: '0.5px solid var(--border-soft)', background: 'var(--white)', alignItems: 'center' }}>
            <div style={{ width: '80px', height: '80px', background: 'var(--cream)', border: '0.5px solid var(--border-soft)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {p.img && p.img.startsWith('/images/') ? (
                <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : p.img}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--charcoal-soft)' }}>{p.brand}</div>
              <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1rem', color: 'var(--charcoal)', lineHeight: 1.3, margin: '0.2rem 0' }}>{p.name}</div>
              {p.badge && <span style={{ fontSize: '0.55rem', padding: '0.15rem 0.5rem', background: 'var(--charcoal)', color: 'var(--gold-light)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{p.badge}</span>}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.6rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--gold)', fontWeight: 500 }}>₹ {p.price.toLocaleString('en-IN')}</span>
                <button className="product-add" style={{ fontSize: '0.62rem', padding: '0.4rem 0.9rem' }} onClick={() => { addToCart(p); setCartOpen(true) }}>Add →</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MobileAccountScreen({ user, logout, bookings, deleteBooking, setActiveTab, setAuthOpen, setBookingFormData, onNavigate }) {
  if (!user) {
    return (
      <div className="mobile-screen" style={{ animation: 'fadeIn 0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.6rem' }}>Sign <em>In</em></h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--charcoal-soft)', lineHeight: 1.7, marginBottom: '2rem' }}>Sign in to view your reservations, track orders, and access your wellness ledger.</p>
        <button className="btn-primary" style={{ width: '100%', padding: '1rem' }} onClick={() => setAuthOpen(true)}>Sign In / Create Account</button>
      </div>
    )
  }

  return (
    <div className="mobile-screen" style={{ animation: 'fadeIn 0.3s' }}>
      {/* Profile header */}
      <div style={{ background: 'var(--charcoal)', padding: '2rem 1.5rem', borderBottom: '0.5px solid var(--border-gold)', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '0.5px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond', fontSize: '1.6rem', color: 'var(--gold)', fontStyle: 'italic' }}>
          {user.name[0]}
        </div>
        <div>
          <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.3rem', color: 'var(--ivory)' }}>{user.name}</div>
          <div style={{ fontSize: '0.65rem', color: 'rgba(250,248,243,0.5)', letterSpacing: '0.08em' }}>{user.email}</div>
          {(user.isAdmin || user.isStaff) && (
            <span style={{ fontSize: '0.55rem', padding: '0.15rem 0.6rem', background: 'rgba(201,168,76,0.15)', color: 'var(--gold)', border: '0.5px solid rgba(201,168,76,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.3rem', display: 'inline-block' }}>
              {user.isAdmin ? 'Admin' : 'Staff'}
            </span>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ padding: '1.2rem', display: 'flex', gap: '0.8rem' }}>
        {(user.isAdmin || user.isStaff) && (
          <button className="btn-ghost" style={{ flex: 1, padding: '0.7rem', fontSize: '0.65rem', borderColor: 'var(--gold)', color: 'var(--gold)' }} onClick={() => setActiveTab('admin')}>
            {user.isAdmin ? 'Admin Panel' : 'Staff Panel'}
          </button>
        )}
        <button className="btn-ghost" style={{ flex: 1, padding: '0.7rem', fontSize: '0.65rem', borderColor: '#e07a5f', color: '#e07a5f' }} onClick={logout}>
          Sign Out
        </button>
      </div>

      {/* Reservations */}
      <div style={{ padding: '0 1.2rem 2rem' }}>
        <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>My Reservations</p>
        {bookings.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--white)', border: '0.5px solid var(--border-soft)' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--charcoal-soft)', fontStyle: 'italic' }}>No active bookings.</p>
            <button className="btn-primary" style={{ marginTop: '1rem', padding: '0.7rem 1.5rem', fontSize: '0.68rem' }} onClick={() => onNavigate('book')}>Book an Experience</button>
          </div>
        ) : (
          bookings.map(b => {
            const statusColor = b.status === 'Confirmed' ? '#4CAF50' : b.status === 'Rejected' ? '#e07a5f' : 'var(--gold)'
            return (
              <div key={b.id} style={{ background: 'var(--white)', border: '0.5px solid var(--border-soft)', borderLeft: `3px solid ${statusColor}`, padding: '1.2rem', marginBottom: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.1rem', color: 'var(--charcoal)', flex: 1 }}>{b.service}</div>
                  <span style={{ fontSize: '0.58rem', padding: '0.2rem 0.5rem', background: b.status === 'Confirmed' ? 'rgba(76,175,80,0.1)' : b.status === 'Rejected' ? 'rgba(224,122,95,0.1)' : 'rgba(201,168,76,0.1)', color: statusColor, border: `0.5px solid ${statusColor}`, letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    {b.status || 'Pending'}
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--charcoal-soft)', marginBottom: '0.2rem' }}>{b.date} · {b.time}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--charcoal-soft)' }}>{b.firstName} {b.lastName}</p>
                {b.status === 'Rejected' && b.rejection_message && (
                  <div style={{ marginTop: '0.6rem', padding: '0.5rem 0.7rem', background: 'rgba(224,122,95,0.05)', borderLeft: '2px solid #e07a5f', fontSize: '0.72rem', color: 'var(--charcoal-soft)' }}>
                    "{b.rejection_message}"
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.8rem' }}>
                  {b.status === 'Rejected' && (
                    <button className="btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.62rem' }} onClick={() => { setBookingFormData({ firstName: b.firstName, lastName: b.lastName || '', service: b.service, date: b.date, time: b.time, phone: b.phone, specialRequests: `Reschedule of #${b.id}: ` + (b.specialRequests || '') }); onNavigate('book') }}>
                      Reschedule
                    </button>
                  )}
                  <button style={{ flex: 1, padding: '0.5rem', fontSize: '0.62rem', border: '0.5px solid #e07a5f', color: '#e07a5f', background: 'none', cursor: 'pointer' }} onClick={() => deleteBooking(b.id)}>
                    Cancel
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const { cart, addToCart, bookings, addBooking, deleteBooking, activeTab, setActiveTab, user, setAuthOpen, setCartOpen } = useContext(AppContext)
  const [isChatOpen, setChatOpen] = useState(false)
  const [mobile, setMobile] = useState(isMobileDevice())

  useEffect(() => {
    const onResize = () => setMobile(isMobileDevice())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const services = {
    spa: { title: 'Royal Spa Retreats', desc: 'Ancient Panchakarma detox, warm kesar-milk body wraps, and chakra-balancing massages in our palace-inspired suites overlooking Lake Pichola.', price: 'From ₹ 8,500', includes: ['Signature abhyanga full-body massage (90 min)', 'Kesar milk & saffron body wrap', 'Chakra balancing crystal therapy', 'Herbal steam & cold plunge', 'Complimentary chai & mithai'] },
    salon: { title: 'Heritage Salon', desc: 'Master artisans trained in centuries of Rajputana beauty tradition — intricate mehndi, kumkum rituals, and couture styling.', price: 'From ₹ 3,200', includes: ['Traditional Rajputana mehndi (hands)', 'Herbal hair oil ritual & blow dry', 'Kumkum & kajal eye ceremony', 'Customised hair colour consultation', 'Sandalwood post-treatment care'] },
    bridal: { title: 'Elite Bridal Grooming', desc: 'Complete bridal transformation programmes spanning 30-day skin preparation to day-of artistry.', price: 'From ₹ 45,000', includes: ['30-day pre-bridal skin luminosity program', 'Full bridal makeup & hair architecture', 'Bespoke family-motif mehndi', 'Bridal party preparation (up to 6)', 'On-location setup at your venue'] },
    wellness: { title: 'Wellness Alchemy', desc: 'Holistic Ayurvedic consultations, herbal steam therapy, and curated nutrition journeys led by certified practitioners.', price: 'From ₹ 5,500', includes: ['Pulse-diagnosis Ayurvedic consultation', 'Customised herbal formulation', 'Shirodhara warm oil therapy (60 min)', 'Detox dietary plan (7-day)', 'Follow-up wellbeing check-in'] },
    facial: { title: 'Luminosity Facials', desc: '24K gold infusions, rose quartz gua sha, and Rajasthani saffron elixirs for skin that glows like the ghats at dusk.', price: 'From ₹ 6,800', includes: ['Deep-cleanse & enzyme exfoliation', '24K gold leaf infusion mask', 'Rose quartz gua sha sculpting', 'Saffron & turmeric brightening serum', 'LED light therapy finish'] },
    nail: { title: 'Haute Nail Atelier', desc: 'Bespoke nail artistry drawing from jharokha lattices, mirror-work embroidery, and palace fresco motifs.', price: 'From ₹ 2,400', includes: ['Botanical soak & cuticle ritual', 'Customised heritage nail art', 'Gel or Shellac long-wear finish', 'Paraffin hand mask treatment', 'Complimentary nail care kit'] }
  }

  const boutiqueProducts = [
    { id: 'bp1', brand: 'Kesar Naturals', name: 'Saffron & Rose Luminance Serum', price: 3200, img: '/images/saffron_serum.png', badge: 'Bestseller' },
    { id: 'bp2', brand: 'Udaipur Attar', name: 'Jasmine & Vetiver Ritual Oil', price: 1800, img: '/images/ritual_oil.png' },
    { id: 'bp3', brand: 'Royal Glow', name: '24K Gold Facial Dust', price: 5500, img: '/images/gold_dust.png', badge: 'Limited' },
    { id: 'bp4', brand: 'Aravalli Herbs', name: 'Sandalwood Ubtan Body Scrub', price: 1200, img: '/images/body_scrub.png' }
  ]

  const [activeModalService, setActiveModalService] = useState(null)

  const [bookingFormData, setBookingFormData] = useState({
    firstName: '', lastName: '', service: 'Royal Spa Retreats',
    date: '', time: 'Morning — 9:00 am', phone: '', specialRequests: ''
  })
  const [bookingStatus, setBookingStatus] = useState(null)

  const submitBooking = (e) => {
    e.preventDefault()
    if (!user) { setAuthOpen(true); return }
    if (!bookingFormData.firstName || !bookingFormData.phone || !bookingFormData.date) {
      alert('Please fill out Name, Phone, and Preferred Date.')
      return
    }
    addBooking(bookingFormData)
    setBookingStatus('success')
    setTimeout(() => {
      setBookingStatus(null)
      setBookingFormData({ firstName: '', lastName: '', service: 'Royal Spa Retreats', date: '', time: 'Morning — 9:00 am', phone: '', specialRequests: '' })
    }, 4000)
  }

  const handleMobileNavigate = (tab) => {
    setActiveTab(tab)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleScrollToSection = (id) => {
    setActiveTab('home')
    setTimeout(() => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  // ── MOBILE LAYOUT ─────────────────────────────────────────────────────────
  if (mobile) {
    return (
      <>
        <Navigation />
        <div style={{ paddingTop: '0', paddingBottom: '70px', minHeight: '100svh', background: 'var(--ivory)' }}>

          {activeTab === 'admin' && <AdminDashboard />}

          {activeTab === 'home' && (
            <MobileHomeScreen onNavigate={handleMobileNavigate} bookings={bookings} setActiveTab={setActiveTab} />
          )}

          {activeTab === 'rituals' && (
            <MobileRitualsScreen services={services} onSelectService={setActiveModalService} />
          )}

          {activeTab === 'bridal' && (
            <MobileBridalScreen onBook={(svc, note) => {
              setBookingFormData(p => ({ ...p, service: svc, specialRequests: note }))
              handleMobileNavigate('book')
            }} />
          )}

          {activeTab === 'book' && (
            <MobileBookScreen
              bookingFormData={bookingFormData}
              setBookingFormData={setBookingFormData}
              submitBooking={submitBooking}
              bookingStatus={bookingStatus}
              user={user}
              setAuthOpen={setAuthOpen}
            />
          )}

          {activeTab === 'boutique' && (
            <MobileBoutiqueScreen products={boutiqueProducts} addToCart={addToCart} setCartOpen={setCartOpen} />
          )}

          {activeTab === 'account' && (
            <MobileAccountScreen
              user={user}
              logout={() => { /* handled via context */ }}
              bookings={bookings}
              deleteBooking={deleteBooking}
              setActiveTab={setActiveTab}
              setAuthOpen={setAuthOpen}
              setBookingFormData={setBookingFormData}
              onNavigate={handleMobileNavigate}
            />
          )}

        </div>

        {/* Service detail bottom sheet */}
        {activeModalService && (
          <div className="modal-overlay open" onClick={(e) => { if (e.target.classList.contains('modal-overlay')) setActiveModalService(null) }}>
            <div className="modal">
              <button className="modal-close" onClick={() => setActiveModalService(null)}>×</button>
              <h3>{services[activeModalService].title}</h3>
              <p>{services[activeModalService].desc}</p>
              <div className="modal-price">{services[activeModalService].price}</div>
              <ul className="modal-includes">
                {services[activeModalService].includes.map((inc, i) => <li key={i}>{inc}</li>)}
              </ul>
              <button className="btn-primary" style={{ width: '100%' }} onClick={() => {
                setActiveModalService(null)
                setBookingFormData(p => ({ ...p, service: services[activeModalService].title }))
                if (!user) { setAuthOpen(true) } else { handleMobileNavigate('book') }
              }}>
                {!user ? 'Sign In to Reserve' : 'Reserve This Experience'}
              </button>
            </div>
          </div>
        )}

        <BoutiqueCart />
        <AIAdvisor />
        <button className="chat-concierge-btn" onClick={() => setChatOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          Concierge
        </button>
        <ChatDrawer isOpen={isChatOpen} onClose={() => setChatOpen(false)} />
      </>
    )
  }

  // ── DESKTOP LAYOUT (unchanged) ────────────────────────────────────────────
  const testimonials = [
    { text: '"The Maharani Day Journey was unlike anything I have experienced — each ritual felt like an act of devotion."', author: '— Nalini Agarwal, Delhi · Maharani Day Journey' },
    { text: '"Vandana made me feel like an actual queen on my wedding day. The attention to every detail was poetry in practice."', author: '— Shreya Bhatt, Ahmedabad · Elite Bridal Package' },
    { text: '"Udaipur Royal Wellness is the only place where tradition and luxury feel completely at home together."', author: '— Kavita Menon, Mumbai · Royal Spa Retreat' }
  ]
  const [activeTesti, setActiveTesti] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setActiveTesti(p => (p + 1) % testimonials.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      <Navigation />
      {activeTab === 'admin' ? (
        <AdminDashboard />
      ) : activeTab === 'bookings' ? (
        <section className="bookings-list view-container" style={{ animation: 'fadeIn 0.5s' }}>
          <span className="section-eyebrow">Your Wellness Ledger</span>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Active <em>Reservations</em></h2>
          <p style={{ color: 'var(--charcoal-soft)', fontSize: '0.85rem' }}>Here are your scheduled spa journeys and heritage beauty ceremonies.</p>
          <div className="bookings-grid">
            {bookings.length === 0 ? (
              <div className="booking-card" style={{ justifyContent: 'center', padding: '4rem 2rem', fontStyle: 'italic', color: 'var(--charcoal-soft)' }}>No active bookings found.</div>
            ) : bookings.map(b => {
              const statusColor = b.status === 'Confirmed' ? '#4CAF50' : b.status === 'Rejected' ? '#e07a5f' : 'var(--gold)'
              return (
                <div className="booking-card" key={b.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: `3px solid ${statusColor}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                    <div className="booking-card-details" style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                        <h3 style={{ margin: 0 }}>{b.service}</h3>
                        <span style={{ fontSize: '0.62rem', padding: '0.2rem 0.5rem', background: b.status === 'Confirmed' ? 'rgba(76,175,80,0.1)' : b.status === 'Rejected' ? 'rgba(224,122,95,0.1)' : 'rgba(223,179,78,0.1)', color: statusColor, border: `0.5px solid ${statusColor}`, letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 500 }}>{b.status || 'Pending'}</span>
                      </div>
                      <p>Reserved for: <strong>{b.firstName} {b.lastName}</strong></p>
                      <p>Date & Time: <strong>{b.date} at {b.time}</strong></p>
                      <p>Concierge Contact: <strong>{b.phone}</strong></p>
                      {b.specialRequests && <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--gold)' }}>Notes: {b.specialRequests}</p>}
                      {b.status === 'Rejected' && b.rejection_message && (
                        <div style={{ marginTop: '0.8rem', padding: '0.6rem 0.8rem', background: 'rgba(224,122,95,0.05)', borderLeft: '2.5px solid #e07a5f', fontSize: '0.78rem' }}>
                          <strong style={{ color: '#e07a5f', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Staff Re-reservation Suggestion:</strong>
                          "{b.rejection_message}"
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem', width: '100%' }}>
                    {b.status === 'Rejected' && (
                      <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.68rem', flex: 1 }} onClick={() => { setBookingFormData({ firstName: b.firstName, lastName: b.lastName || '', service: b.service, date: b.date, time: b.time, phone: b.phone, specialRequests: `Reschedule of #${b.id}: ` + (b.specialRequests || '') }); handleScrollToSection('booking') }}>Reschedule / Book Again</button>
                    )}
                    <button className="btn-ghost" style={{ borderColor: '#e07a5f', color: '#e07a5f', padding: '0.5rem 1rem', fontSize: '0.68rem', flex: b.status === 'Rejected' ? 1 : 'none' }} onClick={() => deleteBooking(b.id)}>Cancel Reservation</button>
                  </div>
                </div>
              )
            })}
          </div>
          <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={() => handleScrollToSection('services')}>Explore More Offerings</button>
        </section>
      ) : (
        <main className="view-container">
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
                <button className="btn-outline" style={{ marginTop: '2.5rem', display: 'inline-block' }} onClick={() => setActiveTab('bookings')}>
                  View My {bookings.length} Reservation{bookings.length > 1 ? 's' : ''} →
                </button>
              )}
            </div>
          </section>

          <section className="services" id="services">
            <div className="services-header">
              <span className="section-eyebrow">Our Sanctuaries</span>
              <h2>Crafted for <em>Royalty</em><br />in Every Ritual</h2>
              <p>Rooted in centuries of Rajasthani beauty traditions, elevated with the finest global techniques and ingredients.</p>
            </div>
            <div className="services-grid">
              {Object.entries(services).map(([key, svc]) => (
                <div className="service-card" key={key} onClick={() => setActiveModalService(key)}>
                  <span className="service-icon">✦</span>
                  <h3>{svc.title}</h3>
                  <p>{svc.desc}</p>
                  <div className="service-from">From</div>
                  <div className="service-price">{svc.price.replace('From ', '')}</div>
                  <a className="service-link" href="#" onClick={e => e.preventDefault()}>Discover packages</a>
                </div>
              ))}
            </div>
          </section>

          <section className="featured-banner">
            <div style={{ position: 'relative' }}>
              <span className="section-eyebrow">Signature Experience</span>
              <h2>The Maharani <em>Day Journey</em></h2>
              <p>A full-day immersion across eight curated rituals — from sunrise abhyanga to moonlit hair mask ceremonies.</p>
              <div className="package-highlights">
                <div className="pkg-item"><strong>8</strong><span>Rituals</span></div>
                <div className="pkg-item"><strong>6</strong><span>Hours</span></div>
                <div className="pkg-item"><strong>3</strong><span>Therapists</span></div>
                <div className="pkg-item"><strong>₹ 24,000</strong><span>Per person</span></div>
              </div>
              <button className="btn-primary" onClick={() => handleScrollToSection('booking')}>Reserve the Journey</button>
            </div>
          </section>

          <section className="bridal" id="bridal">
            <div className="divider"><div className="divider-diamond"></div></div>
            <div className="bridal-inner">
              <div className="bridal-text">
                <span className="section-eyebrow">Elite Bridal Grooming</span>
                <h2>Your Most <em>Luminous</em><br />Moment, Prepared</h2>
                <p>Udaipur's lake palaces have witnessed a thousand royal unions. We carry that legacy forward.</p>
                <ul className="bridal-features">
                  {['Pre-bridal skin luminosity program (30-day)', 'Bespoke mehndi design with family motifs', 'Bridal makeup & couture hair architecture', 'Full bridal party preparation services', 'On-location setup at your haveli or resort', 'Post-wedding recovery & skin restoration'].map(f => <li key={f}>{f}</li>)}
                </ul>
                <button className="btn-primary" onClick={() => handleScrollToSection('booking')}>Begin Bridal Consultation</button>
              </div>
              <div className="bridal-visual">
                <span className="bridal-monogram">ℬ</span>
                <p className="bridal-tag">Bridal Collections 2026–27</p>
                <div className="bridal-packages">
                  {[['The Pichola Bride', '₹ 45,000'], ['The Monsoon Radiance', '₹ 72,000'], ['The Palace Ceremony', '₹ 1,10,000'], ['Full Royal Trousseau', 'Bespoke']].map(([n, p]) => (
                    <div key={n} className="pkg-pill" onClick={() => { setBookingFormData(prev => ({ ...prev, service: 'Elite Bridal Grooming', specialRequests: `Selected: ${n}` })); handleScrollToSection('booking') }}>
                      <span>{n}</span><em>{p}</em>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="booking-section" id="booking">
            <div className="booking-inner">
              <div className="booking-header">
                <span className="section-eyebrow">Reserve Your Visit</span>
                <h2>Book an <em>Experience</em></h2>
                <p>Our concierge will confirm your appointment within 2 hours.</p>
              </div>
              <form className="booking-form" onSubmit={submitBooking}>
                <div className="form-group"><label>First Name</label><input type="text" name="firstName" placeholder="Priya" value={bookingFormData.firstName} onChange={e => setBookingFormData(p => ({ ...p, firstName: e.target.value }))} required /></div>
                <div className="form-group"><label>Last Name</label><input type="text" name="lastName" placeholder="Rathore" value={bookingFormData.lastName} onChange={e => setBookingFormData(p => ({ ...p, lastName: e.target.value }))} /></div>
                <div className="form-group"><label>Service</label><select name="service" value={bookingFormData.service} onChange={e => setBookingFormData(p => ({ ...p, service: e.target.value }))}><option>Royal Spa Retreats</option><option>Heritage Salon</option><option>Elite Bridal Grooming</option><option>Wellness Alchemy</option><option>Luminosity Facials</option><option>Haute Nail Atelier</option><option>Maharani Day Journey</option></select></div>
                <div className="form-group"><label>Preferred Date</label><input type="date" name="date" value={bookingFormData.date} onChange={e => setBookingFormData(p => ({ ...p, date: e.target.value }))} required /></div>
                <div className="form-group"><label>Preferred Time</label><select name="time" value={bookingFormData.time} onChange={e => setBookingFormData(p => ({ ...p, time: e.target.value }))}><option>Morning — 9:00 am</option><option>Morning — 10:30 am</option><option>Noon — 12:00 pm</option><option>Afternoon — 2:00 pm</option><option>Afternoon — 3:30 pm</option><option>Evening — 5:00 pm</option><option>Evening — 6:30 pm</option></select></div>
                <div className="form-group"><label>Mobile Number</label><input type="tel" name="phone" placeholder="+91 98XXX XXXXX" value={bookingFormData.phone} onChange={e => setBookingFormData(p => ({ ...p, phone: e.target.value }))} required /></div>
                <div className="form-group full"><label>Special Requests</label><input type="text" name="specialRequests" placeholder="Anniversary, bridal, first visit…" value={bookingFormData.specialRequests} onChange={e => setBookingFormData(p => ({ ...p, specialRequests: e.target.value }))} /></div>
                <div className="form-submit">
                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1.1rem', background: bookingStatus ? 'var(--success)' : '' }} disabled={bookingStatus === 'success'}>
                    {bookingStatus === 'success' ? '✦ Reservation Confirmed' : !user ? 'Sign In to Reserve' : 'Confirm Reservation'}
                  </button>
                  {bookingStatus === 'success' && <div style={{ marginTop: '1rem', animation: 'fadeIn 0.3s' }}><p style={{ color: 'var(--success)', fontSize: '0.82rem' }}>Thank you! Your royal wellness suite has been pre-scheduled.</p><button type="button" className="btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.65rem', marginTop: '0.5rem' }} onClick={() => setActiveTab('bookings')}>View My Reservation Ledger</button></div>}
                </div>
              </form>
            </div>
          </section>

          <section className="therapists">
            <div className="therapists-header"><span className="section-eyebrow">Our Masters</span><h2>The <em>Artisans</em> Behind Every Ritual</h2></div>
            <div className="therapists-grid">
              {[{ i: 'R', n: 'Rekha Sharma', r: 'Ayurvedic Therapist', e: '18 years of practice' }, { i: 'V', n: 'Vandana Sisodia', r: 'Bridal Makeup Artist', e: 'Trained in Paris & Mumbai' }, { i: 'A', n: 'Arjun Mehta', r: 'Master Hair Stylist', e: 'Former — Taj Lake Palace' }, { i: 'P', n: 'Pushpa Rathore', r: 'Mehndi & Skin Ritualist', e: '5th generation artisan' }].map(a => (
                <div className="therapist-card" key={a.n}><div className="therapist-avatar">{a.i}</div><div className="therapist-name">{a.n}</div><div className="therapist-role">{a.r}</div><div className="therapist-exp">{a.e}</div></div>
              ))}
            </div>
          </section>

          <section className="testimonials">
            <span className="section-eyebrow">Guest Chronicles</span>
            <div className="testi-container">
              <p className="testi-quote" key={`q-${activeTesti}`}>{testimonials[activeTesti].text}</p>
              <p className="testi-author" key={`a-${activeTesti}`}>{testimonials[activeTesti].author}</p>
            </div>
            <div className="testi-dots">{testimonials.map((_, i) => <div key={i} className={`testi-dot ${activeTesti === i ? 'active' : ''}`} onClick={() => setActiveTesti(i)}></div>)}</div>
          </section>

          <section className="marketplace" id="marketplace">
            <div className="divider"><div className="divider-diamond"></div></div>
            <div className="marketplace-header"><span className="section-eyebrow">Royal Boutique</span><h2>Bring the <em>Ritual</em> Home</h2></div>
            <div className="products-grid">
              {boutiqueProducts.map(p => (
                <div className="product-card" key={p.id}>
                  <div className="product-img">{p.img && p.img.startsWith('/images/') ? <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : p.img}{p.badge && <div className="product-badge">{p.badge}</div>}</div>
                  <div className="product-info"><div className="product-brand">{p.brand}</div><h3 className="product-name">{p.name}</h3><div className="product-price-row"><span className="product-price">₹ {p.price.toLocaleString('en-IN')}</span><button className="product-add" onClick={() => addToCart(p)}>Add →</button></div></div>
                </div>
              ))}
            </div>
          </section>

          <footer>
            <div className="footer-grid">
              <div className="footer-brand">
                <a href="#" className="nav-logo" onClick={() => handleScrollToSection('services')} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <img src="/images/kesari_atelier_logo.png" alt="Kesari Atelier Logo" style={{ height: '28px', width: 'auto', borderRadius: '4px' }} />
                  Kesari <span>Atelier</span>
                </a>
                <p>A sanctuary of heritage beauty and conscious wellness, nestled in the City of Lakes. Serving Udaipur's most discerning guests since 2009.</p>
              </div>
              <div className="footer-col"><h4>Experiences</h4><ul>{['Royal Spa Retreats', 'Heritage Salon', 'Bridal Grooming', 'Wellness Alchemy', 'Nail Atelier'].map(l => <li key={l}><a href="#" onClick={e => { e.preventDefault(); handleScrollToSection('services') }}>{l}</a></li>)}</ul></div>
              <div className="footer-col"><h4>Bookings</h4><ul><li><a href="#" onClick={e => { e.preventDefault(); handleScrollToSection('booking') }}>Book Appointment</a></li><li><a href="#" onClick={e => { e.preventDefault(); setActiveTab('bookings') }}>Active Reservation Ledger</a></li></ul></div>
              <div className="footer-col"><h4>Connect</h4><ul><li><a href="tel:+919414100000">+91 94141 00000</a></li><li><a href="mailto:hello@kesariatelier.in">hello@kesariatelier.in</a></li><li><a href="#" onClick={e => e.preventDefault()}>Instagram</a></li><li><a href="#" onClick={e => e.preventDefault()}>WhatsApp Consult</a></li></ul></div>
            </div>
            <div className="footer-bottom"><p>© 2026 Kesari Atelier. All rights reserved.</p><div className="footer-badge">Est. 2009 · Udaipur</div></div>
          </footer>
        </main>
      )}

      {activeModalService && (
        <div className="modal-overlay open" onClick={e => { if (e.target.classList.contains('modal-overlay')) setActiveModalService(null) }}>
          <div className="modal">
            <button className="modal-close" onClick={() => setActiveModalService(null)}>×</button>
            <h3>{services[activeModalService].title}</h3>
            <p>{services[activeModalService].desc}</p>
            <div className="modal-price">{services[activeModalService].price}</div>
            <ul className="modal-includes">{services[activeModalService].includes.map((inc, i) => <li key={i}>{inc}</li>)}</ul>
            <button className="btn-primary" style={{ width: '100%' }} onClick={() => { setActiveModalService(null); setBookingFormData(p => ({ ...p, service: services[activeModalService].title })); if (!user) { setAuthOpen(true) } else { handleScrollToSection('booking') } }}>
              {!user ? 'Sign In to Reserve' : 'Reserve This Experience'}
            </button>
          </div>
        </div>
      )}

      <BoutiqueCart />
      <AIAdvisor />
      <button className="chat-concierge-btn" onClick={() => setChatOpen(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        Chat Concierge
      </button>
      <ChatDrawer isOpen={isChatOpen} onClose={() => setChatOpen(false)} />
    </>
  )
}