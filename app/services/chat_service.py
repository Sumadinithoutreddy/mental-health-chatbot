def detect_emotion(message: str):

    message = message.lower()

    if "sad" in message or "depressed" in message:
        return "sad"

    elif "happy" in message or "good" in message:
        return "happy"

    elif "stress" in message or "anxious" in message:
        return "stress"

    elif "angry" in message or "mad" in message:
        return "angry"

    else:
        return "neutral"


def chatbot_reply(emotion):

    replies = {
        "sad": "I'm sorry you're feeling sad. Remember that difficult moments pass and you are not alone.",

        "happy": "That's wonderful to hear! Keep enjoying the positive moments in your life.",

        "stress": "Try taking a short break, breathing deeply, and focusing on one thing at a time.",

        "angry": "It's okay to feel angry sometimes. Try calming yourself before reacting.",

        "neutral": "I'm here to listen. Tell me more about how you're feeling."
    }

    return replies.get(emotion)