import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import AuthModal from './AuthModal'

export default function Navigation() {
  const { user, logout, cart, activeTab, setActiveTab, setCartOpen, isAuthOpen, setAuthOpen } = useContext(AppContext)
  
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleNavClick = (tabId) => {
    setActiveTab(tabId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Desktop only: scroll to section on home page
  const handleDesktopNavClick = (sectionId) => {
    setActiveTab('home')
    setTimeout(() => {
      const el = document.getElementById(sectionId)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <>
      {/* DESKTOP FLOATING BLUR HEADER */}
      <nav className="desktop-nav">
        <a href="#" onClick={() => handleNavClick('home')} className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <img src="/images/kesari_atelier_logo.png" alt="Kesari Atelier Logo" style={{ height: '30px', width: 'auto', borderRadius: '4px' }} />
          Kesari <span>Atelier</span>
        </a>
        <ul className="nav-links">
          <li><a className={activeTab === 'experiences' ? 'active' : ''} onClick={() => handleDesktopNavClick('services')}>Experiences</a></li>
          <li><a className={activeTab === 'bridal' ? 'active' : ''} onClick={() => handleDesktopNavClick('bridal')}>Bridal</a></li>
          <li><a className={activeTab === 'book' ? 'active' : ''} onClick={() => handleDesktopNavClick('booking')}>Book</a></li>
          <li><a className={activeTab === 'boutique' ? 'active' : ''} onClick={() => handleDesktopNavClick('marketplace')}>Boutique</a></li>
        </ul>
        <div className="nav-actions">
          <button className="cart-icon-btn" onClick={() => setCartOpen(true)} aria-label="Open Cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {totalCartItems > 0 && <span className="cart-badge">{totalCartItems}</span>}
          </button>
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {(user.isAdmin || user.isStaff) && (
                <button 
                  className={`btn-ghost ${activeTab === 'admin' ? 'active' : ''}`}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', borderColor: 'var(--gold)', color: 'var(--gold)', borderRadius: '4px', cursor: 'pointer' }}
                  onClick={() => handleNavClick('admin')}
                >
                  {user.isAdmin ? 'Admin Panel' : 'Staff Panel'}
                </button>
              )}
              <button className="user-profile-trigger" onClick={logout} title="Click to Sign Out">
                <span>{user.name.split(' ')[0]}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </div>
          ) : (
            <button className="auth-btn" onClick={() => setAuthOpen(true)}>Sign In</button>
          )}

          <button className="nav-cta" onClick={() => handleDesktopNavClick('booking')}>Reserve</button>
        </div>
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setAuthOpen(false)} />

      {/* MOBILE BOTTOM TAB BAR */}
      <div className="mobile-nav">
        <button onClick={() => handleNavClick('home')} className={`mobile-nav-item ${activeTab === 'home' ? 'active' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Home</span>
        </button>
        
        <button onClick={() => handleNavClick('rituals')} className={`mobile-nav-item ${activeTab === 'rituals' ? 'active' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span>Rituals</span>
        </button>

        <button onClick={() => handleNavClick('book')} className={`mobile-nav-item ${activeTab === 'book' ? 'active' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>Book</span>
        </button>

        <button onClick={() => handleNavClick('boutique')} className={`mobile-nav-item ${activeTab === 'boutique' ? 'active' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <span>Boutique</span>
          {totalCartItems > 0 && <span className="cart-badge">{totalCartItems}</span>}
        </button>

        <button onClick={() => user ? handleNavClick('account') : setAuthOpen(true)} className={`mobile-nav-item ${activeTab === 'account' ? 'active' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>{user ? user.name.split(' ')[0] : 'Sign In'}</span>
        </button>
      </div>
    </>
  )
}