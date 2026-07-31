from typing import Any

from fastapi import APIRouter
from sqlalchemy import func, select, text

from app.core.database import SessionLocal, engine
from app.models.assessment import Assessment
from app.models.user import User

router = APIRouter()


@router.get("/users")
async def list_users() -> list[dict[str, Any]]:
    async with SessionLocal() as db:
        result = await db.execute(
            select(User, func.count(Assessment.id).label("assessment_count"))
            .outerjoin(Assessment, Assessment.user_id == User.id)
            .group_by(User.id)
            .order_by(User.created_at.desc())
        )

        users = []
        for user, assessment_count in result.all():
            users.append(
                {
                    "id": str(user.id),
                    "name": user.name,
                    "email": user.email,
                    "provider": "Google" if user.google_id else "Email",
                    "profile_picture": user.profile_picture,
                    "registered_at": user.created_at.isoformat() if user.created_at else None,
                    "assessment_count": assessment_count,
                    "status": "Active" if user.is_active else "Inactive",
                }
            )

        return users


@router.get("/database-status")
async def database_status() -> dict[str, Any]:
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        return {"connected": True, "status": "connected"}
    except Exception as exc:
        return {"connected": False, "status": "disconnected", "detail": str(exc)}
