from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import date, time
import asyncpg
import os
from dotenv import load_dotenv
load_dotenv()
# Database connection setup
DATABASE_URL = os.getenv('DATABASE_URL')

# FastAPI app initialization
app = FastAPI()

# Helper function to get a database connection
async def get_db_connection():
    return await asyncpg.connect(DATABASE_URL)

# Pydantic models for request and response
class Event(BaseModel):
    event_name: str
    event_organiser: int
    event_date: date  # Changed from str to date
    event_time: time  # Changed from str to time
    event_location: str
    event_participants: List[int]
    event_status: str  # Either 'scheduled' or 'ongoing'

class EventUpdate(BaseModel):
    event_date: Optional[date]  # Changed from str to Optional[date]
    event_time: Optional[time]  # Changed from str to Optional[time]
    event_location: Optional[str]
    event_participants: Optional[List[int]]  # List of integers for participants
    event_status: Optional[str]

# 1. Endpoint to create a new event
@app.post("/create_events")
async def create_event(event: Event):
    conn = await get_db_connection()
    try:
        # Insert the new event into the events table
        await conn.execute("""
            INSERT INTO events (event_name, event_organiser, event_date, event_time, event_location, event_participants, event_status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        """, event.event_name, event.event_organiser, event.event_date, event.event_time, event.event_location, event.event_participants, event.event_status)
        return {"message": "Event created successfully"}
    finally:
        await conn.close()

# 2. Endpoint to retrieve all events for a user (either as organiser or participant)
@app.get("/user_events/{user_id}")
async def get_events_for_user(user_id: int):
    conn = await get_db_connection()
    try:
        # Query events where the user is the organizer or a participant
        rows = await conn.fetch("""
            SELECT * FROM events 
            WHERE event_organiser = $1 OR $1 = ANY(event_participants)
        """, user_id)
        events = [dict(row) for row in rows]
        return events
    finally:
        await conn.close()

# 3. Endpoint to update event details
@app.put("/events/{event_id}")
async def update_event(event_id: int, updates: EventUpdate):
    conn = await get_db_connection()
    try:
        # Fetch the existing event
        db_event = await conn.fetchrow("SELECT * FROM events WHERE event_id = $1", event_id)
        if not db_event:
            raise HTTPException(status_code=404, detail="Event not found")

        # Build the update query dynamically
        update_query = """
            UPDATE events
            SET event_date = COALESCE($1, event_date),
                event_time = COALESCE($2, event_time),
                event_location = COALESCE($3, event_location),
                event_participants = COALESCE($4, event_participants),
                event_status = COALESCE($5, event_status)
            WHERE event_id = $6
        """
        await conn.execute(update_query, updates.event_date, updates.event_time, updates.event_location, updates.event_participants, updates.event_status, event_id)
        return {"message": "Event updated successfully"}
    finally:
        await conn.close()

# 4. Endpoint to delete an event and transfer it to the events_completed table
@app.delete("/events/{event_id}")
async def delete_event(event_id: int):
    conn = await get_db_connection()
    try:
        # Fetch the existing event
        db_event = await conn.fetchrow("SELECT * FROM events WHERE event_id = $1", event_id)
        if not db_event:
            raise HTTPException(status_code=404, detail="Event not found")

        # Transfer the event to the events_completed table
        await conn.execute(""" 
    INSERT INTO events_completed (event_id, event_name, event_organiser, event_date_completed, event_location,event_participants)
    VALUES ($1, $2, $3, $4, $5,$6)
""", db_event["event_id"], db_event["event_name"], db_event["event_organiser"], db_event["event_date"], db_event["event_location"],db_event["event_participants"])

        # Delete the event from the events table
        await conn.execute("DELETE FROM events WHERE event_id = $1", event_id)
        return {"message": "Event deleted and moved to events_completed table",'status':200}
    finally:
        await conn.close()

# 5. Endpoint to fetch event details based on event_id
@app.get("/events/{event_id}")
async def get_event_by_id(event_id: int):
    conn = await get_db_connection()
    try:
        # Fetch the event based on the event_id
        db_event = await conn.fetchrow("SELECT * FROM events WHERE event_id = $1", event_id)
        if not db_event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        # Convert the database row into a dictionary
        event = dict(db_event)
        return event
    finally:
        await conn.close()
