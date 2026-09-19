from fastapi import APIRouter, Header, HTTPException

from app.models.chat_model import ChatRequest
from app.services.chat_service import detect_emotion
from app.services.ai_service import get_ai_response
from app.utils.security import decode_access_token
from app.utils.database import chat_collection

router = APIRouter(prefix="/chat", tags=["Chatbot"])


@router.post("/analyze")
def analyze_chat(
    chat: ChatRequest,
    authorization: str = Header(None)
):

    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization token missing"
        )

    token = authorization.replace("Bearer ", "")

    try:
        payload = decode_access_token(token)
        email = payload.get("email")

        if not email:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    emotion = detect_emotion(chat.message)

    ai_reply = get_ai_response(chat.message)

    chat_collection.insert_one({
        "email": email,
        "message": chat.message,
        "emotion": emotion,
        "reply": ai_reply
    })

    return {
        "message": chat.message,
        "emotion": emotion,
        "reply": ai_reply
    }
@router.get("/history")
def get_chat_history(
    authorization: str = Header(None)
):

    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization token missing"
        )

    token = authorization.replace("Bearer ", "")

    try:
        payload = decode_access_token(token)
        email = payload.get("email")

        if not email:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    chats = chat_collection.find(
        {"email": email}
    ).sort("_id", -1)

    history = []

    for chat in chats:

        history.append({
            "message": chat["message"],
            "emotion": chat["emotion"],
            "reply": chat["reply"]
        })

    return history
@router.delete("/history")
def delete_chat_history(
    authorization: str = Header(None)
):

    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization token missing"
        )

    token = authorization.replace("Bearer ", "")

    try:
        payload = decode_access_token(token)
        email = payload.get("email")

        if not email:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    result = chat_collection.delete_many({
        "email": email
    })

    return {
        "message": "Chat history deleted successfully",
        "deleted_count": result.deleted_count
    }