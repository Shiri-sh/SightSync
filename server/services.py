
from PIL import Image
import requests

from transformers import CLIPProcessor, CLIPModel

def get_status_from_score(score):
    if score > 0.8:
        return "high match"
    elif score > 0.5:
        return "potential match"
    else:
        return "no match"