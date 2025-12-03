# Task Manager Backend

Django REST API backend for the Task Manager application.

## Setup Instructions

### 1. Create Virtual Environment
```powershell
python -m venv venv
```

### 2. Activate Virtual Environment
```powershell
.\venv\Scripts\Activate.ps1
```

### 3. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 4. Run Migrations
```powershell
python manage.py migrate
```

### 5. Create Superuser (Optional)
```powershell
python manage.py createsuperuser
```

### 6. Run Development Server
```powershell
python manage.py runserver
```

The API will be available at `http://localhost:8000/`

## API Endpoints

### Authentication Endpoints (No Auth Required)
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/token/refresh/` - Refresh access token

### User Management Endpoints (Auth Required)
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/` - Update user profile
- `PATCH /api/auth/profile/` - Partial update user profile
- `POST /api/auth/logout/` - Logout (blacklist token)
- `POST /api/auth/change-password/` - Change password

### Task Endpoints (Auth Required)
- `GET /api/tasks/` - List user's tasks
- `POST /api/tasks/` - Create a new task
- `GET /api/tasks/{id}/` - Get task details
- `PUT /api/tasks/{id}/` - Update a task
- `PATCH /api/tasks/{id}/` - Partial update a task
- `DELETE /api/tasks/{id}/` - Delete a task
- `POST /api/tasks/{id}/toggle_complete/` - Toggle task completion

### Query Parameters (for tasks)
- `category` - Filter by category (Work/Personal)
- `completed` - Filter by completion status (true/false)

### Authentication
All task endpoints require JWT authentication.
Include the access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### Admin Panel
Access the Django admin panel at `http://localhost:8000/admin/`

## Project Structure
```
taskmanager-backend/
├── venv/                 # Virtual environment
├── taskmanager/          # Project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── tasks/                # Tasks app
│   ├── models.py         # Task model
│   ├── serializers.py    # API serializers
│   ├── views.py          # API views
│   └── urls.py           # API routes
├── manage.py
└── requirements.txt
```

## Technologies Used
- Django 5.2.9
- Django REST Framework 3.16.1
- djangorestframework-simplejwt 5.5.1 (JWT Authentication)
- django-cors-headers 4.9.0
- MySQL (via mysqlclient)

## API Examples

### Register User
```bash
POST /api/auth/register/
{
  "username": "john",
  "email": "john@example.com",
  "password": "Pass123!",
  "password2": "Pass123!",
  "first_name": "John"
}
```

### Login
```bash
POST /api/auth/login/
{
  "username": "john",
  "password": "Pass123!"
}
```
Returns:
```json
{
  "user": { "id": 1, "username": "john", "email": "john@example.com" },
  "tokens": {
    "refresh": "eyJ0eXAi...",
    "access": "eyJ0eXAi..."
  },
  "message": "Login successful"
}
```

### Create Task (with auth)
```bash
POST /api/tasks/
Headers: Authorization: Bearer <access_token>
{
  "title": "Complete project",
  "due_date": "2025-12-05T17:00:00Z",
  "category": "Work",
  "notes": "Important task"
}
```

## Run server
```powershell
python manage.py runserver
```
