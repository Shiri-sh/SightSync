import os, certifi, ssl
os.environ["SSL_CERT_FILE"] = certifi.where()
os.environ["REQUESTS_CA_BUNDLE"] = certifi.where()
os.environ["HF_HUB_DISABLE_SSL_VERIFICATION"] = "1"
ssl._create_default_https_context = ssl._create_unverified_context

from PIL import Image
import requests
from transformers import CLIPProcessor, CLIPModel,AutoProcessor


#set HF_HUB_DISABLE_SSL_VERIFICATION=1

class ClipScorer:
    
    def __init__(self):
        
        self.model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32",local_files_only=True)
        self.processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32",local_files_only=True)
        self.model.eval()

    def score(self, img, text):
        inputs = self.processor(text=[text], images=img, return_tensors="pt", padding=True)
        # with torch.inference_mode():
        #     outputs = model(**inputs)
        outputs = self.model(**inputs)
        logits_per_image_text = outputs.logits_per_image
        print("logits_per_image_text:", logits_per_image_text)

        probs=logits_per_image_text.softmax(dim=1)
        print("Probabilities:", probs)
        return probs