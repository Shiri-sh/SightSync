from fastapi import FastAPI, UploadFile, File, Form
from PIL import Image
import os
from datetime import datetime
from mongoDB import images

DIR_PATH = "images/"
async def upload_img(
    image: UploadFile=File(...)
):
    try:
        print(image.filename)
        path = f"{DIR_PATH}/{image.filename}"
        with open(path, "wb") as f:
            f.write(await image.read())
        doc = {
            "filename": image.filename,
            "url": f"{image.filename}",
            "embedding": None,
            "captions": [],
            "created_at": datetime.utcnow()
        }

        await images.insert_one(doc)

        return {"status": "ok", "filename": image.filename}
    
    except Exception as e:
        return {"status": "error", "message": str(e)}
async def get_img(
    filename: str = Form(...)
):
    try:
        # path = f"{DIR_PATH}/{filename}"
        image_doc = await images.find_one({"filename": filename})
        if image_doc:
            return {"status": "ok", "filename": filename, "url": image_doc["url"]}
        else:
            return {"status": "error", "message": "Image not found"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
async def list_images():
    try:
        images_list = await images.find().to_list(100)
        return {"status": "ok", "images": [{"url": img["url"], "filename": img["filename"]} for img in images_list]}
    except Exception as e:
        return {"status": "error", "message": str(e)}