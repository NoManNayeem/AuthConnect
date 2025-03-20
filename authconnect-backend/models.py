from database import get_db_connection

# Add a new user
def add_user(username: str, hashed_password: str):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (username, hashed_password) VALUES (?, ?)", (username, hashed_password))
        conn.commit()

# Get a user by username
def get_user_by_username(username: str):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
        return cursor.fetchone()

# Track public user requests
def track_public_user(ip_address: str):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT request_count FROM public_usage WHERE ip_address = ?", (ip_address,))
        row = cursor.fetchone()

        if row is None:
            cursor.execute("INSERT INTO public_usage (ip_address, request_count) VALUES (?, ?)", (ip_address, 1))
            conn.commit()
            return 4  # Remaining requests
        else:
            request_count = row[0]
            if request_count >= 5:
                return -1  # Limit reached
            cursor.execute("UPDATE public_usage SET request_count = ? WHERE ip_address = ?", (request_count + 1, ip_address))
            conn.commit()
            return 5 - (request_count + 1)  # Remaining requests