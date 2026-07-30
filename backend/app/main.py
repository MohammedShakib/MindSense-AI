from fastapi import FastAPI

from app.api import auth

app = FastAPI(
    title="MindSense AI API",
    description="Backend for multimodal mental wellness assessment platform",
    version="1.0.0"
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])

@app.get("/health")
def health_check():
    return {"status": "healthy"}
