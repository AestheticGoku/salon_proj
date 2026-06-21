import json
import hashlib
import secrets
import os
import time
from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

from database import engine, Base, get_db, SessionLocal
import models, schemas
from ai_advisor import generate_prescription

try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

# Create SQLite Database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kesari Atelier API",
    description="Backend API powering bookings, orders, and the AI wellness consultant.",
    version="1.0.0"
)

# Enable CORS for React frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development ease
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AI chatbot knowledge base prompt configuration
SYSTEM_INSTRUCTION = """
You are the Royal AI Concierge for "Kesari Atelier", a luxury heritage spa, salon, and bridal studio located in Udaipur, Rajasthan (City of Lakes), established in 2009.
Your job is to answer guest queries in a polite, warm, and professional manner, using a royal and welcoming tone. Always begin your responses with the traditional royal Mewari greeting "Khammaghani".
CRITICAL LENGTH CONSTRAINT: Keep all responses extremely short, concise, and direct. Do NOT write paragraphs or bullet points. Your replies must be limited to 1 sentence (max 2 sentences in complex cases). Absolutely do not exceed 25-30 words.
Keep your responses helpful, concise, and focused strictly on the salon.

Here are the salon details:
- Theme: Udaipur heritage beauty, natural ingredients (Kesar, Vetiver, Sandalwood, Rose Quartz).
- Offerings & Prices:
  * Royal Spa Retreats: From ₹8,500. (Abhyanga massage, kesar milk wrap, chakra balancing, herbal steam).
  * Heritage Salon: From ₹3,200. (Rajputana mehndi, hair oil ritual, kumkum/kajal eye ceremony).
  * Elite Bridal Grooming: From ₹45,000. (30-day pre-bridal luminosity, bridal makeup, family motif mehndi).
  * Wellness Alchemy: From ₹5,500. (Panchakarma dosha consult, Shirodhara oil, 7-day diet plan).
  * Luminosity Facials: From ₹6,800. (24K gold leaf, rose quartz gua sha, saffron serum).
  * Haute Nail Atelier: From ₹2,400. (Jharokha lattice patterns, mirror-work fresco nails).
  * Maharani Day Journey (Signature): ₹24,000. (6 hours, 8 rituals, 3 therapists).
- Boutique Catalog:
  * Saffron & Rose Luminance Serum: ₹3,200
  * Jasmine & Vetiver Ritual Oil: ₹1,800
  * 24K Gold Facial Dust: ₹5,500
  * Sandalwood Ubtan Body Scrub: ₹1,200
- Master Artisans:
  * Rekha Sharma: Ayurvedic therapist (18 years experience)
  * Vandana Sisodia: Bridal makeup artist (Paris & Mumbai trained)
  * Arjun Mehta: Master hair stylist (Former Taj Lake Palace)
  * Pushpa Rathore: Mehndi & skin ritualist (5th generation)
- Location & Contacts:
  * Lake Pichola Studio & City Palace Wing, Udaipur.
  * Phone: +91 94141 00000
  * Email: hello@kesariatelier.in
  * Hours: 9:00 AM to 8:00 PM daily.

CRITICAL STOCKS, INVENTORY, & RECOMMENDATION CONSTRAINT:
1. You MUST ONLY suggest, recommend, or mention products, scents, or ingredients that are explicitly in stock and listed in our boutique catalog or treatments above.
2. You MUST NOT suggest any products, ingredients, or items that are not in our catalog. For example, do NOT suggest rosemary, lavender, tea tree oil, chamomile, or any other items. If a guest asks for something not in our stock (like rosemary), politely state that it is not in our collection and suggest one of our in-stock items instead (e.g. Saffron & Rose Luminance Serum, Jasmine & Vetiver Ritual Oil, or Sandalwood Ubtan Body Scrub).
3. If the user asks general questions like "What is best for hair?" or "What do you suggest?", only recommend from the four boutique products and six experiences above, explaining how they fit the user's needs.
4. DRY SKIN RECOMMENDATIONS: If a guest mentions dry skin, recommends products specifically for dry skin, or asks for advice on dry skin, you MUST recommend our Saffron & Rose Luminance Serum (₹3,200, highly hydrating and skin brightening with saffron and rose water) and/or Jasmine & Vetiver Ritual Oil (₹1,800, deeply nourishing and moisture-locking with traditional vetiver and jasmine oils). Explain how these products restore moisture and royal radiance.

Only answer queries related to the salon, wellness, bookings, products, and Udaipur tourism. If a guest asks a generic or unrelated question (e.g. coding, math, general knowledge), politely decline and state that you are only trained to assist with Kesari Atelier spa and salon inquiries.
"""

# Load environment variables from env file if it exists
if os.path.exists(".env"):
    with open(".env") as f:
        for line in f:
            if line.strip() and not line.startswith("#"):
                parts = line.strip().split("=", 1)
                if len(parts) == 2:
                    os.environ[parts[0].strip()] = parts[1].strip()

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if GENAI_AVAILABLE and GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Password Hashing Helpers
def hash_password(password: str) -> str:
    salt = secrets.token_hex(8)
    hash_val = hashlib.sha256((password + salt).encode()).hexdigest()
    return f"{salt}${hash_val}"

def verify_password(password: str, hashed: str) -> bool:
    try:
        salt, hash_val = hashed.split("$")
        check_val = hashlib.sha256((password + salt).encode()).hexdigest()
        return secrets.compare_digest(hash_val, check_val)
    except Exception:
        return False

# Seed default admin & staff users on startup if not present
db_seed = SessionLocal()
try:
    admin_email = "admin@kesariatelier.in"
    admin_user = db_seed.query(models.User).filter(models.User.email == admin_email).first()
    if not admin_user:
        hashed_pwd = hash_password("KA")
        default_admin = models.User(
            name="Spa Administrator",
            email=admin_email,
            hashed_password=hashed_pwd,
            is_admin=True,
            is_staff=True
        )
        db_seed.add(default_admin)
        db_seed.commit()
        print("Admin user seeded successfully!")
    else:
        print("Admin user already seeded.")

    staff_email = "staff@kesariatelier.in"
    staff_user = db_seed.query(models.User).filter(models.User.email == staff_email).first()
    if not staff_user:
        hashed_pwd = hash_password("KA")
        default_staff = models.User(
            name="Spa Staff Representative",
            email=staff_email,
            hashed_password=hashed_pwd,
            is_admin=False,
            is_staff=True
        )
        db_seed.add(default_staff)
        db_seed.commit()
        print("Staff user seeded successfully!")
    else:
        print("Staff user already seeded.")
except Exception as e:
    print(f"Error seeding default roles: {e}")
finally:
    db_seed.close()

# API ROOT HEALTH CHECK
@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "Udaipur Royal Wellness Backend"}

# AUTHENTICATION ROUTING
@app.post("/api/auth/signup", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )
    
    hashed_pwd = hash_password(user.password)
    new_user = models.User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_pwd
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/api/auth/login", response_model=schemas.UserResponse)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not db_user or not verify_password(credentials.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password credentials."
        )
    return db_user

# BOOKINGS ROUTING
@app.get("/api/bookings", response_model=List[schemas.BookingResponse])
def get_bookings(userId: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(models.Booking)
    if userId is not None:
        query = query.filter(models.Booking.user_id == userId)
    bookings = query.order_by(models.Booking.created_at.desc()).all()
    return bookings

@app.post("/api/bookings", response_model=schemas.BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    db_booking = models.Booking(
        user_id=booking.user_id,
        first_name=booking.first_name,
        last_name=booking.last_name,
        service=booking.service,
        date=booking.date,
        time=booking.time,
        phone=booking.phone,
        special_requests=booking.special_requests
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

@app.delete("/api/bookings/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    db_booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not db_booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reservation with ID {booking_id} not found."
        )
    db.delete(db_booking)
    db.commit()
    return None

@app.put("/api/bookings/{booking_id}/status", response_model=schemas.BookingResponse)
def update_booking_status(booking_id: int, update: schemas.BookingStatusUpdate, db: Session = Depends(get_db)):
    db_booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not db_booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reservation with ID {booking_id} not found."
        )
    db_booking.status = update.status
    db_booking.rejection_message = update.rejection_message
    db.commit()
    db.refresh(db_booking)
    return db_booking

# ORDERS / BOUTIQUE CART
@app.post("/api/orders", response_model=schemas.OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    # Serialize list of cart items to a JSON string for SQLite storage
    serialized_items = json.dumps([item.model_dump() for item in order.items])
    
    db_order = models.Order(
        user_id=order.user_id,
        total_price=order.total_price,
        items=serialized_items
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

# AI CONSULTATION ADVISOR
@app.post("/api/ai-consultation", response_model=schemas.AIConsultationResponse)
def ai_consultation(request: schemas.AIConsultationRequest):
    try:
        prescription = generate_prescription(
            name=request.name,
            goal=request.goal,
            skin_type=request.skinType,
            duration=request.duration
        )
        return prescription
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating consultation: {str(e)}"
        )

# CHAT CONCIERGE: AI HELPER & 1-TO-1 STAFF CHAT
@app.post("/api/chat/ai")
def chat_ai(request: schemas.AIChatRequest):
    message = request.message
    
    if GENAI_AVAILABLE and GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel(
                model_name="gemini-2.5-flash",
                system_instruction=SYSTEM_INSTRUCTION
            )
            chat = model.start_chat(history=[])
            response = chat.send_message(message)
            return {"reply": response.text}
        except Exception as e:
            print(f"Gemini API Error: {e}")
            
    # Local fallback logic if Gemini is unavailable
    msg = message.lower()
    if "price" in msg or "cost" in msg or "how much" in msg:
        reply = "Khammaghani! Our experiences start at ₹2,400 up to ₹24,000. What service may we book for you?"
    elif "hour" in msg or "time" in msg or "open" in msg:
        reply = "Khammaghani! We are open daily from 9:00 AM to 8:00 PM."
    elif "contact" in msg or "phone" in msg or "call" in msg or "email" in msg:
        reply = "Khammaghani! Reach us at +91 94141 00000 or hello@kesariatelier.in."
    elif "location" in msg or "where" in msg or "address" in msg:
        reply = "Khammaghani! We are located at Lake Pichola and the City Palace Wing in Udaipur."
    elif "spa" in msg or "massage" in msg:
        reply = "Khammaghani! Our signature Royal Spa Retreat is ₹8,500, managed by Rekha Sharma."
    elif "bridal" in msg or "wedding" in msg:
        reply = "Khammaghani! Elite Bridal Grooming starts at ₹45,000, led by Vandana Sisodia."
    else:
        reply = "Khammaghani! Welcome to Kesari Atelier. How may I assist you today?"
        
    return {"reply": reply}

def simulate_staff_reply(user_id: int, user_message: str):
    # Wait for 3 seconds to simulate typing delay
    time.sleep(3)
    
    db = SessionLocal()
    try:
        msg_lower = user_message.lower()
        if "bridal" in msg_lower or "wedding" in msg_lower or "makeup" in msg_lower:
            reply = "Khammaghani! Vandana Sisodia, our bridal specialist, will get to you soon."
        elif "massage" in msg_lower or "spa" in msg_lower or "steam" in msg_lower or "detox" in msg_lower or "ayurvedic" in msg_lower:
            reply = "Khammaghani! Rekha Sharma, our Ayurvedic specialist, will get to you soon."
        elif "hair" in msg_lower or "cut" in msg_lower or "style" in msg_lower or "wash" in msg_lower:
            reply = "Khammaghani! Arjun Mehta, our hair specialist, will get to you soon."
        elif "skin" in msg_lower or "mehndi" in msg_lower or "nail" in msg_lower or "fresco" in msg_lower:
            reply = "Khammaghani! Pushpa Rathore, our skin & mehndi specialist, will get to you soon."
        else:
            reply = "Khammaghani! Vandana Sisodia, our concierge manager, will get to you soon."
            
        db_reply = models.ChatMessage(
            user_id=user_id,
            sender='staff',
            message=reply
        )
        db.add(db_reply)
        db.commit()
        print(f"Simulated staff reply sent to user {user_id}")
    except Exception as e:
        print(f"Error simulating staff reply: {e}")
    finally:
        db.close()

@app.get("/api/chat/staff", response_model=List[schemas.ChatMessageResponse])
def get_staff_messages(userId: Optional[int] = None, db: Session = Depends(get_db)):
    if userId is None:
        return []
    messages = db.query(models.ChatMessage).filter(models.ChatMessage.user_id == userId).order_by(models.ChatMessage.timestamp.asc()).all()
    return messages

@app.post("/api/chat/staff", response_model=schemas.ChatMessageResponse, status_code=status.HTTP_201_CREATED)
def create_staff_message(msg: schemas.ChatMessageCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    db_msg = models.ChatMessage(
        user_id=msg.user_id,
        sender=msg.sender,
        message=msg.message
    )
    db.add(db_msg)
    db.commit()
    db.refresh(db_msg)
    
    if msg.sender == "user":
        background_tasks.add_task(simulate_staff_reply, msg.user_id, msg.message)
        
    return db_msg

# ADMIN SYSTEM ENDPOINTS
@app.get("/api/admin/users", response_model=List[schemas.UserResponse])
def admin_get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).order_by(models.User.created_at.desc()).all()
    return users

@app.get("/api/admin/bookings", response_model=List[schemas.BookingResponse])
def admin_get_bookings(db: Session = Depends(get_db)):
    bookings = db.query(models.Booking).order_by(models.Booking.created_at.desc()).all()
    return bookings

@app.get("/api/admin/orders", response_model=List[schemas.OrderResponse])
def admin_get_orders(db: Session = Depends(get_db)):
    orders = db.query(models.Order).order_by(models.Order.created_at.desc()).all()
    return orders

@app.get("/api/admin/chats")
def admin_get_chats(db: Session = Depends(get_db)):
    messages = db.query(models.ChatMessage).order_by(models.ChatMessage.timestamp.asc()).all()
    user_ids = list(set(m.user_id for m in messages if m.user_id is not None))
    users = db.query(models.User).filter(models.User.id.in_(user_ids)).all()
    users_map = {u.id: u for u in users}
    
    user_chats = {}
    for m in messages:
        if m.user_id not in user_chats:
            user_chats[m.user_id] = []
        user_chats[m.user_id].append(m)
        
    result = []
    for uid, msgs in user_chats.items():
        user_rec = users_map.get(uid)
        if user_rec:
            result.append({
                "user": {
                    "id": user_rec.id,
                    "name": user_rec.name,
                    "email": user_rec.email
                },
                "lastMessage": msgs[-1].message,
                "lastTimestamp": msgs[-1].timestamp.isoformat(),
                "messages": [
                    {
                        "id": msg.id,
                        "sender": msg.sender,
                        "message": msg.message,
                        "timestamp": msg.timestamp.isoformat()
                    } for msg in msgs
                ]
            })
    # Sort by last timestamp desc
    result.sort(key=lambda x: x["lastTimestamp"], reverse=True)
    return result

@app.get("/api/admin/stats", response_model=schemas.AdminStatsResponse)
def admin_get_stats(db: Session = Depends(get_db)):
    total_users = db.query(models.User).count()
    total_bookings = db.query(models.Booking).count()
    
    orders = db.query(models.Order).all()
    boutique_revenue = sum(o.total_price for o in orders)
    
    SERVICE_PRICES = {
        "Royal Spa Retreats": 8500,
        "Royal Spa Retreat": 8500,
        "Heritage Salon": 3200,
        "Elite Bridal Grooming": 45000,
        "Elite Bridal Grooming (Pichola Bride)": 45000,
        "Wellness Alchemy": 5500,
        "Luminosity Facials": 6800,
        "Haute Nail Atelier": 2400,
        "Maharani Day Journey": 24000
    }
    bookings = db.query(models.Booking).all()
    estimated_booking_value = 0
    for b in bookings:
        price = SERVICE_PRICES.get(b.service, 5000)
        estimated_booking_value += price
        
    import datetime
    daily_rev = {}
    for o in orders:
        d_str = o.created_at.strftime("%b %d")
        daily_rev[d_str] = daily_rev.get(d_str, 0) + o.total_price
        
    revenue_history = []
    for i in range(6, -1, -1):
        dt = datetime.datetime.utcnow() - datetime.timedelta(days=i)
        d_str = dt.strftime("%b %d")
        base_val = daily_rev.get(d_str, 0)
        if boutique_revenue == 0:
            import random
            random.seed(i)
            base_val = random.randint(1000, 5000)
        revenue_history.append({
            "date": d_str,
            "amount": base_val
        })
        
    counts = {}
    for b in bookings:
        srv = b.service
        if "Spa" in srv: srv = "Royal Spa"
        elif "Salon" in srv: srv = "Heritage Salon"
        elif "Bridal" in srv: srv = "Bridal Grooming"
        elif "Wellness" in srv: srv = "Wellness Alchemy"
        elif "Facial" in srv: srv = "Luminosity Facial"
        elif "Nail" in srv: srv = "Nail Atelier"
        counts[srv] = counts.get(srv, 0) + 1
        
    bookings_by_category = [{"category": k, "count": v} for k, v in counts.items()]
    if not bookings_by_category:
        bookings_by_category = [
            {"category": "Royal Spa", "count": 2},
            {"category": "Heritage Salon", "count": 5},
            {"category": "Bridal Grooming", "count": 1},
            {"category": "Luminosity Facial", "count": 4}
        ]
        
    return {
        "totalUsers": total_users,
        "totalBookings": total_bookings,
        "boutiqueRevenue": boutique_revenue,
        "estimatedBookingValue": estimated_booking_value,
        "revenueHistory": revenue_history,
        "bookingsByCategory": bookings_by_category
    }
