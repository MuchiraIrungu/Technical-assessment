from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

#Postgresql connection
DATABASE_URL = "postgresql://postgres:<password>@localhost:5432/<your-database-name>"

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
