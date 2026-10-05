from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.database import get_db
from app.models.assessment import Assessment
from app.models.user import User
from app.schemas.assessment import AssessmentCreate, AssessmentResponse


router = APIRouter()

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


def label_score(label: str | None, score_map: dict[str, int]) -> float | None:
    if not label:
        return None
    return float(score_map.get(label, 45))


def build_modalities_payload(payload: AssessmentCreate) -> dict[str, Any]:
    return {
        "used": payload.modalities_used,
        "mental": payload.mental.model_dump() if payload.mental else None,
        "facial": payload.facial.model_dump() if payload.facial else None,
        "recommendation": payload.recommendation,
    }


@router.post("", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
async def create_assessment(
    payload: AssessmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Assessment:
    assessment = Assessment(
        user_id=current_user.id,
        behavioural_score=label_score(payload.mental.label if payload.mental else None, RISK_SCORE),
        behavioural_confidence=payload.mental.confidence if payload.mental else None,
        facial_score=label_score(payload.facial.label if payload.facial else None, FACE_SCORE),
        facial_confidence=payload.facial.confidence if payload.facial else None,
        final_score=payload.final_score,
        overall_confidence=payload.overall_confidence,
        risk_level=payload.risk_level,
        modalities_used=build_modalities_payload(payload),
    )

    db.add(assessment)
    await db.commit()
    await db.refresh(assessment)
    return assessment


@router.get("/me", response_model=list[AssessmentResponse])
async def list_my_assessments(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> list[Assessment]:
    result = await db.execute(
        select(Assessment)
        .filter(Assessment.user_id == current_user.id)
        .order_by(Assessment.created_at.desc())
    )
    return list(result.scalars().all())


@router.get("/{assessment_id}", response_model=AssessmentResponse)
async def get_assessment(
    assessment_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Assessment:
    result = await db.execute(select(Assessment).filter(Assessment.id == assessment_id))
    assessment = result.scalars().first()

    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    if assessment.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    return assessment
