from sqlalchemy import Column, Integer, String, DateTime, Boolean
from Authentication.database import Base
from sqlalchemy.orm import relationship
import datetime
from Chat.models import Conversation

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), nullable=True, unique=True)
    email = Column(String(100), nullable=False)
    contact = Column(Integer, nullable=False)
    password1 = Column(String(100), nullable=False)
    password2 = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")

class TokenTable(Base):
    __tablename__ = 'tokens'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    access_token = Column(String(255), nullable=False)
    refresh_token = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_active = Column(Boolean, default=True)  # To track if the token is still active