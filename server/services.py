
from PIL import Image
import requests

from transformers import CLIPProcessor, CLIPModel

def get_status_from_score(score):
    if score > 0.3:
        return "super match!! Great job!"
    elif score > 0.26:
        return "high match!! Well done!"
    elif score > 0.2:
        return "not bad but not good. Don't lose hope!"
    elif score > 0.17:
        return "low match. Keep trying!"
    else:
        return "no match. Please try again."