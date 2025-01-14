# Event Management System

This repository contains the Event Management System, a comprehensive solution for managing events, tasks, and related data efficiently. Follow the steps below to set up and run the project successfully.

---

## Prerequisites

Before proceeding with the setup, ensure the following software is installed on your system:
- PostgreSQL and pgAdmin4
- Python 3.x
- Node.js and npm
- Git
- Code editor (e.g., VS Code)


git clone <repository-url>
cd <repository-directory>

Download and Install pgAdmin4
Download pgAdmin4 from the official PostgreSQL website and install it on your system.

Launch pgAdmin4
Open pgAdmin4 and log in using your PostgreSQL username and password.

Restore the Database

1)Navigate to Servers > PostgreSQL > Databases in the left panel.
2)Right-click on Databases and select Restore.
3)Browse to the SQL file from the repository (<path-to-sql-file>).
4)Click Restore to import the database.
5)Verify Database Restoration
6)Confirm that the database is successfully restored and accessible.

# steps for setting up the Backend

Open the repo in VS Code amd open terminal

Now change the directory to server

run the below code

`pip install requirements.txt`

All the dependencies will be installed

Now to run the API Gateway, Use the code below

`python -m uvicorn main:app --reload`

Your Backend Setup is Successful

# Steps to run the front end

Open another terminal

change the directory to the client

run the command below for downloading all the front end dependencies

`npm install`

run the command below

`npm run dev`

Note: You have npm and node packages installed in your local system

Open the below url and you can start using the system

`localhost:3000`

Notes
Database User Credentials
Use the credentials stored in the database to log in.

Node and NPM Installation
Ensure Node.js and npm are installed on your system before running frontend setup commands.

Project Features
Event Management: Create, edit, delete, and view events.
Task Management: Manage tasks associated with events.
User Dashboard: View key performance indicators (KPIs) and past events.
Dynamic Features: Caching, authentication, and responsive design.

Also you can view the demo video in this repository