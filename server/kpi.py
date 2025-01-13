from fastapi import FastAPI, HTTPException, Query
from typing import Dict
import asyncpg
import os
from dotenv import load_dotenv
load_dotenv()
# Database connection setup
DATABASE_URL = os.getenv('DATABASE_URL')
app = FastAPI()

# Create DB connection method
async def get_db_connection():
    return await asyncpg.connect(DATABASE_URL)

# Endpoint to fetch the count of all events for a user
@app.get("/get_events/")
async def get_events(user_id: int = Query(..., description="The user ID to search for events")):
    conn = await get_db_connection()
    try:
        # Query to count events where user is an organizer or participant in the `events` table
        events_count_query = """
        SELECT COUNT(*) 
        FROM events 
        WHERE event_organiser = $1 OR $1 = ANY(event_participants)
        """
        events_count = await conn.fetchval(events_count_query, user_id)

        # Query to count events where user is an organizer or participant in the `events_completed` table
        completed_events_count_query = """
        SELECT COUNT(*) 
        FROM events_completed 
        WHERE event_organiser = $1 OR $1 = ANY(event_participants)
        """
        completed_events_count = await conn.fetchval(completed_events_count_query, user_id)

        # Total count of all events the user is involved in
        total_events_count = events_count + completed_events_count

        return {
            "user_id": user_id,
            "events_count": events_count,
            "completed_events_count": completed_events_count,
            "total_events_count": total_events_count,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")
    finally:
        await conn.close()
