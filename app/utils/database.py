from pymongo import MongoClient
from app.config import MONGO_URL

client = MongoClient(MONGO_URL)

db = client["mental_health_chatbot"]

users_collection = db["users"]
chat_collection = db["chats"]