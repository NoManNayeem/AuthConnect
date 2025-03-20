import sqlite3
from contextlib import contextmanager

DB_NAME = "authconnect.db"

# Context manager for database connection
@contextmanager
def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    try:
        yield conn
    finally:
        conn.close()

# Initialize the database
def init_db():
    with get_db_connection() as conn:
        cursor = conn.cursor()

        # Create users table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL,
            is_private INTEGER DEFAULT 0
        )
        """)

        # Create public_usage table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS public_usage (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip_address TEXT UNIQUE NOT NULL,
            request_count INTEGER DEFAULT 0
        )
        """)

        conn.commit()

# Call the function to initialize the database
init_db()