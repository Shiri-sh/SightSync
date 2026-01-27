from pymongo.mongo_client import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
mongoDB_password = os.getenv("MONGO_DB_PASSWORD")

uri = f"mongodb+srv://shirishahor_db_user:{mongoDB_password}@firstcluster.dnvquqi.mongodb.net/?appName=firstCluster"
client = MongoClient(uri)

db = client["images_db"]
images = db["images"]

result = images.delete_many({})

print(f"Deleted {result.deleted_count} documents from images collection.")
