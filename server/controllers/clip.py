
from fastapi import  Form, Request
#from server.server.clipScorer import *
# from server.interface.ClipScorer import ClipScorer
from PIL import Image

from services import get_status_from_score

IMAGE_DIR = "images/"
async def clip_score(
    request: Request,
    data: dict
):
    try:
        print("data:", data)
        print("image_name:", data['image_name'])
        print("text:", data['text'])
        
        img = Image.open(f"{IMAGE_DIR}/{data['image_name']}")

        score = request.app.state.clip_scorer.score(img, data['text'])
        status_score = get_status_from_score(score)

        return {
            "status": "ok",
            "filename": data['image_name'],
            "text_received": data['text'],
            "status": status_score,
            "score": score
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}