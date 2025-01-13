from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from datetime import date
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

# Pydantic Models for Request Body and Response
class TaskCreateRequest(BaseModel):
    task_description: str
    task_assignee: int
    event_id: int
    task_status: str
    task_remarks: Optional[str] = None
    task_deadline: date

class TaskUpdateRequest(BaseModel):
    task_status: Optional[str] = None
    task_assignee: Optional[int] = None

class TaskResponse(BaseModel):
    task_id: int
    task_description: str
    task_assignee: int
    event_id: int
    task_status: str
    task_remarks: Optional[str]
    task_deadline: date

# 1. Create a new task
@app.post("/tasks/", response_model=TaskResponse)
async def create_task(task: TaskCreateRequest):
    conn = await get_db_connection()
    try:
        task_id = await conn.fetchval(
            """
            INSERT INTO tasks (task_description, task_assignee, event_id, task_status, task_remarks, task_deadline)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING task_id
            """,
            task.task_description,
            task.task_assignee,
            task.event_id,
            task.task_status,
            task.task_remarks,
            task.task_deadline
        )
        return {**task.dict(), "task_id": task_id}
    finally:
        await conn.close()

# 2. Update a task
@app.put("/tasks/{task_id}", response_model=TaskResponse)
async def update_task(task_id: int, task: TaskUpdateRequest):
    conn = await get_db_connection()
    try:
        db_task = await conn.fetchrow("SELECT * FROM tasks WHERE task_id = $1", task_id)
        if not db_task:
            raise HTTPException(status_code=404, detail="Task not found")

        # Update task fields dynamically
        if task.task_status:
            await conn.execute("UPDATE tasks SET task_status = $1 WHERE task_id = $2", task.task_status, task_id)
        if task.task_assignee:
            await conn.execute("UPDATE tasks SET task_assignee = $1 WHERE task_id = $2", task.task_assignee, task_id)

        updated_task = await conn.fetchrow("SELECT * FROM tasks WHERE task_id = $1", task_id)
        return TaskResponse(**dict(updated_task))
    finally:
        await conn.close()

# 3. Retrieve tasks by event_id or user_id
@app.get("/tasks/", response_model=List[TaskResponse])
async def get_tasks(event_id: Optional[int] = Query(None), user_id: Optional[int] = Query(None)):
    if not event_id and not user_id:
        raise HTTPException(status_code=400, detail="Either event_id or user_id must be provided")
    
    conn = await get_db_connection()
    try:
        query = "SELECT * FROM tasks"
        filters = []
        params = []

        # Dynamically construct the query and parameters
        if event_id:
            filters.append(f"event_id = ${len(params) + 1}")
            params.append(event_id)
        if user_id:
            filters.append(f"task_assignee = ${len(params) + 1}")
            params.append(user_id)

        if filters:
            query += " WHERE " + " AND ".join(filters)

        print(f"Executing Query: {query} with Params: {params}")  # Debugging
        tasks = await conn.fetch(query, *params)
        return [TaskResponse(**dict(task)) for task in tasks]
    finally:
        await conn.close()

# 4. Delete a task and move to completed_tasks
@app.delete("/tasks/{task_id}")
async def delete_task(task_id: int):
    conn = await get_db_connection()
    try:
        db_task = await conn.fetchrow("SELECT * FROM tasks WHERE task_id = $1", task_id)
        if not db_task:
            raise HTTPException(status_code=404, detail="Task not found")

        await conn.execute(
            """
            INSERT INTO completed_tasks (task_description, task_assignee, event_id, task_status, task_remarks, task_deadline)
            VALUES ($1, $2, $3, $4, $5, $6)
            """,
            db_task["task_description"],
            db_task["task_assignee"],
            db_task["event_id"],
            db_task["task_status"],
            db_task["task_remarks"],
            db_task["task_deadline"]
        )
        await conn.execute("DELETE FROM tasks WHERE task_id = $1", task_id)
        return {"message": "Task moved to completed_tasks table and deleted from tasks"}
    finally:
        await conn.close()


@app.put("/tasks/update_by_organiser/{task_id}", response_model=TaskResponse)
async def update_by_organiser(
    task_id: int,
    task: TaskCreateRequest
):
    conn = await get_db_connection()
    try:
        # Fetch the task to ensure it exists
        db_task = await conn.fetchrow("SELECT * FROM tasks WHERE task_id = $1", task_id)
        if not db_task:
            raise HTTPException(status_code=404, detail="Task not found")

        # Update the task with the provided data
        await conn.execute(
            """
            UPDATE tasks
            SET task_description = $1,
                task_assignee = $2,
                task_status = $3,
                task_remarks = $4,
                task_deadline = $5
            WHERE task_id = $6
            """,
            task.task_description,
            task.task_assignee,
            task.task_status,
            task.task_remarks,
            task.task_deadline,
            task_id
        )

        # Fetch the updated task to return as a response
        updated_task = await conn.fetchrow("SELECT * FROM tasks WHERE task_id = $1", task_id)
        return TaskResponse(**dict(updated_task))
    finally:
        await conn.close()