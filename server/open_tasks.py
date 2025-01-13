from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel, validator
from datetime import date, datetime
import asyncpg
from typing import Optional
import os
from dotenv import load_dotenv
load_dotenv()
# Database connection setup
DATABASE_URL = os.getenv('DATABASE_URL')
app = FastAPI()

async def get_db_connection():
    return await asyncpg.connect(DATABASE_URL)

# Pydantic model for task creation
class TaskCreate(BaseModel):
    task_description: str
    event_id: str
    task_deadline: str  # Accepting it as a string, we will validate it

    # Validator to ensure task_deadline is in the correct format
    @validator('task_deadline')
    def check_deadline_format(cls, value):
        try:
            # Check if the date format is correct
            datetime.strptime(value, "%Y-%m-%d")
        except ValueError:
            raise ValueError("Invalid date format. Use YYYY-MM-DD.")
        return value

@app.get("/post_tasks")
async def get_all_post_tasks():
    conn = await get_db_connection()
    try:
        post_tasks = await conn.fetch("SELECT * FROM post_tasks")

        if not post_tasks:
            raise HTTPException(status_code=404, detail="No tasks found")

        # Return raw data directly, handling NULL values for event_deadline
        return [
            {
                "task_description": task["task_description"],
                "event_id": task["event_id"],
                "task_deadline": task["task_deadline"] or None  # Handle NULL as None
            }
            for task in post_tasks
        ]
    finally:
        await conn.close()

@app.post("/post_tasks")
async def create_post_task(task: TaskCreate):
    conn = await get_db_connection()
    try:
        # Convert task_deadline string to date object
        task_deadline_date = datetime.strptime(task.task_deadline, "%Y-%m-%d").date()

        # Insert new task into the database
        result = await conn.execute(
            """
            INSERT INTO post_tasks (task_description, event_id, task_deadline)
            VALUES ($1, $2, $3)
            """, task.task_description, int(task.event_id), task_deadline_date
        )

        # Return a success response
        return {"message": "Task created successfully", "task": task.dict()}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Failed to create task: " + str(e))
    finally:
        await conn.close()

@app.post("/accept_task")
async def assign_task( 
    task_description: str = Body(...), 
    event_id: int = Body(...), 
    task_deadline: date = Body(...), 
    task_assignee: int = Body(...),
):
    conn = await get_db_connection()
    try:
        # Step 1: Insert the task into the 'tasks' table with a default 'task_status' of 'Pending'
        await conn.execute(
            """
            INSERT INTO tasks (task_description, event_id, task_deadline, task_assignee, task_status)
            VALUES ($1, $2, $3, $4, 'Pending')
            """, task_description, event_id, task_deadline, task_assignee
        )

        # Step 2: Delete the task from the 'post_tasks' table based on task_id
        await conn.execute(
            """
            DELETE FROM post_tasks
            WHERE task_description = $1
            """, task_description
        )

        # Return a success response
        return {"message": "Task assigned and moved to tasks table successfully."}
    
    except Exception as e:
        # Log error details and raise HTTPException with the error
        print(f"Error: {e}")
        raise HTTPException(status_code=400, detail="Failed to assign task: " + str(e))
    finally:
        await conn.close()