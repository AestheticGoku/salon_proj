import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import AuthModal from './AuthModal'

export default function Navigation() {
  const { user, logout, cart, activeTab, setActiveTab, setCartOpen, isAuthOpen, setAuthOpen } = useContext(AppContext)
  
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Scroll to section on home page or switch tab
  const handleNavClick = (tabId, sectionId) => {
    setActiveTab(tabId)
    // If we're already on home, scroll to section
    if (tabId === 'home' && sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
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
          <li>
            <a 
              className={activeTab === 'experiences' ? 'active' : ''} 
              onClick={() => handleNavClick('home', 'services')}
            >
              Experiences
            </a>
          </li>
          <li>
            <a 
              className={activeTab === 'bridal' ? 'active' : ''} 
              onClick={() => handleNavClick('home', 'bridal')}
            >
              Bridal
            </a>
          </li>
          <li>
            <a 
              className={activeTab === 'book' ? 'active' : ''} 
              onClick={() => handleNavClick('home', 'booking')}
            >
              Book
            </a>
          </li>
          <li>
            <a 
              className={activeTab === 'boutique' ? 'active' : ''} 
              onClick={() => handleNavClick('home', 'marketplace')}
            >
              Boutique
            </a>
          </li>
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
                  style={{ 
                    padding: '0.5rem 1rem', 
                    fontSize: '0.75rem', 
                    borderColor: 'var(--gold)', 
                    color: 'var(--gold)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => handleNavClick('admin')}
                >
                  {user.isAdmin ? 'Admin Panel' : 'Staff Panel'}
                </button>
              )}
              <button 
                className="user-profile-trigger" 
                onClick={logout}
                title="Click to Sign Out"
              >
                <span>{user.name.split(' ')[0]}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </div>
          ) : (
            <button className="auth-btn" onClick={() => setAuthOpen(true)}>
              Sign In
            </button>
          )}

          <button 
            className="nav-cta" 
            onClick={() => handleNavClick('home', 'booking')}
          >
            Reserve
          </button>
        </div>
      </nav>

      {/* AUTHENTICATION OVERLAY */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setAuthOpen(false)} />

      {/* MOBILE BOTTOM TAB BAR */}
      <div className="mobile-nav">
        <button 
          onClick={() => handleNavClick('home')} 
          className={`mobile-nav-item ${activeTab === 'home' ? 'active' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Home
        </button>
        
        <button 
          onClick={() => handleNavClick('home', 'services')} 
          className={`mobile-nav-item ${activeTab === 'experiences' ? 'active' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8l4 4-4 4M8 12h8" />
          </svg>
          Rituals
        </button>

        <button 
          onClick={() => handleNavClick('home', 'bridal')} 
          className={`mobile-nav-item ${activeTab === 'bridal' ? 'active' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          Bridal
        </button>

        <button 
          onClick={() => handleNavClick('home', 'booking')} 
          className={`mobile-nav-item ${activeTab === 'book' ? 'active' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Book
        </button>

        <button 
          onClick={() => handleNavClick('home', 'marketplace')} 
          className={`mobile-nav-item ${activeTab === 'boutique' ? 'active' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          Boutique
          {totalCartItems > 0 && <span className="cart-badge">{totalCartItems}</span>}
        </button>

        {user && (user.isAdmin || user.isStaff) && (
          <button 
            onClick={() => handleNavClick('admin')} 
            className={`mobile-nav-item ${activeTab === 'admin' ? 'active' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
              <line x1="15" y1="3" x2="15" y2="21" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="3" y1="15" x2="21" y2="15" />
            </svg>
            {user.isAdmin ? 'Admin' : 'Staff'}
          </button>
        )}
      </div>
    </>
  )
}
