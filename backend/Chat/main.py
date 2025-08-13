# chat_main.py
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import google.generativeai as genai
from sqlalchemy.orm import Session
from Authentication.database import get_session
from fastapi.security import OAuth2PasswordBearer
from Authentication import models 
from Chat.models import Conversation
from config import JWT_SECRET_KEY, ALGORITHM, GEMINI_API_KEY
from jose import JWTError, jwt
from typing import List, Optional
from datetime import datetime
from .database import Base, engine, LocalSession

#database initialization
Base.metadata.create_all(engine)  
def get_session():
    """Dependency to get a database session."""
    db = LocalSession()
    try:
        yield db
        print('Session up')
    finally:
        db.close()
        print('Session closed')


# Load environment
load_dotenv()

app = FastAPI(title="Chat Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8000", 
        "http://localhost:8001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="http://localhost:8000/auth/login")

# Configure Gemini
print(f"Configuring Gemini with API key: {GEMINI_API_KEY[:10]}...")
genai.configure(api_key=GEMINI_API_KEY)

# Initialize model
try:
    model = genai.GenerativeModel('gemini-1.5-flash')
    print("Gemini model initialized successfully")
except Exception as e:
    print(f"Failed to initialize Gemini: {e}")
    model = None

# Pydantic models
class ChatInput(BaseModel):
    input: str

class ConversationResponse(BaseModel):
    id: int
    user_input: str
    ai_output: str
    timestamp: datetime
    
    class Config:
        from_attributes = True

class ChatHistoryResponse(BaseModel):
    conversations: List[ConversationResponse]
    total_count: int

# Authentication
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_session)):
    print(f"Verifying token...")
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError as e:
        print(f"JWT Error: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    print(f"User authenticated: {user.username}")
    return user

# Chat endpoints
@app.post("/chat/input")
async def chat_input(
    chat_input: ChatInput, 
    db: Session = Depends(get_session), 
    current_user: models.User = Depends(get_current_user)
):
    if not model:
        raise HTTPException(status_code=500, detail="AI model not available")
    
   
        print(f"Processing chat for user: {current_user.username}")
        print(f"Input: {chat_input.input}")

        #fallback
        ai_response = "AI model is currently unavailable. Please try again later."
    try:    
        # Generate AI response
        prompt = f"You are a helpful AI assistant. User question: {chat_input.input}"
        response = model.generate_content(prompt)
        ai_response = response.text.strip() if response.text else "No response generated"
        
        print(f"AI Response: {ai_response[:100]}...")

        # Save conversation
        conversation = Conversation(
            user_id=current_user.id,
            user_input=chat_input.input,
            ai_output=ai_response,
            timestamp=datetime.utcnow()
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)

        return {
            "output": ai_response,
            "conversation_id": conversation.id,
            "timestamp": conversation.timestamp
        }
            
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")
    
   
    conversation = Conversation(
        user_id=current_user.id,
        user_input=chat_input.input,
        ai_output=ai_response,
        timestamp=datetime.utcnow()
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    print(f"Conversation saved with ID: {conversation.id}")
    return {
        "output": ai_response,
        "conversation_id": conversation.id,
        "timestamp": conversation.timestamp
    }

@app.get("/chat/history", response_model=ChatHistoryResponse)
async def get_chat_history(
    skip: int = 0, 
    limit: int = 50, 
    db: Session = Depends(get_session), 
    current_user: models.User = Depends(get_current_user)
):
    """Get paginated chat history for current user"""
    total_count = db.query(Conversation).filter(
        Conversation.user_id == current_user.id
    ).count()
    
    conversations = db.query(Conversation).filter(
        Conversation.user_id == current_user.id
    ).order_by(Conversation.timestamp.desc()).offset(skip).limit(limit).all()
    
    return ChatHistoryResponse(
        conversations=conversations,
        total_count=total_count
    )

@app.get("/chat/conversation/{conversation_id}")
async def get_conversation(
    conversation_id: int,
    db: Session = Depends(get_session),
    current_user: models.User = Depends(get_current_user)
):
    """Get specific conversation"""
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return conversation

@app.delete("/chat/conversation/{conversation_id}")
async def delete_conversation(
    conversation_id: int,
    db: Session = Depends(get_session),
    current_user: models.User = Depends(get_current_user)
):
    """Delete specific conversation"""
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    db.delete(conversation)
    db.commit()
    
    return {"message": "Conversation deleted successfully"}

@app.delete("/chat/history/clear")
async def clear_chat_history(
    db: Session = Depends(get_session),
    current_user: models.User = Depends(get_current_user)
):
    """Clear all chat history"""
    deleted_count = db.query(Conversation).filter(
        Conversation.user_id == current_user.id
    ).delete()
    
    db.commit()
    return {"message": f"Deleted {deleted_count} conversations"}

@app.get("/chat/search")
async def search_conversations(
    query: str,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_session),
    current_user: models.User = Depends(get_current_user)
):
    """Search chat history"""
    conversations = db.query(Conversation).filter(
        Conversation.user_id == current_user.id,
        (Conversation.user_input.contains(query) | 
         Conversation.ai_output.contains(query))
    ).order_by(Conversation.timestamp.desc()).offset(skip).limit(limit).all()
    
    return {"conversations": conversations, "query": query}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "ai_service": "Gemini",
        "model_available": model is not None
    }

# Debug endpoints
@app.get("/debug/config")
async def debug_config():
    return {
        "JWT_SECRET_KEY_set": bool(JWT_SECRET_KEY),
        "ALGORITHM": ALGORITHM,
        "GEMINI_API_KEY_set": bool(GEMINI_API_KEY),
        "model_initialized": model is not None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)