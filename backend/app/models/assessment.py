from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    
    behavioural_score = Column(Float, nullable=True)
    behavioural_confidence = Column(Float, nullable=True)
    
    text_score = Column(Float, nullable=True)
    text_confidence = Column(Float, nullable=True)
    
    facial_score = Column(Float, nullable=True)
    facial_confidence = Column(Float, nullable=True)
    
    voice_score = Column(Float, nullable=True)
    voice_confidence = Column(Float, nullable=True)
    
    final_score = Column(Float, nullable=True)
    overall_confidence = Column(Float, nullable=True)
    risk_level = Column(String, nullable=True)
    modalities_used = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

class QuestionnaireSession(Base):
    __tablename__ = "questionnaire_sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("assessments.id"), nullable=False)
    answers = Column(JSON, nullable=False)
    score = Column(Float, nullable=True)

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("assessments.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    session_id = Column(UUID(as_uuid=True), ForeignKey("chat_sessions.id"), nullable=False)
    sender = Column(String, nullable=False) # 'user' or 'ai'
    text = Column(String, nullable=False)
    emotion_label = Column(String, nullable=True)
    score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class FacialAnalysis(Base):
    __tablename__ = "facial_analyses"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("assessments.id"), nullable=False)
    aggregated_score = Column(Float, nullable=True)
    emotion_label = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)

class VoiceAnalysis(Base):
    __tablename__ = "voice_analyses"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("assessments.id"), nullable=False)
    aggregated_score = Column(Float, nullable=True)
    emotion_label = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)
