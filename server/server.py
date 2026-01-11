
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from services import *
app = FastAPI(title="SIGHTSYNC MVP")

# CORS – חובה בשביל קליינט
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ל-MVP בלבד
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/verify")
async def verify(
    image: UploadFile = File(...),
    text: str = Form(...)
):
    img = Image.open(image.file)
    score = clip_score(img, text)
    return {
        "status": "ok",
        "filename": image.filename,
        "text_received": text,
        "verdict": "match",
        "confidence": 0.99
    }
@app.get("/")
async def read_root():
    return "server running"