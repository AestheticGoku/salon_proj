import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)
    is_admin = Column(Boolean, default=False)
    is_staff = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)  # Optional link to User
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=True)
    service = Column(String(200), nullable=False)
    date = Column(String(50), nullable=False)
    time = Column(String(50), nullable=False)
    phone = Column(String(30), nullable=False)
    special_requests = Column(Text, nullable=True)
    status = Column(String(50), default="Pending")
    rejection_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)  # Optional link to User
    total_price = Column(Integer, nullable=False)
    items = Column(Text, nullable=False)  # JSON serialized array of products
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True) # Optional link to registered user
    sender = Column(String(50), nullable=False) # 'user' or 'staff'
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
