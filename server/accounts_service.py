from fastapi import FastAPI, HTTPException
import asyncpg
from pydantic import BaseModel
from typing import Optional
import os
import redis
from dotenv import load_dotenv
import json

load_dotenv()

# Load environment variables
DATABASE_URL = os.getenv('DATABASE_URL')
REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')  # Adjust as per your Redis configuration
REDIS_PORT = os.getenv('REDIS_PORT', 6379)  # Default Redis port

# Connect to Redis
redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0, decode_responses=True)

# Initialize FastAPI
app = FastAPI()

# Database connection
async def get_db_connection():
    return await asyncpg.connect(DATABASE_URL)

# Models
class UserLogin(BaseModel):
    email: str
    password: str

    class Config:
        orm_mode = True

class UserResponse(BaseModel):
    message: str
    success: bool

class UserProfileResponse(BaseModel):
    user_id: int
    user_name: str
    user_email: str
    user_password: str  
    additional_info: Optional[str]  

# Authentication endpoint with caching
@app.post("/authenticate")
async def authenticate_user(user: UserLogin):
    # First check Redis cache
    cached_user = redis_client.get(user.email)  # Assuming email as the cache key
    if cached_user:
        print('cached user')
        return json.loads(cached_user)  # If found in cache, return the cached data

    # If not found in cache, fetch from the database
    conn = await get_db_connection()
    try:
        db_user = await conn.fetchrow("SELECT * FROM users WHERE user_email = $1", user.email)
        if not db_user:
            raise HTTPException(status_code=400, detail="Invalid email")
        if user.password != db_user["user_password"]:
            raise HTTPException(status_code=400, detail="Incorrect password")
        
        # Cache the result in Redis (expires in 1 hour)
        redis_client.setex(user.email, 3600, json.dumps({
            'message': "Authentication successful",
            'success': True,
            'status': 200,
            'user_data': dict(db_user)
        }))
        
        return {'message': "Authentication successful", 'success': True, 'status': 200, 'user_data': db_user}
    finally:
        await conn.close()

# Profile endpoint with caching
@app.get("/profile/{user_id}")
async def get_user_profile(user_id: str):
    # First check Redis cache
    cached_profile = redis_client.get(f"user_profile_{user_id}")
    if cached_profile:
        print('cached Profile')
        return json.loads(cached_profile)  # If found in cache, return the cached data
    
    # If not found in cache, fetch from the database
    conn = await get_db_connection()
    try:
        db_user = await conn.fetchrow("SELECT * FROM users WHERE user_id = $1", int(user_id))
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Remove password from the response
        user_data = dict(db_user)
        user_data.pop("user_password", None)
        
        # Cache the result in Redis (expires in 1 hour)
        redis_client.setex(f"user_profile_{user_id}", 3600, json.dumps(user_data))
        
        return user_data
    finally:
        await conn.close()
