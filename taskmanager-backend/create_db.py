"""
MySQL Database Creation Script for Task Manager Backend

This script creates the MySQL database for the Task Manager application.
You can run this script before running migrations, or execute the SQL manually.

Usage:
    python create_db.py

Note: Update the password below with your MySQL root password.
"""

import mysql.connector
from mysql.connector import Error


def create_database():
    """
    Creates the taskmanager_db database in MySQL
    
    Make sure MySQL server is running before executing this script.
    Update the 'password' field with your MySQL root password.
    """
    try:
        # ============= CONNECT TO MYSQL SERVER =============
        # Update password with your MySQL root password
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='Kasun123@'  # UPDATE THIS WITH YOUR PASSWORD
        )

        if connection.is_connected():
            cursor = connection.cursor()
            
            # ============= CREATE DATABASE =============
            # Create database with UTF-8 encoding for proper character support
            cursor.execute(
                "CREATE DATABASE IF NOT EXISTS taskmanager_db "
                "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
            )
            
            print("✅ Database 'taskmanager_db' created successfully!")
            print("\n📋 Next Steps:")
            print("   1. Run migrations: python manage.py migrate")
            print("   2. Create superuser: python manage.py createsuperuser")
            print("   3. Start server: python manage.py runserver")
            
            cursor.close()
            connection.close()
            
    except Error as e:
        print(f"❌ Error: {e}")
        print("\n💡 Manual Alternative:")
        print("   Open MySQL and run:")
        print("   CREATE DATABASE taskmanager_db")
        print("   CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")


if __name__ == "__main__":
    print("=" * 60)
    print("Creating MySQL Database for Task Manager")
    print("=" * 60)
    create_database()
