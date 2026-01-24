from fastapi import FastAPI, UploadFile, File, Form,Request
from mongoDB import images
from PIL import Image
IMAGE_DIR = "images"

async def blip_img_anlz(
    request: Request,
    data: dict
):
    try:
        img = Image.open(f"{IMAGE_DIR}/{data['image_name']}")
        text_blip=request.app.state.blip_img_analyzer.generate_caption(img)
        
        clip_score=request.app.state.clip_scorer.score(img, text_blip)
        if clip_score > 0.2:
        # Append the new caption object and keep only the most recent 3 captions
            images.update_one(
                {"filename": data['image_name']},
                {"$push": {"captions": {"$each": [{"text": text_blip, "clip_score": clip_score}], "$slice": -6}}},
                upsert=True
            )

        return {
            "status": "ok",
            "filename": data['image_name'],
            "text_blip": text_blip,
            "clip_score": clip_score,
        }
    
    except Exception as e:
        return {"status": "error", "message": str(e)}