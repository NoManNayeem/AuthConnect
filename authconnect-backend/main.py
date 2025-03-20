from fastapi import FastAPI, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from auth import create_access_token, verify_token, hash_password, verify_password
from models import add_user, get_user_by_username, track_public_user

app = FastAPI()

# CORS settings
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",  # Add this to allow requests from both localhost and IP
    "https://your-frontend-domain.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request models to accept JSON payloads
class UserCreate(BaseModel):
    username: str
    password: str

@app.post("/register")
def register(user: UserCreate):
    hashed_password = hash_password(user.password)
    try:
        add_user(user.username, hashed_password)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Username already exists")
    return {"message": "User registered successfully"}

@app.post("/token")
def login(user: UserCreate):
    db_user = get_user_by_username(user.username)
    if not db_user or not verify_password(user.password, db_user[2]):  # db_user[2] is hashed_password
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/demo")
def demo_api(request: Request, authorization: str = Header(None)):
    ip = request.client.host  # Get the user's IP address

    if authorization:
        token = authorization.split(" ")[1]
        user = verify_token(token)
        if user:
            return {"message": "Welcome, private user! You have unlimited access."}
        else:
            raise HTTPException(status_code=401, detail="Invalid token")
    else:
        remaining_requests = track_public_user(ip)
        if remaining_requests == -1:
            raise HTTPException(status_code=403, detail="Public user limit reached. Please create an account.")
        return {"message": f"Welcome, public user! You have {remaining_requests} requests left."}