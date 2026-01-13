
from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
#from server.server.clipScorer import *
from server.interface.ClipScorer import ClipScorer
from PIL import Image

from server.services import get_status_from_score

async def clip_score(
    image_name: str=Form(...),
    text: str = Form(...)
):
    img = Image.open(image_name)
    
    #score = clipScorer.score(img, text)
    status_score=get_status_from_score(score)
    return {
        "status": "ok",
        "filename": image_name,
        "text_received": text,
        "status": status_score,
        "score": score
    }