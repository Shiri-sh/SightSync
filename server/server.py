
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

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
    return {
        "status": "ok",
        "filename": image.filename,
        "text_received": text,
        "verdict": "match",
        "confidence": 0.99
    }
