from fastapi import APIRouter
from controllers.clip import clip_score

router = APIRouter()
router.post("/clip_score")(clip_score)
