from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field


class AssessmentSignal(BaseModel):
    label: str | None = None
    confidence: float | None = None
    probabilities: dict[str, float] | None = None


class AssessmentCreate(BaseModel):
    mental: AssessmentSignal | None = None
    facial: AssessmentSignal | None = None
    text: AssessmentSignal | None = None
    voice: AssessmentSignal | None = None
    final_score: float = Field(ge=0, le=100)
    overall_confidence: float | None = Field(default=None, ge=0, le=100)
    risk_level: str
    recommendation: str | None = None
    modalities_used: list[str] = Field(default_factory=list)


class AssessmentResponse(BaseModel):
    id: UUID
    user_id: UUID
    behavioural_score: float | None = None
    behavioural_confidence: float | None = None
    text_score: float | None = None
    text_confidence: float | None = None
    facial_score: float | None = None
    facial_confidence: float | None = None
    voice_score: float | None = None
    voice_confidence: float | None = None
    final_score: float | None = None
    overall_confidence: float | None = None
    risk_level: str | None = None
    modalities_used: list[Any] | dict[str, Any] | None = None
    created_at: datetime

    class Config:
        from_attributes = True
