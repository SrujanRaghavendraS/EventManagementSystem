from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import asyncpg
import os
from dotenv import load_dotenv
import redis

load_dotenv()
# Database connection setup
DATABASE_URL = os.getenv('DATABASE_URL')

# Load environment variables
DATABASE_URL = os.getenv('DATABASE_URL')
REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')  # Adjust as per your Redis configuration
REDIS_PORT = os.getenv('REDIS_PORT', 6379)  # Default Redis port


redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0, decode_responses=True)

app = FastAPI()

# Create DB connection method
async def get_db_connection():
    return await asyncpg.connect(DATABASE_URL)



# Endpoint to retrieve all data from "events_completed" datatable
@app.get("/events-completed/")
async def get_completed_events():
    conn = await get_db_connection()
    print('connection done')
    
    try:
        # Fetch all data from "events_completed" table
        events = await conn.fetch("SELECT * FROM events_completed")
        # Return the data as a list of CompletedEventResponse
        return events
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")
    finally:
        await conn.close()
