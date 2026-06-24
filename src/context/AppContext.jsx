import React, { createContext, useState, useEffect } from 'react'

export const AppContext = createContext()

const API_BASE_URL = window.location.hostname !== 'salonproj-production.up.railway.app'
  ? `http://${window.location.hostname || 'localhost'}:8000/api`
  : 'https://salonproj-production.up.railway.app/api'

export const AppProvider = ({ children }) => {
  // Load logged in user on session start
  const [user, setUser] = useState(() => {
    // Clean up any old localStorage user to prevent user 'a' from being signed in
    const oldLocalUser = localStorage.getItem('wellness_user')
    if (oldLocalUser) {
      localStorage.removeItem('wellness_user')
    }
    const savedUser = sessionStorage.getItem('wellness_user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  // Shopping cart remains in localStorage for standard client session caching
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('wellness_cart')
    return savedCart ? JSON.parse(savedCart) : []
  })
  
  // Bookings are loaded dynamically from SQLite database
  const [bookings, setBookings] = useState([])
  const [activeTab, setActiveTab] = useState('home')
  const [isCartOpen, setCartOpen] = useState(false)
  const [isAuthOpen, setAuthOpen] = useState(false)

  // Fetch bookings from backend SQLite database on mount or when user changes
  useEffect(() => {
    fetchBookings()
  }, [user])

  // Save cart to local storage when cart changes
  useEffect(() => {
    localStorage.setItem('wellness_cart', JSON.stringify(cart))
  }, [cart])

  const fetchBookings = async () => {
    try {
      const url = user 
        ? `${API_BASE_URL}/bookings?userId=${user.id}`
        : `${API_BASE_URL}/bookings`
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      } else {
        console.error('Failed to load bookings from API')
      }
    } catch (error) {
      console.error('Error connecting to backend API:', error)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data)
        sessionStorage.setItem('wellness_user', JSON.stringify(data))
        return true
      }
    } catch (error) {
      console.error('Login error:', error)
    }
    return false
  }

  const signup = async (name, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data)
        sessionStorage.setItem('wellness_user', JSON.stringify(data))
        return true
      }
    } catch (error) {
      console.error('Signup error:', error)
    }
    return false
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('wellness_user')
    setBookings([])
    clearCart()
  }

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id)
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
    setCartOpen(true)
  }

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === productId)
      if (existing && existing.quantity > 1) {
        return prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
      }
      return prevCart.filter((item) => item.id !== productId)
    })
  }

  const clearCart = () => {
    setCart([])
  }

  // Submit order to SQLite database
  const checkoutCart = async (totalPrice) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user ? user.id : null,
          totalPrice,
          items: cart
        })
      })
      if (response.ok) {
        clearCart()
        return true
      }
      return false
    } catch (error) {
      console.error('Error checking out cart to backend:', error)
      return false
    }
  }

  // Insert booking to database
  const addBooking = async (bookingData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user ? user.id : null,
          firstName: bookingData.firstName,
          lastName: bookingData.lastName || '',
          service: bookingData.service,
          date: bookingData.date,
          time: bookingData.time,
          phone: bookingData.phone,
          specialRequests: bookingData.specialRequests || ''
        })
      })

      if (response.ok) {
        const newBooking = await response.json()
        setBookings(prev => [newBooking, ...prev])
        return newBooking
      } else {
        console.error('Failed to save booking to DB')
      }
    } catch (error) {
      console.error('Error adding booking to API:', error)
    }
    return null
  }

  // Cancel/Delete booking from database
  const deleteBooking = async (bookingId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setBookings(prev => prev.filter(b => b.id !== bookingId))
        return true
      } else {
        console.error('Failed to delete booking from database')
      }
    } catch (error) {
      console.error('Error deleting booking via API:', error)
    }
    return false
  }

  const updateBookingStatus = async (bookingId, status, rejectionMessage = null) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          rejectionMessage
        })
      })
      if (response.ok) {
        const updated = await response.json()
        setBookings(prev => prev.map(b => b.id === bookingId ? updated : b))
        return updated
      } else {
        console.error('Failed to update booking status')
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
    }
    return null
  }

  // Admin API methods
  const fetchAdminStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`)
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error)
    }
    return null
  }

  const fetchAdminUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`)
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.error('Error fetching admin users:', error)
    }
    return []
  }

  const fetchAdminBookings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/bookings`)
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.error('Error fetching admin bookings:', error)
    }
    return []
  }

  const fetchAdminOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders`)
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.error('Error fetching admin orders:', error)
    }
    return []
  }

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        checkoutCart,
        bookings,
        addBooking,
        deleteBooking,
        updateBookingStatus,
        activeTab,
        setActiveTab,
        isCartOpen,
        setCartOpen,
        isAuthOpen,
        setAuthOpen,
        fetchBookings,
        fetchAdminStats,
        fetchAdminUsers,
        fetchAdminBookings,
        fetchAdminOrders
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
