from fastapi import  Form, Request
#from server.server.clipScorer import *
# from server.interface.ClipScorer import ClipScorer
from PIL import Image
from mongoDB import images
from services import get_status_from_score
import torch

IMAGE_DIR = "images/"
async def clip_score(
    request: Request,
    data: dict
):
    try:
        
        img = Image.open(f"{IMAGE_DIR}/{data['image_name']}")

        img_emb = request.app.state.clip_scorer.image_embedding(img)

        img_emb = img_emb.squeeze().tolist()

        if images.find_one({"filename": data['image_name']}).get("embedding") is not None:
            images.update_one({"filename": data['image_name']}, {"$set": {"embedding": img_emb}})

        score = request.app.state.clip_scorer.score(img, data['text'])
        status_score = get_status_from_score(score)

        return {
            "status": "ok",
            "filename": data['image_name'],
            "text_received": data['text'],
            "analyze_score": status_score,
            "score": score
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

def img_by_description(
    request: Request,
    data: dict
):
    try:
        # get normalized text embedding (1 x D)
        text_embedding = request.app.state.clip_scorer.text_embedding(data['text'])
        text_vec = text_embedding.squeeze()  # shape: (D,)

        results = []
        # iterate over images that have embeddings stored
        cursor = images.find({"embedding": {"$exists": True}})
        print("cursor found", cursor)
        for doc in cursor:
            db_emb = doc.get("embedding")
            if not db_emb:
                continue
            db_vec = torch.tensor(db_emb)
            score = request.app.state.clip_scorer.cosine_similarity(text_vec, db_vec)
            status = get_status_from_score(score)
            # include only images that are considered a match by the status function
            if status != "no match. Please try again.":
                results.append({
                    "filename": doc.get("filename"),
                    "score": score,
                    "status": status
                })

        # sort by descending score
        results.sort(key=lambda x: x['score'], reverse=True)

        return {"status": "ok", "matches": results}
    except Exception as e:
        return {"status": "error", "message": str(e)}