
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.blip import router as blip_router
from routes.clip import router as clip_router
from routes.data import router as data_router

from interface.ClipScorer import ClipScorer
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.clip_scorer = ClipScorer()
    yield
    app.state.clip_scorer = None

app = FastAPI(title="SIGHTSYNC MVP", lifespan=lifespan)

#app = FastAPI(title="SIGHTSYNC MVP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():    
    return "server running"

app.include_router(blip_router, prefix="/blip")
app.include_router(clip_router, prefix="/clip")
app.include_router(data_router, prefix="/data")

