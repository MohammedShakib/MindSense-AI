from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import timedelta

from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.config import settings
from app.models.user import User, PasswordResetOTP
from app.schemas.user import UserCreate, UserResponse, Token
from app.schemas.auth import ForgotPasswordRequest, VerifyOTPRequest, ResetPasswordRequest, GoogleAuthRequest
from app.api import deps
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from google.auth.exceptions import GoogleAuthError
import secrets
from datetime import datetime

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register_user(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db)
) -> Any:
    # Check if user exists
    result = await db.execute(select(User).filter(User.email == user_in.email))
    if result.scalars().first():
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system",
        )
    
    user = User(
        name=user_in.name,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@router.post("/login", response_model=Token)
async def login_access_token(
    db: AsyncSession = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    # Authenticate user
    result = await db.execute(select(User).filter(User.email == form_data.username))
    user = result.scalars().first()
    if not user or not user.hashed_password:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
        
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.get("/me", response_model=UserResponse)
def read_current_user(
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    return current_user

@router.post("/forgot-password")
async def forgot_password(
    req: ForgotPasswordRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    result = await db.execute(select(User).filter(User.email == req.email))
    user = result.scalars().first()
    if not user:
        return {"msg": "If an account exists, an OTP has been sent."}
        
    otp_code = "".join([str(secrets.randbelow(10)) for _ in range(6)])
    otp_hash = get_password_hash(otp_code)
    
    expires_at = datetime.utcnow() + timedelta(minutes=15)
    
    otp_record = PasswordResetOTP(
        user_id=user.id,
        otp_hash=otp_hash,
        expires_at=expires_at
    )
    db.add(otp_record)
    await db.commit()
    
    # TODO: Send email with OTP (simulated for now)
    print(f"SIMULATED EMAIL TO {req.email}: Your OTP is {otp_code}")
    
    return {"msg": "If an account exists, an OTP has been sent."}

@router.post("/verify-otp")
async def verify_otp(
    req: VerifyOTPRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    result = await db.execute(select(User).filter(User.email == req.email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid request")
        
    otp_result = await db.execute(
        select(PasswordResetOTP)
        .filter(PasswordResetOTP.user_id == user.id)
        .filter(PasswordResetOTP.used == False)
        .filter(PasswordResetOTP.expires_at > datetime.utcnow())
        .order_by(PasswordResetOTP.created_at.desc())
    )
    otp_record = otp_result.scalars().first()
    
    if not otp_record or not verify_password(req.otp, otp_record.otp_hash):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
    return {"msg": "OTP verified successfully"}

@router.post("/reset-password")
async def reset_password(
    req: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    result = await db.execute(select(User).filter(User.email == req.email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid request")
        
    otp_result = await db.execute(
        select(PasswordResetOTP)
        .filter(PasswordResetOTP.user_id == user.id)
        .filter(PasswordResetOTP.used == False)
        .filter(PasswordResetOTP.expires_at > datetime.utcnow())
        .order_by(PasswordResetOTP.created_at.desc())
    )
    otp_record = otp_result.scalars().first()
    
    if not otp_record or not verify_password(req.otp, otp_record.otp_hash):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
    otp_record.used = True
    user.hashed_password = get_password_hash(req.new_password)
    await db.commit()
    
    return {"msg": "Password reset successfully"}

@router.post("/google")
async def google_auth(
    req: GoogleAuthRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Google login is not configured")

    try:
        payload = id_token.verify_oauth2_token(
            req.token,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )
    except (ValueError, GoogleAuthError):
        raise HTTPException(status_code=400, detail="Invalid Google token")

    email = payload.get("email")
    name = payload.get("name")
    google_id = payload.get("sub")
    profile_picture = payload.get("picture")
    email_verified = payload.get("email_verified")

    if not email or not google_id or not email_verified:
        raise HTTPException(status_code=400, detail="Google account email is not verified")
    
    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalars().first()
    
    if user:
        if not user.google_id:
            user.google_id = google_id
        if name and user.name != name:
            user.name = name
        if profile_picture and user.profile_picture != profile_picture:
            user.profile_picture = profile_picture
        await db.commit()
        await db.refresh(user)
    else:
        user = User(
            name=name,
            email=email,
            google_id=google_id,
            profile_picture=profile_picture,
            hashed_password=None # OAuth users might not have a password
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "name": user.name,
            "email": user.email,
            "profile_picture": user.profile_picture,
        },
    }
