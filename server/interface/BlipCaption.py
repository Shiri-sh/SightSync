import requests
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
import random 
import torch
class BlipCaption:
    def __init__(self):
        self.processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base", local_files_only=True)
        self.model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base", local_files_only=True)

    def generate_caption(self, image: Image.Image, text: str = None, seed=None) -> str:
        if seed is None:
            seed = random.randint(0, 1_000_000)

        torch.manual_seed(seed)

        inputs = self.processor(image, text, return_tensors="pt") if text else self.processor(image, return_tensors="pt")
        out = self.model.generate(
            **inputs,
            do_sample=True,
            temperature=0.9,
            top_p=0.95,
        )
        generated_caption = self.processor.decode(out[0], skip_special_tokens=True)
        print("Generated caption:", generated_caption)
        return generated_caption

