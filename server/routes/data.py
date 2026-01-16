from fastapi import APIRouter
from controllers.data import upload_img, list_images, get_img

router = APIRouter()
router.post("/upload_img")(upload_img)
router.get("/list_images")(list_images)
router.post("/get_img")(get_img)
