
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from services import *
from server.interface.ClipScorer import ClipScorer

app = FastAPI(title="SIGHTSYNC MVP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# clipScorer = ClipScorer()





@app.get("/")
async def read_root():
    return "server running"