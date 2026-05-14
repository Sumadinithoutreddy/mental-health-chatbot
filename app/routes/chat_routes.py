from fastapi import APIRouter
from app.models.chat_model import ChatRequest
from app.services.chat_service import detect_emotion
from app.services.ai_service import get_ai_response

router = APIRouter(prefix="/chat", tags=["Chatbot"])

@router.post("/analyze")
def analyze_chat(chat: ChatRequest):

    emotion = detect_emotion(chat.message)

    ai_reply = get_ai_response(chat.message)

    return {
        "message": chat.message,
        "emotion": emotion,
        "reply": ai_reply
    }