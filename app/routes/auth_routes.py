from fastapi import APIRouter
from app.models.user_model import UserCreate, UserLogin
from app.services.auth_service import register_user, login_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
def register(user: UserCreate):
    return register_user(user.name, user.email, user.password)

@router.post("/login")
def login(user: UserLogin):
    return login_user(user.email, user.password)