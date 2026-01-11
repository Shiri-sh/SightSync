
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from services import *
from ClipScorer import ClipScorer
app = FastAPI(title="SIGHTSYNC MVP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

clipScorer = ClipScorer()

@app.post("/upload_img")
async def upload_img(
    image:UploadFile=File(...)
):
    img = Image.open(image.file)
    
    return {"filename": image.filename}

@app.post("/clip_score")
async def clip_score(
    image_name: str=Form(...),
    text: str = Form(...)
):
    img = Image.open(image_name)
    
    score = clipScorer.score(img, text)
    status_score=get_status_from_score(score)
    return {
        "status": "ok",
        "filename": image_name,
        "text_received": text,
        "status": status_score,
        "score": score
    }
@app.get("/blip_img_anlz")
async def blip_img_anlz(
    image_name: str=Form(...),
    text: str = Form(...),
    score: float = Form(...)
):
    img = Image.open(image_name)
    
    return {
        "status": "ok",
        "filename": image_name,
        "text_received": text,
        "text_blip": "description from blip",
        "clip_score": score
    }
@app.get("/")
async def read_root():
    return "server running"