from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session, declarative_base
from .models import Conversation
from Authentication.models import User, TokenTable
from Authentication.database import Base, engine

Base.metadata.create_all(bind=engine, tables=[Conversation.__table__])

#Postgresql connection
DATABASE_URL = "postgresql://postgres:1122@localhost:5432/sms"

#PostgreSQL engine instance
engine = create_engine(DATABASE_URL)

#declarative base meta instance
Base = declarative_base()

#sssion local class
LocalSession = sessionmaker(bind=engine, expire_on_commit=False)


def get_session():
    db = LocalSession()
    try:
        yield db
    finally:
        db.close()



    
