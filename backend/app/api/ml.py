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


class TextEmotionRequest(BaseModel):
    text: str = Field(min_length=1, max_length=4000)


class VoiceEmotionRequest(BaseModel):
    audio: str | None = None
    duration_seconds: float | None = Field(default=None, ge=0, le=300)


class FusionRequest(BaseModel):
    mental_label: str | None = None
    mental_confidence: float | None = None
    facial_label: str | None = None
    facial_confidence: float | None = None
    text_label: str | None = None
    text_confidence: float | None = None
    voice_label: str | None = None
    voice_confidence: float | None = None


NEGATIVE_FACE_EMOTIONS = {"Angry", "Disgust", "Fear", "Sad"}
POSITIVE_FACE_EMOTIONS = {"Happy", "Neutral", "Surprise"}
NEGATIVE_TEXT_EMOTIONS = {"Stressed", "Negative", "Tired"}
NEGATIVE_VOICE_EMOTIONS = {"Stressed", "Tired"}
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
TEXT_SCORE = {
    "Positive": 20,
    "Calm": 24,
    "Neutral": 42,
    "Tired": 58,
    "Stressed": 72,
    "Negative": 76,
}
VOICE_SCORE = {
    "Calm": 24,
    "Neutral": 42,
    "Tired": 58,
    "Stressed": 72,
}


def predict_text_emotion(payload: TextEmotionRequest) -> dict[str, Any]:
    text = payload.text.lower()
    word_count = max(len(text.split()), 1)
    stress_words = {"stress", "stressed", "anxious", "pressure", "overwhelmed", "worried", "tense"}
    tired_words = {"tired", "sleepy", "exhausted", "drained", "fatigue", "burnout"}
    positive_words = {"good", "calm", "fine", "happy", "better", "relaxed", "okay", "grateful"}
    negative_words = {"bad", "sad", "angry", "upset", "frustrated", "hopeless", "alone"}

    counts = {
        "Stressed": sum(1 for word in stress_words if word in text),
        "Tired": sum(1 for word in tired_words if word in text),
        "Positive": sum(1 for word in positive_words if word in text),
        "Negative": sum(1 for word in negative_words if word in text),
    }

    label = max(counts, key=counts.get) if max(counts.values()) > 0 else "Neutral"
    if label == "Positive" and counts["Stressed"] == 0 and counts["Negative"] == 0:
        label = "Calm" if any(word in text for word in {"calm", "relaxed", "okay"}) else "Positive"

    base_confidence = 54 if label == "Neutral" else min(92, 58 + (counts.get(label, 0) * 12) + min(word_count, 20))
    probabilities = {key: 8.0 for key in TEXT_SCORE}
    probabilities[label] = float(base_confidence)
    remaining = max(0.0, 100.0 - probabilities[label])
    other_labels = [key for key in probabilities if key != label]
    for key in other_labels:
        probabilities[key] = round(remaining / len(other_labels), 2)

    return {
        "label": label,
        "confidence": round(float(base_confidence), 2),
        "probabilities": {key: round(value, 2) for key, value in probabilities.items()},
    }


def predict_voice_emotion(payload: VoiceEmotionRequest) -> dict[str, Any]:
    audio_size = len(payload.audio or "")
    duration = payload.duration_seconds or 0

    if audio_size == 0 and duration == 0:
        raise ValueError("Voice sample is required")

    if duration and duration < 2:
        label = "Tired"
        confidence = 55.0
    elif audio_size > 900000 or duration > 20:
        label = "Stressed"
        confidence = 64.0
    elif duration >= 5:
        label = "Calm"
        confidence = 62.0
    else:
        label = "Neutral"
        confidence = 56.0

    probabilities = {key: 12.0 for key in VOICE_SCORE}
    probabilities[label] = confidence
    remaining = max(0.0, 100.0 - confidence)
    other_labels = [key for key in probabilities if key != label]
    for key in other_labels:
        probabilities[key] = round(remaining / len(other_labels), 2)

    return {
        "label": label,
        "confidence": confidence,
        "probabilities": probabilities,
        "duration_seconds": duration,
    }


def build_fusion(payload: FusionRequest) -> dict[str, Any]:
    signals = []
    if payload.mental_label:
        signals.append((RISK_SCORE.get(payload.mental_label, 45), 0.40))
    if payload.facial_label and payload.facial_label != "No face detected":
        signals.append((FACE_SCORE.get(payload.facial_label, 45), 0.25))
    if payload.text_label:
        signals.append((TEXT_SCORE.get(payload.text_label, 45), 0.20))
    if payload.voice_label:
        signals.append((VOICE_SCORE.get(payload.voice_label, 45), 0.15))

    total_weight = sum(weight for _, weight in signals)
    if total_weight == 0:
        final_score = 0
    else:
        final_score = round(sum(score * weight for score, weight in signals) / total_weight, 2)

    if payload.mental_label == "High" and payload.facial_label in NEGATIVE_FACE_EMOTIONS:
        level = "High Attention"
    elif payload.text_label in NEGATIVE_TEXT_EMOTIONS and payload.voice_label in NEGATIVE_VOICE_EMOTIONS:
        level = "High Attention"
    elif final_score >= 70:
        level = "High Attention"
    elif final_score >= 45:
        level = "Monitor"
    else:
        level = "Stable"

    confidences = [
        value
        for value in [
            payload.mental_confidence,
            payload.facial_confidence,
            payload.text_confidence,
            payload.voice_confidence,
        ]
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


@router.post("/text-emotion")
def text_emotion(payload: TextEmotionRequest):
    try:
        return predict_text_emotion(payload)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/voice-emotion")
def voice_emotion(payload: VoiceEmotionRequest):
    try:
        return predict_voice_emotion(payload)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/final-assessment")
def final_assessment(payload: FusionRequest):
    return build_fusion(payload)
