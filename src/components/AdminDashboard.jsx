import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../context/AppContext'

export default function AdminDashboard() {
  const { user, fetchAdminStats, fetchAdminUsers, fetchAdminBookings, fetchAdminOrders, updateBookingStatus } = useContext(AppContext)
  
  const [stats, setStats] = useState(null)
  const [adminUsers, setAdminUsers] = useState([])
  const [adminBookings, setAdminBookings] = useState([])
  const [adminOrders, setAdminOrders] = useState([])
  
  const [activeTab, setActiveTab] = useState('bookings') // 'users', 'bookings', 'orders', 'chat'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Booking rejection helper state
  const [rejectionTargetId, setRejectionTargetId] = useState(null)
  const [rejectionNote, setRejectionNote] = useState('')

  // Chat desk state
  const [chatRooms, setChatRooms] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [sendingReply, setSendingReply] = useState(false)

  useEffect(() => {
    if (user && (user.isAdmin || user.isStaff)) {
      loadAdminData()
    }
  }, [user])

  useEffect(() => {
    let interval
    if (user && (user.isAdmin || user.isStaff) && activeTab === 'chat') {
      loadChats()
      interval = setInterval(() => {
        loadChats()
      }, 4000)
    }
    return () => clearInterval(interval)
  }, [user, activeTab, selectedChat])

  const loadChats = async () => {
    try {
      const res = await fetch('https://salonproj-production.up.railway.app/api/admin/chats')
      if (res.ok) {
        const data = await res.json()
        setChatRooms(data)
        if (selectedChat) {
          const updated = data.find(c => c.user.id === selectedChat.user.id)
          if (updated) {
            setSelectedChat(updated)
          }
        }
      }
    } catch (err) {
      console.error('Error loading chats:', err)
    }
  }

  const handleSendReply = async (e) => {
    e.preventDefault()
    if (!replyText.trim() || !selectedChat) return
    setSendingReply(true)
    try {
      const res = await fetch('https://salonproj-production.up.railway.app/api/chat/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedChat.user.id,
          sender: 'staff',
          message: replyText
        })
      })
      if (res.ok) {
        setReplyText('')
        await loadChats()
      }
    } catch (err) {
      console.error('Error sending staff reply:', err)
    } finally {
      setSendingReply(false)
    }
  }

  const loadAdminData = async () => {
    setLoading(true)
    setError(null)
    try {
      // 1. Fetch Stats
      const statsData = await fetchAdminStats()
      if (!statsData) throw new Error('Failed to load stats')
      setStats(statsData)

      // 2. Fetch Users
      const usersData = await fetchAdminUsers()
      setAdminUsers(usersData)

      // 3. Fetch Bookings
      const bookingsData = await fetchAdminBookings()
      setAdminBookings(bookingsData)

      // 4. Fetch Orders
      const ordersData = await fetchAdminOrders()
      setAdminOrders(ordersData)

      // 5. Fetch Chats initial
      await loadChats()

    } catch (err) {
      console.error(err)
      setError('Could not load administrative ledgers. Please ensure the FastAPI backend is running.')
    } finally {
      setLoading(false)
    }
  }

  if (!user || (!user.isAdmin && !user.isStaff)) {
    return (
      <div className="admin-dashboard" style={{ textAlign: 'center', padding: '10rem 2rem' }}>
        <h2 style={{ color: '#e07a5f' }}>Access Denied</h2>
        <p>You do not have administrative clearance to view this ledger.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="admin-dashboard" style={{ textAlign: 'center', padding: '10rem 2rem' }}>
        <span style={{ fontSize: '2.5rem', display: 'block', animation: 'spin 2s linear infinite' }}>✨</span>
        <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.6rem', marginTop: '1rem' }}>Loading Administrative Vault...</h3>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-dashboard text-center" style={{ padding: '8rem 2rem' }}>
        <h3 style={{ color: '#e07a5f', marginBottom: '1rem' }}>Vault Offline</h3>
        <p>{error}</p>
        <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={loadAdminData}>Retry Authentication</button>
      </div>
    )
  }

  // --- SVG Chart Coordinates Generators ---
  // 1. Revenue Area Chart Coords
  const generateRevenueChartPaths = () => {
    if (!stats || !stats.revenueHistory || stats.revenueHistory.length === 0) return { line: '', area: '', points: [] }
    
    const history = stats.revenueHistory
    const width = 540
    const height = 180
    const paddingX = 50
    const paddingY = 30
    
    const maxVal = Math.max(...history.map(d => d.amount), 5000)
    
    const getX = (index) => paddingX + (index / (history.length - 1)) * (width - paddingX * 2)
    const getY = (amount) => height - paddingY - (amount / maxVal) * (height - paddingY * 2)
    
    const points = history.map((d, i) => ({ x: getX(i), y: getY(d.amount), date: d.date, amount: d.amount }))
    
    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    
    return { line: linePath, area: areaPath, points, maxVal, getX, getY }
  };

  const revChart = generateRevenueChartPaths()

  return (
    <div className="admin-dashboard">
      <span className="section-eyebrow">Administrative Panel</span>
      <h2 style={{ fontSize: '2.8rem', marginBottom: '0.4rem' }}>Royal <em>Ledger</em></h2>
      <p style={{ color: 'var(--charcoal-soft)', fontSize: '0.85rem' }}>System-wide financial diagnostics, user directories, and reservation records.</p>

      {/* OVERVIEW STATS CARDS */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="admin-stat-label">Boutique Profits</span>
          <div className="admin-stat-value">
            {user.isAdmin ? (
              <><em>₹</em>{stats.boutiqueRevenue.toLocaleString('en-IN')}</>
            ) : (
              <span style={{ fontSize: '1.2rem', color: 'var(--charcoal-soft)', letterSpacing: '0.05em' }}>Clearance Required</span>
            )}
          </div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-label">Est. Bookings Value</span>
          <div className="admin-stat-value">
            {user.isAdmin ? (
              <><em>₹</em>{stats.estimatedBookingValue.toLocaleString('en-IN')}</>
            ) : (
              <span style={{ fontSize: '1.2rem', color: 'var(--charcoal-soft)', letterSpacing: '0.05em' }}>Clearance Required</span>
            )}
          </div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-label">Registered Guests</span>
          <div className="admin-stat-value">
            {stats.totalUsers}
          </div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-label">Total Reservations</span>
          <div className="admin-stat-value">
            {stats.totalBookings}
          </div>
        </div>
      </div>

      {/* CHARTS GRAPHICS */}
      <div className="admin-charts-row">
        {/* 1. Area Chart (Daily Revenue Trends) */}
        <div className="admin-chart-box">
          <h3>Boutique <em>Revenue Trend</em> (Last 7 Days)</h3>
          {user.isAdmin ? (
            <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
              <svg viewBox="0 0 540 180" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                
                {/* Grids / Axes */}
                <line x1="50" y1="150" x2="490" y2="150" stroke="var(--border-soft)" strokeWidth="0.5" />
                <line x1="50" y1="90" x2="490" y2="90" stroke="var(--border-soft)" strokeWidth="0.5" strokeDasharray="3" />
                <line x1="50" y1="30" x2="490" y2="30" stroke="var(--border-soft)" strokeWidth="0.5" strokeDasharray="3" />
                
                {/* Y Axis labels */}
                <text x="40" y="34" fontSize="8" fill="var(--charcoal-soft)" textAnchor="end">₹{Math.floor(revChart.maxVal).toLocaleString()}</text>
                <text x="40" y="94" fontSize="8" fill="var(--charcoal-soft)" textAnchor="end">₹{Math.floor(revChart.maxVal / 2).toLocaleString()}</text>
                <text x="40" y="154" fontSize="8" fill="var(--charcoal-soft)" textAnchor="end">₹0</text>
                
                {/* Plot Paths */}
                {revChart.area && (
                  <path d={revChart.area} fill="url(#areaGrad)" />
                )}
                {revChart.line && (
                  <path d={revChart.line} fill="none" stroke="var(--gold)" strokeWidth="2" />
                )}

                {/* Data points */}
                {revChart.points.map((p, idx) => (
                  <g key={idx}>
                    <circle cx={p.x} cy={p.y} r="4" fill="var(--white)" stroke="var(--gold)" strokeWidth="1.5" />
                    {/* Tooltip values */}
                    <text x={p.x} y={p.y - 8} fontSize="8" fill="var(--gold)" textAnchor="middle" fontWeight="500">
                      ₹{p.amount.toLocaleString()}
                    </text>
                    {/* X Axis Labels */}
                    <text x={p.x} y="165" fontSize="8" fill="var(--charcoal-soft)" textAnchor="middle">
                      {p.date}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '140px', background: 'rgba(26,26,24,0.03)', border: '0.5px dashed var(--border-soft)', padding: '1rem', color: 'var(--charcoal-soft)', marginTop: '1rem' }}>
              <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔒</span>
              <p style={{ fontSize: '0.78rem', textAlign: 'center', margin: 0 }}>Daily financial trend charts are restricted to Spa Administrators.</p>
            </div>
          )}
        </div>

        {/* 2. Bar Chart (Bookings by service) */}
        <div className="admin-chart-box">
          <h3>Reservations by <em>Category</em></h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '1rem' }}>
            {stats.bookingsByCategory.map((cat, idx) => {
              const maxCount = Math.max(...stats.bookingsByCategory.map(c => c.count), 1)
              const percentage = (cat.count / maxCount) * 100
              return (
                <div key={idx} style={{ textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 400, color: 'var(--charcoal-mid)' }}>{cat.category}</span>
                    <strong style={{ color: 'var(--gold)' }}>{cat.count} booking{cat.count !== 1 ? 's' : ''}</strong>
                  </div>
                  {/* Bar wrapper */}
                  <div style={{ height: '8px', background: 'var(--border-soft)', width: '100%', position: 'relative' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        background: 'var(--gold)', 
                        width: `${percentage}%`, 
                        transition: 'width 0.8s ease' 
                      }} 
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* LEDGER TABLES SECTION */}
      <div className="admin-ledger-section">
        <div className="admin-ledger-header">
          <h3>Administrative <em>Registers</em></h3>
          <div className="admin-tab-nav">
            <button 
              className={`admin-tab-link ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              Bookings Ledger ({adminBookings.length})
            </button>
            <button 
              className={`admin-tab-link ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Guest Ledger ({adminUsers.length})
            </button>
            <button 
              className={`admin-tab-link ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Orders Ledger ({adminOrders.length})
            </button>
            <button 
              className={`admin-tab-link ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              Staff Chat Desk ({chatRooms.length})
            </button>
          </div>
        </div>

        <div className="admin-table-container">
          {activeTab === 'users' && (
            <table className="admin-table" style={{ animation: 'fadeIn 0.4s' }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email Address</th>
                  <th>Clearance</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.map((u) => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`admin-badge ${u.isAdmin ? 'admin' : 'user'}`}>
                        {u.isAdmin ? 'Admin' : 'Guest'}
                      </span>
                    </td>
                    <td>{new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'bookings' && (
            <table className="admin-table" style={{ animation: 'fadeIn 0.4s' }}>
              <thead>
                <tr>
                  <th>Ref ID</th>
                  <th>Guest Name</th>
                  <th>Ritual / Service</th>
                  <th>Date & Time</th>
                  <th>Mobile Number</th>
                  <th>Status</th>
                  <th>Special Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminBookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '4rem 0', fontStyle: 'italic', color: 'var(--charcoal-soft)' }}>
                      No active bookings booked.
                    </td>
                  </tr>
                ) : (
                  adminBookings.map((b) => (
                    <tr key={b.id}>
                      <td>#{b.id}</td>
                      <td><strong>{b.firstName} {b.lastName}</strong></td>
                      <td><span style={{ color: 'var(--gold)', fontWeight: 400 }}>{b.service}</span></td>
                      <td>{b.date} at {b.time}</td>
                      <td>{b.phone}</td>
                      <td>
                        <span className={`admin-badge ${b.status ? b.status.toLowerCase() : 'pending'}`}>
                          {b.status || 'Pending'}
                        </span>
                        {b.status === 'Rejected' && b.rejection_message && (
                          <div style={{ fontSize: '0.68rem', color: '#e07a5f', marginTop: '0.2rem', fontStyle: 'italic' }}>
                            Note: "{b.rejection_message}"
                          </div>
                        )}
                      </td>
                      <td style={{ fontSize: '0.72rem', color: 'var(--charcoal-soft)' }}>{b.specialRequests || '—'}</td>
                      <td>
                        {rejectionTargetId === b.id ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '160px' }}>
                            <input
                              type="text"
                              placeholder="Type reason or re-reserve time..."
                              value={rejectionNote}
                              onChange={(e) => setRejectionNote(e.target.value)}
                              style={{ 
                                fontSize: '0.7rem', 
                                padding: '0.3rem 0.5rem', 
                                background: 'rgba(25, 25, 23, 0.4)',
                                border: '1px solid var(--border-soft)',
                                color: 'var(--white)',
                                width: '100%'
                              }}
                              required
                            />
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button
                                className="btn-primary"
                                style={{ padding: '0.2rem 0.6rem', fontSize: '0.62rem', background: '#e07a5f' }}
                                onClick={async () => {
                                  if (!rejectionNote.trim()) return
                                  const updated = await updateBookingStatus(b.id, 'Rejected', rejectionNote)
                                  if (updated) {
                                    setAdminBookings(prev => prev.map(item => item.id === b.id ? updated : item))
                                  }
                                  setRejectionTargetId(null)
                                  setRejectionNote('')
                                }}
                              >
                                Submit
                              </button>
                              <button
                                className="btn-ghost"
                                style={{ padding: '0.2rem 0.6rem', fontSize: '0.62rem' }}
                                onClick={() => {
                                  setRejectionTargetId(null)
                                  setRejectionNote('')
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                              className="btn-primary"
                              style={{ 
                                padding: '0.3rem 0.8rem', 
                                fontSize: '0.65rem', 
                                background: b.status === 'Confirmed' ? '#4CAF50' : 'rgba(76, 175, 80, 0.1)', 
                                border: b.status === 'Confirmed' ? 'none' : '1px solid #4CAF50',
                                color: b.status === 'Confirmed' ? '#fff' : '#4CAF50'
                              }}
                              onClick={async () => {
                                const updated = await updateBookingStatus(b.id, 'Confirmed')
                                if (updated) {
                                  setAdminBookings(prev => prev.map(item => item.id === b.id ? updated : item))
                                }
                              }}
                            >
                              Confirm
                            </button>
                            <button
                              className="btn-ghost"
                              style={{ 
                                padding: '0.3rem 0.8rem', 
                                fontSize: '0.65rem', 
                                borderColor: '#e07a5f', 
                                color: b.status === 'Rejected' ? '#fff' : '#e07a5f',
                                background: b.status === 'Rejected' ? '#e07a5f' : 'transparent'
                              }}
                              onClick={() => {
                                setRejectionTargetId(b.id)
                                setRejectionNote(b.rejection_message || '')
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'orders' && (
            <table className="admin-table" style={{ animation: 'fadeIn 0.4s' }}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Total Price</th>
                  <th>Boutique Items Ordered</th>
                  <th>Order Date</th>
                </tr>
              </thead>
              <tbody>
                {adminOrders.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '4rem 0', fontStyle: 'italic', color: 'var(--charcoal-soft)' }}>
                      No boutique checkout orders recorded.
                    </td>
                  </tr>
                ) : (
                  adminOrders.map((o) => {
                    let parsedItems = []
                    try {
                      parsedItems = JSON.parse(o.items)
                    } catch (e) {
                      console.error(e)
                    }
                    return (
                      <tr key={o.id}>
                        <td>#{o.id}</td>
                        <td><strong style={{ color: 'var(--gold)' }}>₹ {o.totalPrice.toLocaleString('en-IN')}</strong></td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            {parsedItems.map((item, index) => (
                              <span key={index} style={{ fontSize: '0.72rem' }}>
                                • {item.name} (qty: {item.quantity})
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>{new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          )}
          {activeTab === 'chat' && (
            <div className="chat-desk-container">
              {/* Sidebar: list of chat rooms */}
              <div className="chat-desk-sidebar">
                <div className="chat-desk-sidebar-header">
                  Guest Threads
                </div>
                {chatRooms.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--charcoal-soft)', fontStyle: 'italic' }}>
                    No active chat messages from guests.
                  </div>
                ) : (
                  chatRooms.map((room) => (
                    <button 
                      key={room.user.id}
                      className={`chat-room-item ${selectedChat && selectedChat.user.id === room.user.id ? 'active' : ''}`}
                      onClick={() => setSelectedChat(room)}
                    >
                      <h4>{room.user.name}</h4>
                      <p className="snippet">{room.lastMessage}</p>
                      <span style={{ fontSize: '0.62rem', color: 'var(--charcoal-soft)' }}>{room.user.email}</span>
                    </button>
                  ))
                )}
              </div>

              {/* Feed: active conversation details */}
              <div className="chat-desk-feed">
                {selectedChat ? (
                  <>
                    <div className="chat-desk-feed-header">
                      <h4>{selectedChat.user.name}</h4>
                      <span>Guest Account #{selectedChat.user.id} · {selectedChat.user.email}</span>
                    </div>

                    <div className="chat-desk-messages">
                      {selectedChat.messages.map((msg) => (
                        <div key={msg.id} className={`chat-desk-bubble ${msg.sender}`}>
                          <strong style={{ display: 'block', fontSize: '0.65rem', marginBottom: '0.2rem', color: msg.sender === 'staff' ? 'var(--gold-light)' : 'var(--gold)' }}>
                            {msg.sender === 'staff' ? 'Spa Representative (You)' : selectedChat.user.name}
                          </strong>
                          {msg.message}
                          <span className="chat-desk-time">
                            {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>

                    <form className="chat-desk-input-bar" onSubmit={handleSendReply}>
                      <input 
                        type="text" 
                        placeholder={`Reply to ${selectedChat.user.name.split(' ')[0]}...`}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        required
                        disabled={sendingReply}
                      />
                      <button 
                        type="submit" 
                        className="chat-desk-send-btn"
                        disabled={sendingReply || !replyText.trim()}
                      >
                        {sendingReply ? 'Sending...' : 'Reply'}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="chat-desk-empty">
                    <span style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💬</span>
                    <h4>Select a conversation from the Guest Threads list to begin direct staff messaging.</h4>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
