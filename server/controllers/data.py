from fastapi import FastAPI, UploadFile, File, Form
from PIL import Image
import os
DIR_PATH = "images/"
async def upload_img(
    image: UploadFile=File(...)
):
    try:
        print(image.filename)
        path = f"{DIR_PATH}/{image.filename}"
        with open(path, "wb") as f:
            f.write(await image.read())

            return {"status": "ok", "filename": image.filename}
    except Exception as e:
        return {"status": "error", "message": str(e)}
async def get_img(
    filename: str = Form(...)
):
    try:
        path = f"{DIR_PATH}/{filename}"
        with open(path, "rb") as f:
            return {"status": "ok", "filename": filename, "image": f.read()}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
async def list_images():
    try:
        images = os.listdir(DIR_PATH)
        return {"status": "ok", "images": images}
    except Exception as e:
        return {"status": "error", "message": str(e)}