from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# USER SCHEMAS
class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    is_admin: bool = Field(False, alias="isAdmin")
    is_staff: bool = Field(False, alias="isStaff")
    created_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True

# BOOKINGS
class BookingBase(BaseModel):
    user_id: Optional[int] = Field(None, alias="userId")
    first_name: str = Field(..., alias="firstName")
    last_name: Optional[str] = Field(None, alias="lastName")
    service: str
    date: str
    time: str
    phone: str
    special_requests: Optional[str] = Field(None, alias="specialRequests")

    class Config:
        populate_by_name = True

class BookingCreate(BookingBase):
    pass

class BookingResponse(BookingBase):
    id: int
    status: str = "Pending"
    rejection_message: Optional[str] = Field(None, alias="rejectionMessage")
    created_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True

class BookingStatusUpdate(BaseModel):
    status: str
    rejection_message: Optional[str] = Field(None, alias="rejectionMessage")

    class Config:
        populate_by_name = True

# CART ORDERS
class CartItem(BaseModel):
    id: str
    brand: str
    name: str
    price: int
    quantity: int
    img: Optional[str] = None

class OrderCreate(BaseModel):
    user_id: Optional[int] = Field(None, alias="userId")
    total_price: int = Field(..., alias="totalPrice")
    items: List[CartItem]

    class Config:
        populate_by_name = True

class OrderResponse(BaseModel):
    id: int
    user_id: Optional[int] = Field(None, alias="userId")
    total_price: int = Field(..., alias="totalPrice")
    items: str # JSON representation of items
    created_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True

# AI CONSULTATION
class AIConsultationRequest(BaseModel):
    name: str
    goal: str
    skinType: str
    duration: str

class ServiceOffer(BaseModel):
    id: str
    name: str
    price: int
    details: str

class ProductOffer(BaseModel):
    id: str
    brand: str
    name: str
    price: int
    img: str

class AIConsultationResponse(BaseModel):
    description: str
    services: List[ServiceOffer]
    products: List[ProductOffer]

# CHAT SYSTEM
class AIChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = None

class ChatMessageCreate(BaseModel):
    user_id: Optional[int] = Field(None, alias="userId")
    sender: str
    message: str

    class Config:
        populate_by_name = True

class ChatMessageResponse(BaseModel):
    id: int
    user_id: Optional[int] = Field(None, alias="userId")
    sender: str
    message: str
    timestamp: datetime

    class Config:
        from_attributes = True
        populate_by_name = True

# ADMIN STATS SCHEMAS
class AdminStatsResponse(BaseModel):
    total_users: int = Field(..., alias="totalUsers")
    total_bookings: int = Field(..., alias="totalBookings")
    boutique_revenue: int = Field(..., alias="boutiqueRevenue")
    estimated_booking_value: int = Field(..., alias="estimatedBookingValue")
    revenue_history: List[dict] = Field(..., alias="revenueHistory")
    bookings_by_category: List[dict] = Field(..., alias="bookingsByCategory")

    class Config:
        populate_by_name = True

# AI OCCASION PLANNER
class OccasionPlannerRequest(BaseModel):
    prompt: str

