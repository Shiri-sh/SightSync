
import os, certifi, ssl
from pymongo.mongo_client import MongoClient
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes.blip import router as blip_router
from routes.clip import router as clip_router
from routes.data import router as data_router

from interface.ClipScorer import ClipScorer
from interface.BlipCaption import BlipCaption
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.clip_scorer = ClipScorer()
    app.state.blip_img_analyzer = BlipCaption()
    app.state.mongo_client = MongoClient(os.getenv("URI"))
    app.state.db = app.state.mongo_client["images_db"]
    app.state.images = app.state.db["images"]
    yield
    app.state.clip_scorer = None
    app.state.blip_img_analyzer = None
    app.state.mongo_client.close()


app = FastAPI(title="SIGHTSYNC MVP", lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount(
    "/images",
    StaticFiles(directory="images"),
    name="images"
)
@app.get("/")
async def read_root():    
    return "server running"

app.include_router(blip_router, prefix="/blip")
app.include_router(clip_router, prefix="/clip")
app.include_router(data_router, prefix="/data")

