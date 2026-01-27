from fastapi import FastAPI, Request, UploadFile, File, Form
from PIL import Image
import os
from datetime import datetime
from mongoDB import images

DIR_PATH = "images/"
async def upload_img(
    request: Request,
    image: UploadFile=File(...)
):
    try:
        print(image.filename)
        path = f"{DIR_PATH}/{image.filename}"
        
        with open(path, "wb") as f:
            f.write(await image.read())

        if images.find_one({"filename": image.filename}):
            return {"status": "ok", "filename": image.filename}

        img = Image.open(path)

        img_emb = request.app.state.clip_scorer.image_embedding(img)
        img_emb = img_emb.squeeze().tolist()

        doc = {
                "filename": image.filename,
                "url": f"{image.filename}",
                "embedding": img_emb,
                "captions": [],
                "created_at": datetime.now()
              }

        images.insert_one(doc)

        return {"status": "ok", "filename": image.filename}

    except Exception as e:
        return {"status": "error", "message": str(e)}
async def get_img(
    filename: str = Form(...)
):
    try:
        # path = f"{DIR_PATH}/{filename}"
        image_doc =  images.find_one({"filename": filename})
        if image_doc:
            return {"status": "ok", "filename": filename, "url": image_doc["url"]}
        else:
            return {"status": "error", "message": "Image not found"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
async def list_images():
    try:
        images_list = images.find()
        return {"status": "ok", "images": [{"url": img["url"], "filename": img["filename"]} for img in images_list]}
    except Exception as e:
        return {"status": "error", "message": str(e)}