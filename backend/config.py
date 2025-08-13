# config.py
import os
import secrets
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from typing import Union, Any
from jose import jwt, JWTError
from fastapi import APIRouter, HTTPException

# API Configuration
GEMINI_API_KEY = "AIzaSyCdT-w7KvzwNdcjz-x8IucAcaBZBXaxWEU"

# JWT Configuration - FIXED: Use consistent keys
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7
ALGORITHM = "HS256"

# Use fixed secret keys instead of random ones
JWT_SECRET_KEY = "your-super-secret-jwt-key-keep-this-safe-and-consistent"
JWT_REFRESH_SECRET_KEY = "your-super-secret-refresh-key-keep-this-safe-and-consistent"

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_hashed_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)

def verify_password(password: str, hashed_password: str) -> bool:
    """Verify a password against a hashed password."""
    return pwd_context.verify(password, hashed_password)

def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    """Create a JWT access token."""
    if expires_delta is not None:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Use integer timestamp instead of float for better compatibility
    to_encode = {"exp": int(expire.timestamp()), "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

    #debug auth issue
    print("UTC Now:", datetime.utcnow())
    print("Unix Time:", int(datetime.utcnow().timestamp()))


def create_refresh_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    """Create a JWT refresh token."""
    if expires_delta is not None:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode = {"exp": int(expire.timestamp()), "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, JWT_REFRESH_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str, secret_key: str) -> Union[str, None]:
    """Verify and decode JWT token."""
    try:
        payload = jwt.decode(token, secret_key, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
        return username
    except JWTError:
        return None

def verify_access_token(token: str) -> Union[str, None]:
    """Verify access token."""
    return verify_token(token, JWT_SECRET_KEY)

def verify_refresh_token(token: str) -> Union[str, None]:
    """Verify refresh token."""
    return verify_token(token, JWT_REFRESH_SECRET_KEY)

router = APIRouter()

@router.post("/refresh")
def refresh_access_token(refresh_token: str):
    username = verify_refresh_token(refresh_token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    new_access_token = create_access_token(
        subject=username, expires_delta=access_token_expires
    )
    return {"access_token": new_access_token}