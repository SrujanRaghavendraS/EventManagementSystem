# Gateway for the API
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from accounts_service import app as acc_app  # Importing the accounts microservice
from events import app as event_app
from tasks import app as task_app
from open_tasks import app as open_app
from past import app as past_app
from kpi import app as kpi_app
# Initialize the API app for gateway
app = FastAPI()

# Configure the middlewares
app.add_middleware(
    CORSMiddleware,  # Enabling the CORS
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Mounting the gateway app with /accounts endpoint for accessing
# the accounts_app from accounts_service microservice
app.mount("/accounts", acc_app)
app.mount("/events", event_app)
app.mount("/tasks", task_app)
app.mount("/open",open_app)
app.mount("/past",past_app)
app.mount('/kpi',kpi_app)