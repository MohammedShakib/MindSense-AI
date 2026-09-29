from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.ml.facial_emotion import predict_facial_emotion
from app.ml.mental_risk import mental_options, predict_mental_risk


router = APIRouter()


class MentalRiskRequest(BaseModel):
    gender: str
    age: int = Field(ge=1, le=100)
    occupation: str
    bmi_category: str
    sleep_duration: float = Field(ge=1, le=15)
    sleep_quality: int = Field(ge=1, le=10)
    physical_activity: int = Field(ge=0, le=240)
    stress_level: int = Field(ge=1, le=10)
    heart_rate: int = Field(ge=40, le=180)
    daily_steps: int = Field(ge=0, le=50000)
    systolic_bp: int = Field(ge=80, le=220)
    diastolic_bp: int = Field(ge=40, le=140)


class FacialEmotionRequest(BaseModel):
    image: str


class FusionRequest(BaseModel):
    mental_label: str | None = None
    mental_confidence: float | None = None
    facial_label: str | None = None
    facial_confidence: float | None = None


NEGATIVE_FACE_EMOTIONS = {"Angry", "Disgust", "Fear", "Sad"}
POSITIVE_FACE_EMOTIONS = {"Happy", "Neutral", "Surprise"}
RISK_SCORE = {"Low": 25, "Medium": 58, "High": 82}
FACE_SCORE = {
    "Happy": 18,
    "Neutral": 28,
    "Surprise": 42,
    "Sad": 68,
    "Fear": 74,
    "Angry": 78,
    "Disgust": 72,
}


def build_fusion(payload: FusionRequest) -> dict[str, Any]:
    mental_score = RISK_SCORE.get(payload.mental_label or "", 45)
    face_score = FACE_SCORE.get(payload.facial_label or "", 45)
    mental_weight = 0.65 if payload.mental_label else 0
    face_weight = 0.35 if payload.facial_label and payload.facial_label != "No face detected" else 0
    total_weight = mental_weight + face_weight

    if total_weight == 0:
        final_score = 0
    else:
        final_score = round(((mental_score * mental_weight) + (face_score * face_weight)) / total_weight, 2)

    if payload.mental_label == "High" and payload.facial_label in NEGATIVE_FACE_EMOTIONS:
        level = "High Attention"
    elif final_score >= 70:
        level = "High Attention"
    elif final_score >= 45:
        level = "Monitor"
    else:
        level = "Stable"

    confidences = [
        value
        for value in [payload.mental_confidence, payload.facial_confidence]
        if value is not None and value > 0
    ]
    overall_confidence = round(sum(confidences) / len(confidences), 2) if confidences else 0

    if level == "High Attention":
        recommendation = "Stress and expression signals are elevated. Pause, rest, and consider support if this persists."
    elif level == "Monitor":
        recommendation = "Some signals need attention. Improve sleep, reduce stress load, and reassess later."
    else:
        recommendation = "Signals look steady. Keep the current routine and track again when needed."

    return {
        "score": final_score,
        "level": level,
        "confidence": overall_confidence,
        "recommendation": recommendation,
    }


@router.get("/mental-risk/options")
def get_mental_options():
    try:
        return mental_options()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/mental-risk")
def mental_risk(payload: MentalRiskRequest):
    try:
        return predict_mental_risk(payload.model_dump())
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/facial-emotion")
def facial_emotion(payload: FacialEmotionRequest):
    try:
        return predict_facial_emotion(payload.image)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/final-assessment")
def final_assessment(payload: FusionRequest):
    return build_fusion(payload)
