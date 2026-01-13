from fastapi import FastAPI, UploadFile, File, Form,Request

from PIL import Image


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