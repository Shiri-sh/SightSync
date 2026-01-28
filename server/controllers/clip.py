from fastapi import  Form, Request

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
        
        img_emb = images.find_one({"filename": data['image_name']}).get("embedding")
        img_emb = torch.tensor(img_emb)
        text_emb = request.app.state.clip_scorer.text_embedding(data['text'])

        score = request.app.state.clip_scorer.cosine_similarity(img_emb, text_emb)
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
        text_embedding = request.app.state.clip_scorer.text_embedding(data['text'])
        text_vec = text_embedding.squeeze()  # shape: (D,)

        results = []
        # iterate over images that have embeddings stored
        cursor = images.find({"embedding": {"$exists": True}})
        docs=list(cursor)

        for doc in docs:
            db_emb = doc.get("embedding")
            if not db_emb:
                continue
            db_vec = torch.tensor(db_emb)
            score = request.app.state.clip_scorer.cosine_similarity(text_vec, db_vec)
            status = get_status_from_score(score)

            # include only images that are considered a match
            if score > 0.2:
                results.append({
                    "filename": doc.get("filename"),
                    "score": score,
                    "status": status
                })

        results.sort(key=lambda x: x['score'], reverse=True)
        
        return {"status": "ok", "matches": results}
    except Exception as e:
        return {"status": "error", "message": str(e)}