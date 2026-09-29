from sqlalchemy import Column, String, Float, DateTime, Text, JSON
from sqlalchemy.orm import declarative_base
from pgvector.sqlalchemy import Vector

Base = declarative_base()

class Item(Base):
    __tablename__ = 'items'

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    creator = Column(String, nullable=True)
    date = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    subject = Column(String, nullable=True)
    language = Column(String, nullable=True)
    rights = Column(String, nullable=True)
    source = Column(String, nullable=True)
    identifier = Column(String, nullable=True)
    collection = Column(String, nullable=True)
    location = Column(String, nullable=True)
    
    # Use JSON for arrays in Postgres/SQLite
    people = Column(JSON, nullable=True)
    places = Column(JSON, nullable=True)
    topics = Column(JSON, nullable=True)
    related_constitution_articles = Column(JSON, nullable=True)
    
    provenance = Column(String, nullable=True)
    rights_status = Column(String, nullable=False)
    ocr_confidence = Column(Float, nullable=True)
    digitization_date = Column(DateTime, nullable=True)
    checksum_sha256 = Column(String, nullable=True)
    embedding = Column(Vector(384)) # Using 384-d embeddings (e.g. all-MiniLM-L6-v2)

