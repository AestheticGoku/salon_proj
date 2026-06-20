import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'

export default function BoutiqueCart() {
  const { cart, addToCart, removeFromCart, checkoutCart, isCartOpen, setCartOpen } = useContext(AppContext)
  const [isCheckoutSuccess, setCheckoutSuccess] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    const success = await checkoutCart(totalPrice)
    setIsCheckingOut(false)
    if (success) {
      setCheckoutSuccess(true)
      setTimeout(() => {
        setCheckoutSuccess(false)
        setCartOpen(false)
      }, 3000)
    } else {
      alert('Could not process order. Is the Python FastAPI backend running?')
    }
  }

  return (
    <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={(e) => {
      if (e.target.classList.contains('cart-overlay')) setCartOpen(false)
    }}>
      <div className="cart-drawer">
        <div className="cart-header">
          <h3>Royal Boutique Cart</h3>
          <button className="cart-close" onClick={() => setCartOpen(false)} aria-label="Close Cart">×</button>
        </div>

        <div className="cart-items">
          {isCheckoutSuccess ? (
            <div className="cart-empty" style={{ color: 'var(--gold)', animation: 'fadeIn 0.5s' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>✨</span>
              <h4 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.6rem', marginBottom: '0.5rem' }}>Ritual Prepared</h4>
              <p style={{ fontFamily: 'Jost', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Your order has been recorded in our ledger and is being hand-packaged.
              </p>
            </div>
          ) : cart.length === 0 ? (
            <div className="cart-empty">
              <span>Your boutique basket is empty.</span>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-img">
                  {item.img && item.img.startsWith('/images/') ? (
                    <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    item.img
                  )}
                </div>
                <div className="cart-item-details">
                  <div className="cart-item-brand">{item.brand}</div>
                  <h4 className="cart-item-name">{item.name}</h4>
                  <div className="cart-item-price">₹ {(item.price * item.quantity).toLocaleString('en-IN')}</div>
                  <div className="cart-item-qty" style={{ marginTop: '0.6rem' }}>
                    <button className="qty-btn" onClick={() => removeFromCart(item.id)}>-</button>
                    <span className="qty-val">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => addToCart(item)}>+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && !isCheckoutSuccess && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <span className="cart-total-label">Subtotal</span>
              <span className="cart-total-price">₹ {totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '1.1rem' }} 
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? 'Recording order...' : 'Request Delivery & Checkout'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
