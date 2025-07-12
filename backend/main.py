from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[" http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextInput(BaseModel):
    text: str

# Mock emotion analysis
def analyze_emotion(text: str) -> dict:
    emotions = [
        "Happy", "Sad", "Angry", "Anxious", 
        "Excited", "Bored", "Confused", "Content"
    ]
    return {
        "emotion": random.choice(emotions),
        "confidence": round(random.uniform(0.7, 0.99), 2)
    }

@app.post("/analyze")
async def analyze_text(input: TextInput):
    if not input.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    return analyze_emotion(input.text)

@app.get("/")
async def root():
    return {"message": "Emotion Analysis API"}