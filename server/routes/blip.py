from fastapi import APIRouter
from controllers.blip import blip_img_anlz

router = APIRouter()
router.post("/blip_img_anlz")(blip_img_anlz)