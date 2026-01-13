from fastapi import FastAPI, UploadFile, File, Form
from PIL import Image

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