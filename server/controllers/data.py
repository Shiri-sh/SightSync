from fastapi import FastAPI, UploadFile, File, Form
from PIL import Image


async def upload_img(
    image: UploadFile=File(...)
):
    img = Image.open(image.file)
    
    return {"filename": image.filename}