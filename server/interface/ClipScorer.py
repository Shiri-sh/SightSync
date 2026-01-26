
from PIL import Image
import requests
import torch
from transformers import CLIPProcessor, CLIPModel,AutoProcessor

class ClipScorer:
    
    def __init__(self):
        
        self.model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32",local_files_only=True)
        self.processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32",local_files_only=True)
        self.model.eval()
    def text_embedding(self, text):
        text_inputs = self.processor(text=[text], return_tensors="pt", padding=True)
        with torch.inference_mode():
            text_features = self.model.get_text_features(**text_inputs)
            text_features = text_features / text_features.norm(dim=-1, keepdim=True)
        return text_features

    def image_embedding(self, img):
        image_inputs = self.processor(images=img, return_tensors="pt")
        with torch.inference_mode():
            image_features = self.model.get_image_features(**image_inputs)
            image_features = image_features / image_features.norm(dim=-1, keepdim=True)
        return image_features

    def cosine_similarity(self, vec_a, vec_b):
        with torch.inference_mode():
            similarity = (vec_a @ vec_b.T).item()
        return similarity

    def score(self, img, text):

        image_features = self.image_embedding(img)
        text_features = self.text_embedding(text)

        score = self.cosine_similarity(image_features, text_features)

        print("Score:", score)
        return score
    