from app.utils.database import users_collection
from app.utils.security import hash_password, verify_password, create_access_token

def register_user(name, email, password):

    existing_user = users_collection.find_one({"email": email})

    if existing_user:
        return {"error": "User already exists"}

    hashed_pw = hash_password(password)

    user_data = {
        "name": name,
        "email": email,
        "password": hashed_pw
    }

    users_collection.insert_one(user_data)

    token = create_access_token({"email": email})

    return {
        "message": "User registered successfully ✅",
        "token": token
    }

def login_user(email, password):

    user = users_collection.find_one({"email": email})

    if not user:
        return {"error": "User not found"}

    if not verify_password(password, user["password"]):
        return {"error": "Invalid password"}

    token = create_access_token({"email": email})

    return {
        "message": "Login successful ✅",
        "token": token
    }