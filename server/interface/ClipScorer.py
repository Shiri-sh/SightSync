from PIL import Image

import requests

from transformers import CLIPProcessor, CLIPModel

class ClipScorer:
    
    def __init__(self):
        
        self.model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        self.processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        self.model.eval()

    def score(self, img, text):
        inputs = self.processor(text=[text], images=img, return_tensors="pt", padding=True)
        outputs = self.model(**inputs)
        logits_per_image = outputs.logits_per_image
        return logits_per_image