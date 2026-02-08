
from transformers import BlipProcessor, BlipForConditionalGeneration

BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")

BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
