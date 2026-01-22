from pymongo.mongo_client import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
mongoDB_password = os.getenv("MONGO_DB_PASSWORD")

uri = f"mongodb+srv://shirishahor_db_user:{mongoDB_password}@firstcluster.dnvquqi.mongodb.net/?appName=firstCluster"
# Create a new client and connect to the server
client = MongoClient(uri)
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)