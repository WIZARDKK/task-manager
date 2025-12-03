# MySQL Database Setup Guide

## Prerequisites
1. Install MySQL Server on your machine
2. MySQL service should be running

## Step-by-Step Setup

### 1. Create the Database
Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE taskmanager_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Create a MySQL User (Optional but recommended)
```sql
CREATE USER 'taskmanager_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON taskmanager_db.* TO 'taskmanager_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configure Database Credentials
Edit the file: `taskmanager/db_config.py`

```python
DB_CONFIG = {
    'ENGINE': 'django.db.backends.mysql',
    'NAME': 'taskmanager_db',
    'USER': 'root',  # or 'taskmanager_user' if you created one
    'PASSWORD': 'your_actual_password',  # Update this!
    'HOST': 'localhost',
    'PORT': '3306',
    'OPTIONS': {
        'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
    },
}
```

### 4. Run Migrations
```powershell
cd "C:\Users\M S I\Desktop\task-manager\taskmanager-backend"
.\venv\Scripts\Activate.ps1
python manage.py migrate
```

### 5. Create Superuser
```powershell
python manage.py createsuperuser
```

### 6. Start the Server
```powershell
python manage.py runserver
```

## Configuration File Locations

### Main Settings
- `taskmanager/settings.py` - Main Django settings

### Database Credentials (Update these!)
- `taskmanager/db_config.py` - **Your actual credentials** (not tracked by git)
- `taskmanager/db_config.example.py` - Example template

## Database Configuration Options

### MySQL Connection Parameters:
- **NAME**: Database name (`taskmanager_db`)
- **USER**: MySQL username (default: `root`)
- **PASSWORD**: Your MySQL password (**REQUIRED**)
- **HOST**: Database server host (default: `localhost`)
- **PORT**: MySQL port (default: `3306`)

### Alternative: Using Root User
If using root user (not recommended for production):
```python
DB_CONFIG = {
    'ENGINE': 'django.db.backends.mysql',
    'NAME': 'taskmanager_db',
    'USER': 'root',
    'PASSWORD': 'your_root_password',
    'HOST': 'localhost',
    'PORT': '3306',
}
```

## Troubleshooting

### Error: "Access denied for user"
- Check your MySQL username and password in `db_config.py`
- Verify user has permissions on the database

### Error: "Can't connect to MySQL server"
- Ensure MySQL service is running
- Check HOST and PORT settings
- Verify firewall settings

### Error: "Unknown database"
- Create the database using the SQL command above
- Verify database name matches in `db_config.py`

## Security Notes
⚠️ **IMPORTANT**: 
- Never commit `db_config.py` to version control
- Use strong passwords for production
- Consider using environment variables for production deployments
