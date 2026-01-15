from transformers import CLIPModel, CLIPProcessor

print("Downloading CLIP model...")
CLIPModel.from_pretrained("openai/clip-vit-base-patch32")

print("Downloading CLIP processor...")
CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

print("Done.")
