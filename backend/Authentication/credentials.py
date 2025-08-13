# auth_main.py
from Authentication import models
from Authentication import schemas
from datetime import datetime, timedelta, timezone 
from Authentication.models import User, TokenTable
from Authentication.database import Base, engine, LocalSession
from Authentication.authbearer import JWTBearer
from sqlalchemy.orm import Session
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from jose import jwt, JWTError
from config import (
    JWT_SECRET_KEY, 
    ALGORITHM, 
    create_access_token, 
    create_refresh_token, 
    verify_password, 
    get_hashed_password,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_DAYS
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Create tables
Base.metadata.create_all(engine)

def get_session():
    session = LocalSession()
    try:
        print('session has started')
        yield session
    finally:
        session.close()
        print('session has ended')

app = FastAPI(title="Authentication Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000", "http://localhost:8001"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

@app.post("/auth/register")
def register(user: schemas.UserCreate, session: Session = Depends(get_session)):
    existing_user = session.query(models.User).filter_by(username=user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User with given username already exists. Please try again")

    if user.password1 != user.password2:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    encrypted_password = get_hashed_password(user.password1)

    new_user = models.User(
        username=user.username,
        email=user.email,
        contact=user.contact,
        password1=encrypted_password,
        password2=encrypted_password
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return {"status_code": 200, "message": "User registered successfully"}

@app.post('/auth/login', response_model=schemas.TokenSchema)
def login(request: schemas.requestdetails, db: Session = Depends(get_session)):
    user = db.query(models.User).filter(models.User.username == request.username).first()

    if user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='User not found')

    hashed_pass = user.password1
    if not verify_password(request.password, hashed_pass):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Incorrect password')

    # Generate tokens
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    expires_at = datetime.now(timezone.utc) + access_token_expires

    access_token = create_access_token(user.username, expires_delta=access_token_expires)
    refresh_token = create_refresh_token(user.username)

    # Store token in database
    token_entry = models.TokenTable(
        user_id=user.id,
        access_token=access_token,
        refresh_token=refresh_token
    )

    db.add(token_entry)
    db.commit()
    db.refresh(token_entry)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_at": expires_at.isoformat()
    }

@app.get('/getusers')
def getusers(dependencies=Depends(JWTBearer()), session: Session = Depends(get_session)):
    user = session.query(models.User).all()
    return user

@app.post('/change-password')
def change_password(request: schemas.changepassword, db: Session = Depends(get_session)):
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User not found")
    
    if not verify_password(request.old_password, user.password1):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid old password")
    
    encrypted_password = get_hashed_password(request.new_password)
    user.password1 = encrypted_password
    user.password2 = encrypted_password
    db.commit()
    
    return {"message": "Password changed successfully"}

@app.post('/logout')
def logout(dependencies=Depends(JWTBearer()), db: Session = Depends(get_session)):
    token = dependencies
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload['sub']
        
        # Find and deactivate token
        existing_token = db.query(models.TokenTable).filter(
            models.TokenTable.user_id == user_id,
            models.TokenTable.access_token == token
        ).first()
        
        if existing_token:
            existing_token.status = False
            db.add(existing_token)
            db.commit()
            db.refresh(existing_token)
            
        return {"message": "Logout Successfully"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)