from fastapi import APIRouter
from controllers.clip import clip_score, img_by_description

router = APIRouter()
router.post("/clip_score")(clip_score)
router.post("/img_by_description")(img_by_description)
