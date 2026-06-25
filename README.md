# Kesari Atelier — Luxury Salon & Spa Platform

A full-stack luxury salon and spa booking platform inspired by Rajasthani heritage aesthetics, built with React + FastAPI + Gemini AI.

---

## 🌐 Live Deployments

- **Frontend (Vercel):** [kesari-green.vercel.app](https://kesari-green.vercel.app)
- **Backend (Railway):** [salonproj-production.up.railway.app](https://salonproj-production.up.railway.app)

---

## ✨ Features

- **Service Booking System** — Full appointment booking with date, time, and service selection
- **AI Chat Concierge** — Powered by Gemini API, answers questions about services, pricing, and availability
- **Royal AI Advisor** — Multi-step wizard that curates personalized spa & salon recommendations
- **AI Day Planner** — Chronological beauty & wellness timeline generator for upcoming occasions
- **1-to-1 Staff Chat** — Real-time chat between clients and salon staff
- **Royal Boutique** — Product marketplace with cart functionality
- **Admin Dashboard** — Booking management, user overview, staff panel with charts
- **Bridal Packages** — Dedicated bridal grooming section with curated packages
- **Mobile App** — Android app built with Capacitor
- **Authentication** — User sign-up/login with role-based access (Admin, Staff, User)
- **Responsive Design** — Fully optimized for desktop and mobile

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Capacitor (Android)
- CSS (custom design system with Rajasthani palace aesthetic)

### Backend
- FastAPI (Python)
- Uvicorn
- SQLite / in-memory store

### AI
- Google Gemini API (`gemini-2.5-flash`)

### Deployment
- Frontend → Vercel
- Backend → Railway

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- A Gemini API key from [aistudio.google.com](https://aistudio.google.com)

### Frontend Setup

```bash
# Install dependencies
npm install

# Create environment file
echo "VITE_API_BASE_URL=https://salonproj-production.up.railway.app/api" > .env

# Run development server
npm run dev
```

### Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Set your Gemini API key
export GEMINI_API_KEY=your_api_key_here

# Run the server
uvicorn main:app --reload --port 8000
```

---

## 📱 Android App

```bash
# Build the frontend
npm run build

#to build android folder(first time)
npx cap add android

# Sync with Capacitor
npx cap sync android

# Open in Android Studio
npx cap open android
```

---

## 🔑 Environment Variables

### Frontend (`.env`)
| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API URL |

### Backend (Railway)
| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key |

---

## 📁 Project Structure

```
salon_proj/
├── src/
│   ├── components/
│   │   ├── AIAssistance.jsx      # AI Advisor wizard
│   │   ├── ChatDrawer.jsx        # Chat Concierge drawer
│   │   ├── AdminDashboard.jsx    # Admin panel
│   │   ├── Navigation.jsx        # Nav bar
│   │   └── BoutiqueCart.jsx      # Shopping cart
│   ├── context/
│   │   └── AppContext.jsx        # Global state
│   └── App.jsx                   # Main app + mobile screens
├── backend/
│   ├── main.py                   # FastAPI app + routes
│   └── ai_advisor.py             # Gemini AI integration
├── android/                      # Capacitor Android project
└── public/
    └── images/                   # Static assets
```

---

## 👥 Team: Vaibhavi Singh Gaur(Leader) and Vinayak Vyas

Built as a full-stack project showcasing heritage-inspired UI design, AI integration, and cross-platform deployment.
