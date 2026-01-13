from fastapi import APIRouter
from controllers.data import upload_img

router = APIRouter()

router.post("/upload_img")(upload_img)
