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

        # Append the new caption and keep only the most recent 3 captions
        images.update_one(
            {"filename": data['image_name']},
            {"$push": {"captions": {"$each": [text_blip], "$slice": -3}}},
            upsert=True
        )

        return {
            "status": "ok",
            "filename": data['image_name'],
            "text_blip": text_blip,
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}