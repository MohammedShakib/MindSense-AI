from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api import admin, assessments, auth, ml
from app.core.config import settings
from app.core.database import Base, engine
from app.models import assessment, user  # noqa: F401

app = FastAPI(
    title="MindSense AI API",
    description="Backend for multimodal mental wellness assessment platform",
    version="1.0.0"
)

origins = [origin.strip() for origin in settings.BACKEND_CORS_ORIGINS.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(ml.router, prefix="/api/ml", tags=["ml"])
app.include_router(assessments.router, prefix="/api/assessments", tags=["assessments"])

@app.on_event("startup")
async def init_db():
    if settings.SECRET_KEY == "supersecretkey_please_change_in_production":
        print("WARNING: Using the default SECRET_KEY. Set a strong SECRET_KEY before production use.")
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
            await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR"))
            await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture VARCHAR"))
    except Exception as exc:
        print(f"Database startup skipped for local demo: {exc}")

@app.get("/health")
def health_check():
    return {"status": "healthy"}
